pub mod error;
pub mod logging;
pub mod result;
pub mod validation;

// Git engine modules
pub mod git_branch_ops;
pub mod git_diff_helpers;
pub mod git_diff_operations;
pub mod git_engine;
mod git_engine_delegates;
pub mod git_error;
pub mod git_history_operations;
pub mod git_operations;
pub mod git_remote_operations;
pub mod git_stash_operations;

// Re-export commonly used types
pub use git_engine::GitEngine;
pub use git_error::{GitError, GitResult};
