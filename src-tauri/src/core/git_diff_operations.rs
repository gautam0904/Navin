use crate::core::git_diff_helpers::diff_to_file_diffs;
use crate::core::git_error::GitResult;
use crate::models::git_repository::{FileDiff, FileStatusType};
use git2::Repository as Git2Repository;
use std::path::Path;
use tracing::{debug, info, instrument};

/// Extension trait for diff operations
pub trait GitDiffOperations {
    fn get_file_diff_unstaged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff>;
    fn get_file_diff_staged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff>;
    fn get_diff_between_commits(&self, commit1: &str, commit2: &str) -> GitResult<Vec<FileDiff>>;
}

impl GitDiffOperations for Git2Repository {
    #[instrument(skip(self, path), fields(path = %path.as_ref().display()))]
    fn get_file_diff_unstaged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        let path = path.as_ref();
        info!("Getting unstaged diff for file");

        let mut diff_options = git2::DiffOptions::new();
        diff_options.pathspec(path);

        let diff = self.diff_index_to_workdir(None, Some(&mut diff_options))?;
        let file_diffs = diff_to_file_diffs(&diff)?;

        file_diffs.into_iter().next().ok_or_else(|| {
            crate::core::git_error::GitError::FileNotFound(path.to_string_lossy().to_string())
        })
    }

    #[instrument(skip(self, path), fields(path = %path.as_ref().display()))]
    fn get_file_diff_staged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        let path = path.as_ref();
        info!("Getting staged diff for file");

        let head = self.head()?.peel_to_tree()?;

        let mut diff_options = git2::DiffOptions::new();
        diff_options.pathspec(path);

        let diff = self.diff_tree_to_index(Some(&head), None, Some(&mut diff_options))?;
        let file_diffs = diff_to_file_diffs(&diff)?;

        // If no diff found, return empty diff
        if file_diffs.is_empty() {
            return Ok(FileDiff {
                old_path: Some(path.to_string_lossy().to_string()),
                new_path: Some(path.to_string_lossy().to_string()),
                status: FileStatusType::Modified,
                hunks: Vec::new(),
                binary: false,
                additions: 0,
                deletions: 0,
            });
        }

        Ok(file_diffs.into_iter().next().unwrap())
    }

    #[instrument(skip(self))]
    fn get_diff_between_commits(&self, commit1: &str, commit2: &str) -> GitResult<Vec<FileDiff>> {
        info!(commit1, commit2, "Getting diff between commits");

        let oid1 = git2::Oid::from_str(commit1)?;
        let oid2 = git2::Oid::from_str(commit2)?;

        let tree1 = self.find_commit(oid1)?.tree()?;
        let tree2 = self.find_commit(oid2)?.tree()?;

        let diff = self.diff_tree_to_tree(Some(&tree1), Some(&tree2), None)?;
        let file_diffs = diff_to_file_diffs(&diff)?;

        debug!(
            file_count = file_diffs.len(),
            "Diff between commits retrieved"
        );
        Ok(file_diffs)
    }
}
