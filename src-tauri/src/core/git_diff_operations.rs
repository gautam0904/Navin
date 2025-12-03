use crate::core::git_error::GitResult;
use crate::models::git_repository::FileDiff;
use git2::Repository as Git2Repository;
use std::path::Path;
use tracing::{info, instrument};

/// Extension trait for GitEngine to handle diff operations
pub trait GitDiffOperations {
    fn get_file_diff_unstaged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff>;
    fn get_file_diff_staged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff>;
    fn get_diff_between_commits(&self, commit1: &str, commit2: &str) -> GitResult<Vec<FileDiff>>;
}

impl GitDiffOperations for Git2Repository {
    #[instrument(skip(self, path), fields(file = %path.as_ref().display()))]
    fn get_file_diff_unstaged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        info!("Getting unstaged diff for file");
        let path_ref = path.as_ref();
        let path_str = path_ref.to_string_lossy().replace('\\', "/");

        // Get diff between HEAD and working directory
        let head = self.head()?.peel_to_tree()?;
        let mut opts = git2::DiffOptions::new();
        opts.pathspec(&path_str);

        let diff = self.diff_tree_to_workdir_with_index(Some(&head), Some(&mut opts))?;

        let file_diffs = super::git_history_operations::diff_to_file_diffs(&diff)?;

        file_diffs
            .into_iter()
            .next()
            .ok_or_else(|| git2::Error::from_str("No diff found for file").into())
    }

    #[instrument(skip(self, path), fields(file = %path.as_ref().display()))]
    fn get_file_diff_staged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        info!("Getting staged diff for file");
        let path_ref = path.as_ref();
        let path_str = path_ref.to_string_lossy().replace('\\', "/");

        // Get diff between HEAD and index (staged changes)
        let head = self.head()?.peel_to_tree()?;
        let mut opts = git2::DiffOptions::new();
        opts.pathspec(&path_str);

        let diff = self.diff_tree_to_index(Some(&head), None, Some(&mut opts))?;

        let file_diffs = super::git_history_operations::diff_to_file_diffs(&diff)?;

        file_diffs
            .into_iter()
            .next()
            .ok_or_else(|| git2::Error::from_str("No diff found for file").into())
    }

    #[instrument(skip(self))]
    fn get_diff_between_commits(&self, commit1: &str, commit2: &str) -> GitResult<Vec<FileDiff>> {
        info!(commit1, commit2, "Getting diff between commits");

        let oid1 = git2::Oid::from_str(commit1)?;
        let oid2 = git2::Oid::from_str(commit2)?;

        let commit1_obj = self.find_commit(oid1)?;
        let commit2_obj = self.find_commit(oid2)?;

        let tree1 = commit1_obj.tree()?;
        let tree2 = commit2_obj.tree()?;

        let diff = self.diff_tree_to_tree(Some(&tree1), Some(&tree2), None)?;

        super::git_history_operations::diff_to_file_diffs(&diff)
    }
}
