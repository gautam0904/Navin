use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// Repository information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepositoryInfo {
    pub path: String,
    pub name: String,
    pub current_branch: Option<String>,
    pub is_bare: bool,
    pub is_empty: bool,
    pub head_detached: bool,
    pub remotes: Vec<String>,
}

/// Repository status summary
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepositoryStatus {
    pub staged: Vec<FileStatus>,
    pub unstaged: Vec<FileStatus>,
    pub untracked: Vec<FileStatus>,
    pub conflicted: Vec<FileStatus>,
    pub is_clean: bool,
}

/// File status information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileStatus {
    pub path: String,
    pub status: FileStatusType,
    pub additions: Option<usize>,
    pub deletions: Option<usize>,
}

/// File status type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FileStatusType {
    Added,
    Modified,
    Deleted,
    Renamed { old_path: String },
    Copied,
    Untracked,
    Ignored,
    Conflicted,
}

/// Branch information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Branch {
    pub name: String,
    pub is_head: bool,
    pub is_remote: bool,
    pub upstream: Option<String>,
    pub ahead: usize,
    pub behind: usize,
    pub last_commit: Option<CommitSummary>,
}

/// Commit information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Commit {
    pub sha: String,
    pub short_sha: String,
    pub message: String,
    pub body: Option<String>,
    pub author: Author,
    pub committer: Author,
    pub timestamp: DateTime<Utc>,
    pub parents: Vec<String>,
    pub tree_sha: String,
}

/// Commit summary (lightweight version)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitSummary {
    pub sha: String,
    pub short_sha: String,
    pub message: String,
    pub author_name: String,
    pub timestamp: DateTime<Utc>,
}

/// Author/Committer information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Author {
    pub name: String,
    pub email: String,
    pub timestamp: DateTime<Utc>,
}

/// File diff information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileDiff {
    pub old_path: Option<String>,
    pub new_path: Option<String>,
    pub status: FileStatusType,
    pub hunks: Vec<DiffHunk>,
    pub binary: bool,
    pub additions: usize,
    pub deletions: usize,
}

/// Diff hunk
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiffHunk {
    pub old_start: u32,
    pub old_lines: u32,
    pub new_start: u32,
    pub new_lines: u32,
    pub header: String,
    pub lines: Vec<DiffLine>,
}

/// Individual diff line
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiffLine {
    pub origin: DiffLineType,
    pub content: String,
    pub old_lineno: Option<u32>,
    pub new_lineno: Option<u32>,
}

/// Diff line type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DiffLineType {
    Context,
    Addition,
    Deletion,
    FileHeader,
    HunkHeader,
    Binary,
}

/// Tag information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub name: String,
    pub target_sha: String,
    pub message: Option<String>,
    pub tagger: Option<Author>,
    pub is_annotated: bool,
}

/// Stash entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stash {
    pub index: usize,
    pub message: String,
    pub commit_sha: String,
    pub timestamp: DateTime<Utc>,
}

/// Remote information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Remote {
    pub name: String,
    pub url: String,
    pub fetch_url: Option<String>,
    pub push_url: Option<String>,
}

/// Reflog entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReflogEntry {
    pub index: usize,
    pub old_sha: String,
    pub new_sha: String,
    pub message: String,
    pub committer: Author,
}

/// Merge result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MergeResult {
    pub success: bool,
    pub conflicts: Vec<String>,
    pub merged_commit: Option<String>,
}

/// Pull strategy
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PullStrategy {
    Merge,
    Rebase,
    FastForwardOnly,
}

/// Reset mode
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResetMode {
    Soft,
    Mixed,
    Hard,
}

/// Merge strategy
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MergeStrategy {
    Resolve,
    Recursive,
    Ours,
    Theirs,
    Octopus,
}

/// Conflict resolution
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConflictResolution {
    pub path: String,
    pub resolution: ConflictResolutionType,
}

/// Conflict resolution type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ConflictResolutionType {
    Ours,
    Theirs,
    Manual { content: String },
}

/// Blame information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlameInfo {
    pub path: String,
    pub lines: Vec<BlameLine>,
}

/// Blame line
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlameLine {
    pub line_number: usize,
    pub content: String,
    pub commit_sha: String,
    pub author: String,
    pub timestamp: DateTime<Utc>,
}
