use crate::core::git_error::GitResult;
use crate::models::git_repository::Stash;
use chrono::{TimeZone, Utc};
use git2::Repository as Git2Repository;
use tracing::{info, instrument};

/// Extension trait for GitEngine to handle stash operations
pub trait GitStashOperations {
    fn create_stash(&mut self, message: Option<&str>) -> GitResult<String>;
    fn list_stashes(&mut self) -> GitResult<Vec<Stash>>;
    fn apply_stash(&mut self, index: usize) -> GitResult<()>;
    fn pop_stash(&mut self, index: usize) -> GitResult<()>;
    fn drop_stash(&mut self, index: usize) -> GitResult<()>;
}

impl GitStashOperations for Git2Repository {
    #[instrument(skip(self))]
    fn create_stash(&mut self, message: Option<&str>) -> GitResult<String> {
        info!(?message, "Creating stash");

        let signature = self.signature()?;
        let mut stash_id = git2::Oid::zero();

        let msg = message.unwrap_or("WIP");

        self.stash_save(&signature, msg, Some(git2::StashFlags::DEFAULT))
            .map(|oid| {
                stash_id = oid;
            })?;

        info!(oid = %stash_id, "Stash created successfully");
        Ok(stash_id.to_string())
    }

    #[instrument(skip(self))]
    fn list_stashes(&mut self) -> GitResult<Vec<Stash>> {
        info!("Listing stashes");

        // First collect basic stash info without accessing self in closure
        let mut stash_data: Vec<(usize, String, git2::Oid)> = Vec::new();

        self.stash_foreach(|index, name, oid| {
            stash_data.push((index, name.to_string(), *oid));
            true
        })?;

        // Then build full stash objects with timestamps
        let stashes: Vec<Stash> = stash_data
            .into_iter()
            .map(|(index, message, oid)| {
                let timestamp = if let Ok(commit) = self.find_commit(oid) {
                    Utc.timestamp_opt(commit.time().seconds(), 0)
                        .single()
                        .unwrap_or_else(|| Utc::now())
                } else {
                    Utc::now()
                };

                Stash {
                    index,
                    message,
                    commit_sha: oid.to_string(),
                    timestamp,
                    branch: None,
                }
            })
            .collect();

        info!(count = stashes.len(), "Stashes listed");
        Ok(stashes)
    }

    #[instrument(skip(self))]
    fn apply_stash(&mut self, index: usize) -> GitResult<()> {
        info!(index, "Applying stash");

        let mut apply_options = git2::StashApplyOptions::new();
        apply_options.reinstantiate_index();

        self.stash_apply(index, Some(&mut apply_options))?;

        info!("Stash applied successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn pop_stash(&mut self, index: usize) -> GitResult<()> {
        info!(index, "Popping stash");

        let mut apply_options = git2::StashApplyOptions::new();
        apply_options.reinstantiate_index();

        self.stash_pop(index, Some(&mut apply_options))?;

        info!("Stash popped successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn drop_stash(&mut self, index: usize) -> GitResult<()> {
        info!(index, "Dropping stash");
        self.stash_drop(index)?;
        info!("Stash dropped successfully");
        Ok(())
    }
}
