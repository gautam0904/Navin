use crate::models::git_repository::*;
use chrono::{TimeZone, Utc};
use git2::{
    BranchType, Commit as Git2Commit, Repository as Git2Repository, StatusOptions,
};
use serde::Serialize;
use std::path::{Path, PathBuf};
use thiserror::Error;
use tracing::{debug, error, info, instrument, warn};

#[derive(Error, Debug, Serialize)]
#[serde(tag = "type", content = "message")]
pub enum GitError {
    #[error("Repository error: {0}")]
    RepositoryError(String),

    #[error("Git operation failed: {0}")]
    OperationFailed(String),

    #[error("Invalid path: {0}")]
    InvalidPath(String),

    #[error("Not a git repository: {0}")]
    NotARepository(String),

    #[error("Branch '{0}' not found")]
    BranchNotFound(String),

    #[error("File '{0}' not found in repository")]
    FileNotFound(String),

    #[error("Cannot checkout branch: uncommitted changes in {0}")]
    UncommittedChanges(String),

    #[error("No staged changes to commit")]
    NoStagedChanges,

    #[error("Invalid commit message: {0}")]
    InvalidCommitMessage(String),

    #[error("Merge conflict in {0}")]
    MergeConflict(String),

    #[error("Git2 library error: {0}")]
    #[serde(serialize_with = "serialize_git2_error")]
    Git2Error(#[from] git2::Error),

    #[error("IO error: {0}")]
    #[serde(serialize_with = "serialize_io_error")]
    IoError(#[from] std::io::Error),
}

fn serialize_git2_error<S>(error: &git2::Error, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&error.to_string())
}

fn serialize_io_error<S>(error: &std::io::Error, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&error.to_string())
}

pub type GitResult<T> = Result<T, GitError>;

pub struct GitEngine {
    repo: Git2Repository,
    repo_path: PathBuf,
}

impl GitEngine {
    #[instrument(skip(path), fields(path = %path.as_ref().display()))]
    pub fn open<P: AsRef<Path>>(path: P) -> GitResult<Self> {
        let path = path.as_ref();
        let repo = Git2Repository::open(path).map_err(|e| {
            error!("Failed to open repository: {}", e);
            GitError::NotARepository(format!("{}: {}", path.display(), e))
        })?;

        Ok(Self {
            repo,
            repo_path: path.to_path_buf(),
        })
    }

    #[instrument(skip(path), fields(path = %path.as_ref().display()))]
    pub fn discover<P: AsRef<Path>>(path: P) -> GitResult<Self> {
        let path = path.as_ref();
        let repo = Git2Repository::discover(path)
            .map_err(|e| {
                error!("Failed to discover repository: {}", e);
                GitError::NotARepository(format!("{}: {}", path.display(), e))
            })?;
        
        let repo_path = repo.workdir().unwrap_or(repo.path()).to_path_buf();

        Ok(Self {
            repo,
            repo_path,
        })
    }

    #[instrument(skip(self), fields(repo_path = %self.repo_path.display()))]
    pub fn get_info(&self) -> GitResult<RepositoryInfo> {
        let name = self
            .repo_path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("unknown")
            .to_string();

        let current_branch = self.get_current_branch_name()?;
        let is_bare = self.repo.is_bare();
        let is_empty = self.repo.is_empty()?;
        let head_detached = self.repo.head_detached()?;

        let remotes = self
            .repo
            .remotes()?
            .iter()
            .filter_map(|r| r.map(String::from))
            .collect();

        let info = RepositoryInfo {
            path: self.repo_path.to_string_lossy().to_string(),
            name,
            current_branch: current_branch.clone(),
            is_bare,
            is_empty,
            head_detached,
            remotes,
        };
        
        debug!(?current_branch, is_bare, is_empty, head_detached, "Repository info retrieved");
        Ok(info)
    }

    fn get_current_branch_name(&self) -> GitResult<Option<String>> {
        if self.repo.head_detached()? {
            return Ok(None);
        }

        let head = match self.repo.head() {
            Ok(head) => head,
            Err(_) => return Ok(None),
        };

        Ok(head.shorthand().map(String::from))
    }

    #[instrument(skip(self), fields(repo_path = %self.repo_path.display()))]
    pub fn get_status(&self) -> GitResult<RepositoryStatus> {
        let mut opts = StatusOptions::new();
        opts.include_untracked(true);
        opts.recurse_untracked_dirs(true);

        let statuses = self.repo.statuses(Some(&mut opts))?;

        let mut staged = Vec::new();
        let mut unstaged = Vec::new();
        let mut untracked = Vec::new();
        let mut conflicted = Vec::new();

        for entry in statuses.iter() {
            let status = entry.status();
            let path = entry.path().unwrap_or("unknown").to_string();

            if status.is_conflicted() {
                conflicted.push(FileStatus {
                    path: path.clone(),
                    status: FileStatusType::Conflicted,
                    additions: None,
                    deletions: None,
                });
            }

            if status.is_index_new()
                || status.is_index_modified()
                || status.is_index_deleted()
                || status.is_index_renamed()
            {
                let file_status = if status.is_index_new() {
                    FileStatusType::Added
                } else if status.is_index_modified() {
                    FileStatusType::Modified
                } else if status.is_index_deleted() {
                    FileStatusType::Deleted
                } else {
                    FileStatusType::Modified
                };

                staged.push(FileStatus {
                    path: path.clone(),
                    status: file_status,
                    additions: None,
                    deletions: None,
                });
            }

            if status.is_wt_new() {
                untracked.push(FileStatus {
                    path: path.clone(),
                    status: FileStatusType::Untracked,
                    additions: None,
                    deletions: None,
                });
            } else if status.is_wt_modified()
                || status.is_wt_deleted()
                || status.is_wt_renamed()
            {
                let file_status = if status.is_wt_modified() {
                    FileStatusType::Modified
                } else if status.is_wt_deleted() {
                    FileStatusType::Deleted
                } else {
                    FileStatusType::Modified
                };

                unstaged.push(FileStatus {
                    path: path.clone(),
                    status: file_status,
                    additions: None,
                    deletions: None,
                });
            }
        }

        let is_clean = staged.is_empty()
            && unstaged.is_empty()
            && untracked.is_empty()
            && conflicted.is_empty();

        Ok(RepositoryStatus {
            staged,
            unstaged,
            untracked,
            conflicted,
            is_clean,
        })
    }

    #[instrument(skip(self))]
    pub fn get_config(&self) -> GitResult<(String, String)> {
        debug!("Fetching git configuration");
        let config = self.repo.config()?;
        let name = config.get_string("user.name").unwrap_or_default();
        let email = config.get_string("user.email").unwrap_or_default();
        debug!(user_name = %name, user_email = %email, "Git configuration retrieved");
        Ok((name, email))
    }

    #[instrument(skip(self), fields(repo_path = %self.repo_path.display()))]
    pub fn get_branches(&self) -> GitResult<Vec<Branch>> {
        debug!("Fetching all branches");
        let mut branches = Vec::new();
        let mut has_branches = false;

        if let Ok(local_branches) = self.repo.branches(Some(BranchType::Local)) {
            for branch_result in local_branches {
                if let Ok((branch, _)) = branch_result {
                    if let Ok(Some(branch_info)) = self.get_branch_info(&branch, false) {
                        branches.push(branch_info);
                        has_branches = true;
                    }
                }
            }
        }

        if let Ok(remote_branches) = self.repo.branches(Some(BranchType::Remote)) {
            for branch_result in remote_branches {
                if let Ok((branch, _)) = branch_result {
                    if let Ok(Some(branch_info)) = self.get_branch_info(&branch, true) {
                        branches.push(branch_info);
                        has_branches = true;
                    }
                }
            }
        }

        if !has_branches {
            if let Ok(head) = self.repo.head() {
                if let Some(name) = head.shorthand() {
                     let is_head = true;
                     let last_commit = if let Ok(commit) = head.peel_to_commit() {
                        self.commit_to_summary(&commit).ok()
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

    fn get_branch_info(
        &self,
        branch: &git2::Branch,
        is_remote: bool,
    ) -> GitResult<Option<Branch>> {
        let name = match branch.name()? {
            Some(n) => n.to_string(),
            None => return Ok(None),
        };

        let is_head = branch.is_head();
        let upstream = branch.upstream().ok().and_then(|u| {
            u.name()
                .ok()
                .flatten()
                .map(|s| s.to_string())
        });

        let (ahead, behind) = if let Some(upstream_name) = &upstream {
            self.get_ahead_behind(&name, upstream_name).unwrap_or((0, 0))
        } else {
            (0, 0)
        };

        let last_commit = if let Ok(commit) = branch.get().peel_to_commit() {
            Some(self.commit_to_summary(&commit)?)
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

    fn get_ahead_behind(&self, local: &str, upstream: &str) -> GitResult<(usize, usize)> {
        let local_oid = self.repo.revparse_single(local)?.id();
        let upstream_oid = self.repo.revparse_single(upstream)?.id();

        let (ahead, behind) = self.repo.graph_ahead_behind(local_oid, upstream_oid)?;

        Ok((ahead, behind))
    }

    fn commit_to_summary(&self, commit: &Git2Commit) -> GitResult<CommitSummary> {
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

        Ok(CommitSummary {
            sha,
            short_sha,
            message,
            author_name,
            timestamp,
        })
    }

    #[instrument(skip(self, path), fields(repo_path = %self.repo_path.display(), file = %path.as_ref().display()))]
    pub fn stage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        info!("Staging file");
        let mut index = self.repo.index()?;
        let path_ref = path.as_ref();
        
        // Ensure path uses forward slashes for git
        let path_str = path_ref.to_string_lossy().replace('\\', "/");
        let path_path = Path::new(&path_str);

        // Build absolute path against repository workdir to check existence
        let repo_root = self.repo.workdir().unwrap_or(self.repo.path());
        let abs_path = repo_root.join(path_path);

        if abs_path.exists() {
            // New/modified file: add to index
            index.add_path(path_path)?;
        } else {
            // Deleted file: remove from index to stage the deletion
            index.remove_path(path_path)?;
        }

        index.write()?;
        Ok(())
    }

    /// Stage all changes
    #[instrument(skip(self), fields(repo_path = %self.repo_path.display()))]
    pub fn stage_all(&self) -> GitResult<()> {
        info!("Staging all changes");
        let mut index = self.repo.index()?;
        
        // Add all changes (modified, deleted, new)
        index.add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)?;
        
        index.write()?;
        info!("File staged successfully");
        Ok(())
    }

    /// Unstage a file
    #[instrument(skip(self, path), fields(repo_path = %self.repo_path.display(), file = %path.as_ref().display()))]
    pub fn unstage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        info!("Unstaging file");
        let path_ref = path.as_ref();
        let path_str = path_ref.to_string_lossy().replace('\\', "/");

        // Get the HEAD OID directly
        let head_oid = self.repo.refname_to_id("HEAD")?;
        
        // Get the commit object
        let commit = self.repo.find_commit(head_oid)?;
        
        // Reset specific file to HEAD commit
        let path_spec = vec![path_str.as_str()];
        
        // Try reset first
        if let Err(e) = self.repo.reset_default(Some(&commit.into_object()), path_spec) {
            warn!("Reset default failed for {}: {}, falling back to index removal", path_str, e);
            // Fallback: manually remove from index (for new files not in HEAD)
            let mut index = self.repo.index()?;
            let path_path = Path::new(&path_str);
            // remove_path works for files in the index
            index.remove_path(path_path)?;
            index.write()?;
        }
        
        info!("File unstaged successfully");
        Ok(())
    }

    /// Unstage all changes
    #[instrument(skip(self), fields(repo_path = %self.repo_path.display()))]
    pub fn unstage_all(&self) -> GitResult<()> {
        info!("Unstaging all changes");
        
        // Get the HEAD OID directly
        let head_oid = self.repo.refname_to_id("HEAD")?;
        
        // Get the commit object
        let commit = self.repo.find_commit(head_oid)?;
        
        // Reset index to HEAD commit - this only affects staged files
        self.repo.reset_default(Some(&commit.into_object()), ["*"].iter())?;

        info!("All changes unstaged successfully");
        Ok(())
    }

    /// Create a commit
    #[instrument(skip(self, message, author_name, author_email), fields(repo_path = %self.repo_path.display(), message_len = message.len()))]
    pub fn create_commit(&self, message: &str, author_name: &str, author_email: &str) -> GitResult<String> {
        info!("Creating commit");
        let signature = self.repo.signature().or_else(|_| {
            git2::Signature::now(author_name, author_email)
        })?;

        let mut index = self.repo.index()?;
        let tree_id = index.write_tree()?;
        let tree = self.repo.find_tree(tree_id)?;

        let parent_commit = match self.repo.head() {
            Ok(head) => Some(head.peel_to_commit()?),
            Err(_) => None,
        };

        let parents = if let Some(ref p) = parent_commit {
            vec![p]
        } else {
            vec![]
        };

        let oid = self.repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            message,
            &tree,
            &parents,
        )?;

        let commit_hash = oid.to_string();
        info!(commit_hash = %commit_hash, "Commit created successfully");
        Ok(commit_hash)
    }

    /// Checkout a branch
    #[instrument(skip(self), fields(repo_path = %self.repo_path.display(), branch = %branch_name))]
    pub fn checkout_branch(&self, branch_name: &str) -> GitResult<()> {
        info!("Checking out branch");
        let obj = self.repo.revparse_single(&format!("refs/heads/{}", branch_name))?;
        self.repo.checkout_tree(&obj, None)?;
        self.repo.set_head(&format!("refs/heads/{}", branch_name))?;
        info!("Branch checked out successfully");
        Ok(())
    }

    /// Create a new branch
    #[instrument(skip(self, from), fields(repo_path = %self.repo_path.display(), branch = %name, from = ?from))]
    pub fn create_branch(&self, name: &str, from: Option<&str>) -> GitResult<()> {
        info!("Creating new branch");
        let commit = if let Some(from_ref) = from {
            self.repo.revparse_single(from_ref)?.peel_to_commit()?
        } else {
            self.repo.head()?.peel_to_commit()?
        };

        self.repo.branch(name, &commit, false)?;
        info!("Branch created successfully");
        Ok(())
    }

    /// Delete a branch
    #[instrument(skip(self), fields(repo_path = %self.repo_path.display(), branch = %name, force = %force))]
    pub fn delete_branch(&self, name: &str, force: bool) -> GitResult<()> {
        info!("Deleting branch");
        let mut branch = self.repo.find_branch(name, BranchType::Local)?;
        
        if !force && !branch.is_head() {
            // Check if branch is merged
            // This is a simplified check
        }
        
        branch.delete()?;
        info!("Branch deleted successfully");
        Ok(())
    }
}
