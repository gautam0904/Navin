use crate::core::git_error::{GitError, GitResult};
use crate::models::git_repository::*;
use git2::{Repository as Git2Repository, StatusOptions};
use std::path::{Path, PathBuf};
use tracing::{debug, error, instrument};

pub struct GitEngine {
    pub(crate) repo: Git2Repository,
    pub(crate) repo_path: PathBuf,
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

        // Try local first, then fall back to global
        let name = config.get_string("user.name").unwrap_or_default();
        let email = config.get_string("user.email").unwrap_or_default();

        debug!(user_name = %name, user_email = %email, "Git configuration retrieved");
        Ok((name, email))
    }

    #[instrument(skip(self))]
    pub fn get_config_detailed(&self) -> GitResult<(String, String, String, String)> {
        debug!("Fetching detailed git configuration");

        // Get global config
        let global_config = git2::Config::open_default()?;
        let global_name = global_config.get_string("user.name").unwrap_or_default();
        let global_email = global_config.get_string("user.email").unwrap_or_default();

        // Get local/repo config
        let local_config = self.repo.config()?;
        let local_name = local_config.get_string("user.name").unwrap_or_default();
        let local_email = local_config.get_string("user.email").unwrap_or_default();

        debug!(
            global_name = %global_name, global_email = %global_email,
            local_name = %local_name, local_email = %local_email,
            "Detailed git configuration retrieved"
        );

        Ok((global_name, global_email, local_name, local_email))
    }

    #[instrument(skip(self))]
    pub fn set_config(&self, name: &str, email: &str, global: bool) -> GitResult<()> {
        debug!(global, "Setting git configuration");

        if global {
            let mut config = git2::Config::open_default()?;
            config.set_str("user.name", name)?;
            config.set_str("user.email", email)?;
            debug!(user_name = %name, user_email = %email, "Global git configuration updated");
        } else {
            let mut config = self.repo.config()?;
            config.set_str("user.name", name)?;
            config.set_str("user.email", email)?;
            debug!(user_name = %name, user_email = %email, "Local git configuration updated");
        }

        Ok(())
    }
}
