// Git repository types
export interface RepositoryInfo {
  path: string;
  name: string;
  current_branch: string | null;
  is_bare: boolean;
  is_empty: boolean;
  head_detached: boolean;
  remotes: string[];
}

export interface RepositoryStatus {
  staged: FileStatus[];
  unstaged: FileStatus[];
  untracked: FileStatus[];
  conflicted: FileStatus[];
  is_clean: boolean;
}

export interface FileStatus {
  path: string;
  status: FileStatusType;
  additions: number | null;
  deletions: number | null;
}

export type FileStatusType =
  | { Added: null }
  | { Modified: null }
  | { Deleted: null }
  | { Renamed: { old_path: string } }
  | { Copied: null }
  | { Untracked: null }
  | { Ignored: null }
  | { Conflicted: null };

export interface Branch {
  name: string;
  is_head: boolean;
  is_remote: boolean;
  upstream: string | null;
  ahead: number;
  behind: number;
  last_commit: CommitSummary | null;
}

export interface Commit {
  sha: string;
  short_sha: string;
  message: string;
  body: string | null;
  author: Author;
  committer: Author;
  timestamp: string; // ISO 8601 datetime
  parents: string[];
  tree_sha: string;
}

export interface CommitSummary {
  sha: string;
  short_sha: string;
  message: string;
  author_name: string;
  timestamp: string; // ISO 8601 datetime
  parents: string[];
}

export interface Author {
  name: string;
  email: string;
  timestamp: string; // ISO 8601 datetime
}

export interface FileDiff {
  old_path: string | null;
  new_path: string | null;
  status: FileStatusType;
  hunks: DiffHunk[];
  binary: boolean;
  additions: number;
  deletions: number;
}

export interface DiffHunk {
  old_start: number;
  old_lines: number;
  new_start: number;
  new_lines: number;
  header: string;
  lines: DiffLine[];
}

export interface DiffLine {
  origin: DiffLineType;
  content: string;
  old_lineno: number | null;
  new_lineno: number | null;
}

export type DiffLineType =
  | 'Context'
  | 'Addition'
  | 'Deletion'
  | 'FileHeader'
  | 'HunkHeader'
  | 'Binary';

export interface Tag {
  name: string;
  target_sha: string;
  message: string | null;
  tagger: Author | null;
  is_annotated: boolean;
}

export interface Stash {
  index: number;
  message: string;
  commit_sha: string;
  timestamp: string;
  branch: string | null;
}

export interface Remote {
  name: string;
  url: string;
  fetch_url: string | null;
  push_url: string | null;
}

export interface ReflogEntry {
  index: number;
  old_sha: string;
  new_sha: string;
  message: string;
  committer: Author;
}

export interface MergeResult {
  success: boolean;
  conflicts: string[];
  merged_commit: string | null;
}

export type PullStrategy = 'Merge' | 'Rebase' | 'FastForwardOnly';
export type ResetMode = 'Soft' | 'Mixed' | 'Hard';
export type MergeStrategy = 'Resolve' | 'Recursive' | 'Ours' | 'Theirs' | 'Octopus';

export interface ConflictResolution {
  path: string;
  resolution: ConflictResolutionType;
}

export type ConflictResolutionType =
  | { Ours: null }
  | { Theirs: null }
  | { Manual: { content: string } };

export interface BlameInfo {
  path: string;
  lines: BlameLine[];
}

export interface BlameLine {
  line_number: number;
  content: string;
  commit_sha: string;
  author: string;
  timestamp: string;
}
