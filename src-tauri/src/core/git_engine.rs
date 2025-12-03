use crate::core::git_branch_ops::GitBranchOps;
use crate::core::git_error::{GitError, GitResult};
use crate::core::git_operations::GitOperations;
use crate::models::git_repository::*;
use git2::{Repository as Git2Repository, StatusOptions};
use std::path::{Path, PathBuf};
use tracing::{debug, error, instrument};

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
        let repo = Git2Repository::discover(path).map_err(|e| {
            error!("Failed to discover repository: {}", e);
            GitError::NotARepository(format!("{}: {}", path.display(), e))
        })?;

        let repo_path = repo.workdir().unwrap_or(repo.path()).to_path_buf();

        Ok(Self { repo, repo_path })
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

        debug!(
            ?current_branch,
            is_bare, is_empty, head_detached, "Repository info retrieved"
        );
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
            } else if status.is_wt_modified() || status.is_wt_deleted() || status.is_wt_renamed() {
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

    #[instrument(skip(self))]
    pub fn set_config(&self, name: &str, email: &str) -> GitResult<()> {
        debug!("Setting git configuration");
        let mut config = self.repo.config()?;
        config.set_str("user.name", name)?;
        config.set_str("user.email", email)?;
        debug!(user_name = %name, user_email = %email, "Git configuration updated");
        Ok(())
    }

    // Delegate to extension traits
    pub fn stage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        self.repo.stage_file(path)
    }

    pub fn stage_all(&self) -> GitResult<()> {
        self.repo.stage_all()
    }

    pub fn unstage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        self.repo.unstage_file(path)
    }

    pub fn unstage_all(&self) -> GitResult<()> {
        self.repo.unstage_all()
    }

    pub fn create_commit(
        &self,
        message: &str,
        author_name: &str,
        author_email: &str,
    ) -> GitResult<String> {
        self.repo.create_commit(message, author_name, author_email)
    }

    pub fn get_branches(&self) -> GitResult<Vec<Branch>> {
        self.repo.get_branches()
    }

    pub fn checkout_branch(&self, branch_name: &str) -> GitResult<()> {
        self.repo.checkout_branch(branch_name)
    }

    pub fn create_branch(&self, name: &str, from: Option<&str>) -> GitResult<()> {
        self.repo.create_branch(name, from)
    }

    pub fn delete_branch(&self, name: &str, force: bool) -> GitResult<()> {
        self.repo.delete_branch(name, force)
    }
}
