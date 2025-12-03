use crate::core::git_error::GitResult;
use crate::models::git_repository::Remote;
use git2::Repository as Git2Repository;
use tracing::{info, instrument};

/// Extension trait for GitEngine to handle remote operations
pub trait GitRemoteOperations {
    fn list_remotes(&self) -> GitResult<Vec<Remote>>;
    fn add_remote(&self, name: &str, url: &str) -> GitResult<()>;
    fn remove_remote(&self, name: &str) -> GitResult<()>;
    fn fetch(&self, remote_name: &str) -> GitResult<()>;
    fn push(&self, remote_name: &str, branch: &str, force: bool) -> GitResult<()>;
    fn pull(&self, remote_name: &str, branch: &str) -> GitResult<()>;
}

impl GitRemoteOperations for Git2Repository {
    #[instrument(skip(self))]
    fn list_remotes(&self) -> GitResult<Vec<Remote>> {
        info!("Listing remotes");
        let remote_names = self.remotes()?;
        let mut remotes = Vec::new();

        for name in remote_names.iter().flatten() {
            if let Ok(remote) = self.find_remote(name) {
                let url = remote.url().unwrap_or("").to_string();
                let fetch_url = remote.url().map(String::from);
                let push_url = remote.pushurl().map(String::from);

                remotes.push(Remote {
                    name: name.to_string(),
                    url,
                    fetch_url,
                    push_url,
                });
            }
        }

        info!(count = remotes.len(), "Remotes listed");
        Ok(remotes)
    }

    #[instrument(skip(self))]
    fn add_remote(&self, name: &str, url: &str) -> GitResult<()> {
        info!(name, url, "Adding remote");
        self.remote(name, url)?;
        info!("Remote added successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn remove_remote(&self, name: &str) -> GitResult<()> {
        info!(name, "Removing remote");
        self.remote_delete(name)?;
        info!("Remote removed successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn fetch(&self, remote_name: &str) -> GitResult<()> {
        info!(remote_name, "Fetching from remote");
        let mut remote = self.find_remote(remote_name)?;

        let mut fetch_options = git2::FetchOptions::new();
        let mut callbacks = git2::RemoteCallbacks::new();

        callbacks.credentials(|_url, username_from_url, _allowed_types| {
            git2::Cred::ssh_key_from_agent(username_from_url.unwrap_or("git"))
        });

        fetch_options.remote_callbacks(callbacks);

        remote.fetch(&[] as &[&str], Some(&mut fetch_options), None)?;
        info!("Fetch completed successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn push(&self, remote_name: &str, branch: &str, force: bool) -> GitResult<()> {
        info!(remote_name, branch, force, "Pushing to remote");
        let mut remote = self.find_remote(remote_name)?;

        let mut push_options = git2::PushOptions::new();
        let mut callbacks = git2::RemoteCallbacks::new();

        callbacks.credentials(|_url, username_from_url, _allowed_types| {
            git2::Cred::ssh_key_from_agent(username_from_url.unwrap_or("git"))
        });

        push_options.remote_callbacks(callbacks);

        let refspec = if force {
            format!("+refs/heads/{}:refs/heads/{}", branch, branch)
        } else {
            format!("refs/heads/{}:refs/heads/{}", branch, branch)
        };

        remote.push(&[&refspec], Some(&mut push_options))?;
        info!("Push completed successfully");
        Ok(())
    }

    #[instrument(skip(self))]
    fn pull(&self, remote_name: &str, branch: &str) -> GitResult<()> {
        info!(remote_name, branch, "Pulling from remote");

        // First fetch
        self.fetch(remote_name)?;

        // Then merge
        let fetch_head = self.find_reference("FETCH_HEAD")?;
        let fetch_commit = self.reference_to_annotated_commit(&fetch_head)?;

        // Do a merge
        let analysis = self.merge_analysis(&[&fetch_commit])?;

        if analysis.0.is_fast_forward() {
            info!("Fast-forward merge");
            let refname = format!("refs/heads/{}", branch);
            let mut reference = self.find_reference(&refname)?;
            reference.set_target(fetch_commit.id(), "Fast-forward")?;
            self.set_head(&refname)?;
            self.checkout_head(Some(git2::build::CheckoutBuilder::default().force()))?;
        } else if analysis.0.is_normal() {
            info!("Normal merge");
            self.merge(&[&fetch_commit], None, None)?;
        } else {
            info!("Already up to date");
        }

        info!("Pull completed successfully");
        Ok(())
    }
}
