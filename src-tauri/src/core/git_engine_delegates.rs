use crate::core::git_branch_ops::GitBranchOps;
use crate::core::git_diff_operations::GitDiffOperations;
use crate::core::git_engine::GitEngine;
use crate::core::git_error::GitResult;
use crate::core::git_history_operations::GitHistoryOperations;
use crate::core::git_operations::GitOperations;
use crate::core::git_remote_operations::GitRemoteOperations;
use crate::models::git_repository::*;
use std::path::Path;

/// Delegate methods for GitEngine - Phase 1 operations
impl GitEngine {
    // Staging operations
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

    // Branch operations
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

    // Phase 2: History operations
    pub fn get_commits(&self, limit: usize, offset: usize) -> GitResult<Vec<CommitSummary>> {
        self.repo.get_commits(limit, offset)
    }

    pub fn get_commit_details(&self, sha: &str) -> GitResult<Commit> {
        self.repo.get_commit_details(sha)
    }

    pub fn get_commit_diff(&self, sha: &str) -> GitResult<Vec<FileDiff>> {
        self.repo.get_commit_diff(sha)
    }

    pub fn get_file_history(&self, file_path: &str, limit: usize) -> GitResult<Vec<CommitSummary>> {
        self.repo.get_file_history(file_path, limit)
    }

    // Phase 2: Diff operations
    pub fn get_file_diff_unstaged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        self.repo.get_file_diff_unstaged(path)
    }

    pub fn get_file_diff_staged<P: AsRef<Path>>(&self, path: P) -> GitResult<FileDiff> {
        self.repo.get_file_diff_staged(path)
    }

    pub fn get_diff_between_commits(
        &self,
        commit1: &str,
        commit2: &str,
    ) -> GitResult<Vec<FileDiff>> {
        self.repo.get_diff_between_commits(commit1, commit2)
    }

    // Phase 2: Remote operations
    pub fn list_remotes(&self) -> GitResult<Vec<Remote>> {
        self.repo.list_remotes()
    }

    pub fn add_remote(&self, name: &str, url: &str) -> GitResult<()> {
        self.repo.add_remote(name, url)
    }

    pub fn remove_remote(&self, name: &str) -> GitResult<()> {
        self.repo.remove_remote(name)
    }

    pub fn fetch(&self, remote_name: &str) -> GitResult<()> {
        self.repo.fetch(remote_name)
    }

    pub fn push(&self, remote_name: &str, branch: &str, force: bool) -> GitResult<()> {
        self.repo.push(remote_name, branch, force)
    }

    pub fn pull(&self, remote_name: &str, branch: &str) -> GitResult<()> {
        self.repo.pull(remote_name, branch)
    }
}
