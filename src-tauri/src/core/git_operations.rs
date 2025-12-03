use crate::core::git_error::GitResult;
use git2::Repository as Git2Repository;
use std::path::Path;
use tracing::{info, instrument, warn};

/// Extension trait for GitEngine to handle staging and commit operations
pub trait GitOperations {
    fn stage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()>;
    fn stage_all(&self) -> GitResult<()>;
    fn unstage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()>;
    fn unstage_all(&self) -> GitResult<()>;
    fn create_commit(
        &self,
        message: &str,
        author_name: &str,
        author_email: &str,
    ) -> GitResult<String>;
}

impl GitOperations for Git2Repository {
    #[instrument(skip(self, path), fields(file = %path.as_ref().display()))]
    fn stage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        info!("Staging file");
        let mut index = self.index()?;
        let path_ref = path.as_ref();

        // Ensure path uses forward slashes for git
        let path_str = path_ref.to_string_lossy().replace('\\', "/");
        let path_path = Path::new(&path_str);

        // Build absolute path against repository workdir to check existence
        let repo_root = self.workdir().unwrap_or(self.path());
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
    #[instrument(skip(self))]
    fn stage_all(&self) -> GitResult<()> {
        info!("Staging all changes");
        let mut index = self.index()?;

        // Add all changes (modified, deleted, new)
        index.add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)?;

        index.write()?;
        info!("All File staged successfully");
        Ok(())
    }

    /// Unstage a file
    #[instrument(skip(self, path), fields(file = %path.as_ref().display()))]
    fn unstage_file<P: AsRef<Path>>(&self, path: P) -> GitResult<()> {
        info!("Unstaging file");
        let path_ref = path.as_ref();
        let path_str = path_ref.to_string_lossy().replace('\\', "/");

        // Get the HEAD OID directly
        let head_oid = self.refname_to_id("HEAD")?;

        // Get the commit object
        let commit = self.find_commit(head_oid)?;

        // Reset specific file to HEAD commit
        let path_spec = vec![path_str.as_str()];

        // Try reset first
        if let Err(e) = self.reset_default(Some(&commit.into_object()), path_spec) {
            warn!(
                "Reset default failed for {}: {}, falling back to index removal",
                path_str, e
            );
            // Fallback: manually remove from index (for new files not in HEAD)
            let mut index = self.index()?;
            let path_path = Path::new(&path_str);
            // remove_path works for files in the index
            index.remove_path(path_path)?;
            index.write()?;
        }

        info!("File unstaged successfully");
        Ok(())
    }

    /// Unstage all changes
    #[instrument(skip(self))]
    fn unstage_all(&self) -> GitResult<()> {
        info!("Unstaging all changes");

        // Get the HEAD OID directly
        let head_oid = self.refname_to_id("HEAD")?;

        // Get the commit object
        let commit = self.find_commit(head_oid)?;

        // Reset index to HEAD commit - this only affects staged files
        self.reset_default(Some(&commit.into_object()), ["*"].iter())?;

        info!("All changes unstaged successfully");
        Ok(())
    }

    /// Create a commit
    #[instrument(skip(self, message, author_name, author_email), fields(message_len = message.len()))]
    fn create_commit(
        &self,
        message: &str,
        author_name: &str,
        author_email: &str,
    ) -> GitResult<String> {
        info!("Creating commit");
        let signature = self
            .signature()
            .or_else(|_| git2::Signature::now(author_name, author_email))?;

        let mut index = self.index()?;
        let tree_id = index.write_tree()?;
        let tree = self.find_tree(tree_id)?;

        let parent_commit = match self.head() {
            Ok(head) => Some(head.peel_to_commit()?),
            Err(_) => None,
        };

        let parents = if let Some(ref p) = parent_commit {
            vec![p]
        } else {
            vec![]
        };

        let oid = self.commit(
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
}
