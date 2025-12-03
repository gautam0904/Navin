use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize)]
#[serde(tag = "type", content = "message")]
pub enum GitError {
    #[error("Repository error: {0}")]
    RepositoryError(String),

    #[error("Git operation failed: {0}")]
    OperationFailed(String),

    #[error("Invalid path: {0}")]
    InvalidPath(String),

    #[error("Not a git repository: {0}")]
    NotARepository(String),

    #[error("Branch '{0}' not found")]
    BranchNotFound(String),

    #[error("File '{0}' not found in repository")]
    FileNotFound(String),

    #[error("Cannot checkout branch: uncommitted changes in {0}")]
    UncommittedChanges(String),

    #[error("No staged changes to commit")]
    NoStagedChanges,

    #[error("Invalid commit message: {0}")]
    InvalidCommitMessage(String),

    #[error("Merge conflict in {0}")]
    MergeConflict(String),

    #[error("Git2 library error: {0}")]
    #[serde(serialize_with = "serialize_git2_error")]
    Git2Error(#[from] git2::Error),

    #[error("IO error: {0}")]
    #[serde(serialize_with = "serialize_io_error")]
    IoError(#[from] std::io::Error),
}

fn serialize_git2_error<S>(error: &git2::Error, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&error.to_string())
}

fn serialize_io_error<S>(error: &std::io::Error, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&error.to_string())
}

pub type GitResult<T> = Result<T, GitError>;
