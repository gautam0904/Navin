pub mod error;
pub mod logging;
pub mod result;
pub mod validation;

// Git engine modules
pub mod git_branch_ops;
pub mod git_engine;
pub mod git_error;
pub mod git_operations;

// Re-export commonly used types
pub use git_engine::GitEngine;
pub use git_error::{GitError, GitResult};
