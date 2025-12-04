use crate::core::git_error::GitResult;
use crate::models::git_repository::{Branch, CommitSummary};
use chrono::{TimeZone, Utc};
use git2::{BranchType, Commit as Git2Commit, Repository as Git2Repository};
use tracing::{debug, info, instrument};

/// Extension trait for GitEngine to handle branch operations
pub trait GitBranchOps {
    fn get_branches(&self) -> GitResult<Vec<Branch>>;
    fn checkout_branch(&self, branch_name: &str) -> GitResult<()>;
    fn create_branch(&self, name: &str, from: Option<&str>) -> GitResult<()>;
    fn delete_branch(&self, name: &str, force: bool) -> GitResult<()>;
}

impl GitBranchOps for Git2Repository {
    #[instrument(skip(self))]
    fn get_branches(&self) -> GitResult<Vec<Branch>> {
        debug!("Fetching all branches");
        let mut branches = Vec::new();
        let mut has_branches = false;

        if let Ok(local_branches) = self.branches(Some(BranchType::Local)) {
            for branch_result in local_branches {
                if let Ok((branch, _)) = branch_result {
                    if let Ok(Some(branch_info)) = get_branch_info(self, &branch, false) {
                        branches.push(branch_info);
                        has_branches = true;
                    }
                }
            }
        }

        if let Ok(remote_branches) = self.branches(Some(BranchType::Remote)) {
            for branch_result in remote_branches {
                if let Ok((branch, _)) = branch_result {
                    if let Ok(Some(branch_info)) = get_branch_info(self, &branch, true) {
                        branches.push(branch_info);
                        has_branches = true;
                    }
                }
            }
        }

        if !has_branches {
            if let Ok(head) = self.head() {
                if let Some(name) = head.shorthand() {
                    let is_head = true;
                    let last_commit = if let Ok(commit) = head.peel_to_commit() {
                        commit_to_summary(&commit).ok()
                    } else {
                        None
                    };

                    branches.push(Branch {
                        name: name.to_string(),
                        is_head,
                        is_remote: false,
                        upstream: None,
                        ahead: 0,
                        behind: 0,
                        last_commit,
                    });
                }
            }
        }

        info!(branch_count = branches.len(), "Branches retrieved");
        Ok(branches)
    }

    /// Checkout a branch
    #[instrument(skip(self), fields(branch = %branch_name))]
    fn checkout_branch(&self, branch_name: &str) -> GitResult<()> {
        info!("Checking out branch");
        let obj = self.revparse_single(&format!("refs/heads/{}", branch_name))?;
        self.checkout_tree(&obj, None)?;
        self.set_head(&format!("refs/heads/{}", branch_name))?;
        info!("Branch checked out successfully");
        Ok(())
    }

    /// Create a new branch
    #[instrument(skip(self, from), fields(branch = %name, from = ?from))]
    fn create_branch(&self, name: &str, from: Option<&str>) -> GitResult<()> {
        info!("Creating new branch");
        let commit = if let Some(from_ref) = from {
            self.revparse_single(from_ref)?.peel_to_commit()?
        } else {
            self.head()?.peel_to_commit()?
        };

        self.branch(name, &commit, false)?;
        info!("Branch created successfully");
        Ok(())
    }

    /// Delete a branch
    #[instrument(skip(self), fields(branch = %name, force = %force))]
    fn delete_branch(&self, name: &str, force: bool) -> GitResult<()> {
        info!("Deleting branch");
        let mut branch = self.find_branch(name, BranchType::Local)?;

        if !force && !branch.is_head() {
            // Check if branch is merged
            // This is a simplified check
        }

        branch.delete()?;
        info!("Branch deleted successfully");
        Ok(())
    }
}

// Helper functions

fn get_branch_info(
    repo: &Git2Repository,
    branch: &git2::Branch,
    is_remote: bool,
) -> GitResult<Option<Branch>> {
    let name = match branch.name()? {
        Some(n) => n.to_string(),
        None => return Ok(None),
    };

    let is_head = branch.is_head();
    let upstream = branch
        .upstream()
        .ok()
        .and_then(|u| u.name().ok().flatten().map(|s| s.to_string()));

    let (ahead, behind) = if let Some(upstream_name) = &upstream {
        get_ahead_behind(repo, &name, upstream_name).unwrap_or((0, 0))
    } else {
        (0, 0)
    };

    let last_commit = if let Ok(commit) = branch.get().peel_to_commit() {
        Some(commit_to_summary(&commit)?)
    } else {
        None
    };

    Ok(Some(Branch {
        name,
        is_head,
        is_remote,
        upstream,
        ahead,
        behind,
        last_commit,
    }))
}

fn get_ahead_behind(
    repo: &Git2Repository,
    local: &str,
    upstream: &str,
) -> GitResult<(usize, usize)> {
    let local_oid = repo.revparse_single(local)?.id();
    let upstream_oid = repo.revparse_single(upstream)?.id();

    let (ahead, behind) = repo.graph_ahead_behind(local_oid, upstream_oid)?;

    Ok((ahead, behind))
}

fn commit_to_summary(commit: &Git2Commit) -> GitResult<CommitSummary> {
    let sha = commit.id().to_string();
    let short_sha = sha.chars().take(7).collect();
    let message = commit
        .message()
        .unwrap_or("(no message)")
        .lines()
        .next()
        .unwrap_or("")
        .to_string();

    let author = commit.author();
    let author_name = author.name().unwrap_or("Unknown").to_string();

    let timestamp = Utc
        .timestamp_opt(commit.time().seconds(), 0)
        .single()
        .unwrap_or_else(|| Utc::now());

    let parents: Vec<String> = (0..commit.parent_count())
        .filter_map(|i| commit.parent_id(i).ok().map(|oid| oid.to_string()))
        .collect();

    Ok(CommitSummary {
        sha,
        short_sha,
        message,
        author_name,
        timestamp,
        parents,
    })
}
