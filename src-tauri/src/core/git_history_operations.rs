use crate::core::git_error::GitResult;
use crate::models::git_repository::{Commit, CommitSummary, FileDiff};
use chrono::{TimeZone, Utc};
use git2::{Commit as Git2Commit, Diff as Git2Diff, Repository as Git2Repository};
use tracing::{debug, info, instrument};

/// Extension trait for GitEngine to handle commit history operations
pub trait GitHistoryOperations {
    fn get_commits(&self, limit: usize, offset: usize) -> GitResult<Vec<CommitSummary>>;
    fn get_commit_details(&self, sha: &str) -> GitResult<Commit>;
    fn get_commit_diff(&self, sha: &str) -> GitResult<Vec<FileDiff>>;
    fn get_file_history(&self, file_path: &str, limit: usize) -> GitResult<Vec<CommitSummary>>;
}

impl GitHistoryOperations for Git2Repository {
    #[instrument(skip(self))]
    fn get_commits(&self, limit: usize, offset: usize) -> GitResult<Vec<CommitSummary>> {
        info!(limit, offset, "Getting paginated commits");
        let mut revwalk = self.revwalk()?;
        revwalk.push_head()?;
        revwalk.set_sorting(git2::Sort::TIME)?;

        let commits: Vec<CommitSummary> = revwalk
            .skip(offset)
            .take(limit)
            .filter_map(|oid| {
                oid.ok()
                    .and_then(|oid| self.find_commit(oid).ok())
                    .and_then(|commit| commit_to_summary(&commit).ok())
            })
            .collect();

        debug!(count = commits.len(), "Commits retrieved");
        Ok(commits)
    }

    #[instrument(skip(self))]
    fn get_commit_details(&self, sha: &str) -> GitResult<Commit> {
        info!(sha, "Getting commit details");
        let oid = git2::Oid::from_str(sha)?;
        let commit = self.find_commit(oid)?;

        let full_commit = commit_to_full(&commit)?;
        debug!("Commit details retrieved");
        Ok(full_commit)
    }

    #[instrument(skip(self))]
    fn get_commit_diff(&self, sha: &str) -> GitResult<Vec<FileDiff>> {
        info!(sha, "Getting commit diff");
        let oid = git2::Oid::from_str(sha)?;
        let commit = self.find_commit(oid)?;
        let tree = commit.tree()?;

        let parent_tree = if commit.parent_count() > 0 {
            Some(commit.parent(0)?.tree()?)
        } else {
            None
        };

        let diff = self.diff_tree_to_tree(parent_tree.as_ref(), Some(&tree), None)?;

        let file_diffs = diff_to_file_diffs(&diff)?;
        debug!(file_count = file_diffs.len(), "Commit diff retrieved");
        Ok(file_diffs)
    }

    #[instrument(skip(self))]
    fn get_file_history(&self, file_path: &str, limit: usize) -> GitResult<Vec<CommitSummary>> {
        info!(file_path, limit, "Getting file history");
        let mut revwalk = self.revwalk()?;
        revwalk.push_head()?;
        revwalk.set_sorting(git2::Sort::TIME)?;

        let mut commits = Vec::new();
        for oid in revwalk {
            if commits.len() >= limit {
                break;
            }

            if let Ok(oid) = oid {
                if let Ok(commit) = self.find_commit(oid) {
                    // Check if this commit touched the file
                    if commit_touches_file(self, &commit, file_path)? {
                        if let Ok(summary) = commit_to_summary(&commit) {
                            commits.push(summary);
                        }
                    }
                }
            }
        }

        debug!(count = commits.len(), "File history retrieved");
        Ok(commits)
    }
}

// Helper functions

fn commit_to_summary(commit: &Git2Commit) -> GitResult<CommitSummary> {
    let sha = commit.id().to_string();
    let short_sha = sha.chars().take(7).collect();
    let message = commit
        .message()
        .unwrap_or("(no message)")
        .lines()
        .next()
        .unwrap_or("")
        .to_string();

    let author = commit.author();
    let author_name = author.name().unwrap_or("Unknown").to_string();

    let timestamp = Utc
        .timestamp_opt(commit.time().seconds(), 0)
        .single()
        .unwrap_or_else(|| Utc::now());

    Ok(CommitSummary {
        sha,
        short_sha,
        message,
        author_name,
        timestamp,
    })
}

fn commit_to_full(commit: &Git2Commit) -> GitResult<Commit> {
    let sha = commit.id().to_string();
    let short_sha = sha.chars().take(7).collect();

    let message_full = commit.message().unwrap_or("(no message)");
    let mut lines = message_full.lines();
    let message = lines.next().unwrap_or("").to_string();
    let body = lines.collect::<Vec<_>>().join("\n");
    let body = if body.is_empty() { None } else { Some(body) };

    let author = commit.author();
    let committer = commit.committer();

    let author_timestamp = Utc
        .timestamp_opt(author.when().seconds(), 0)
        .single()
        .unwrap_or_else(|| Utc::now());

    let committer_timestamp = Utc
        .timestamp_opt(committer.when().seconds(), 0)
        .single()
        .unwrap_or_else(|| Utc::now());

    let parents: Vec<String> = (0..commit.parent_count())
        .filter_map(|i| commit.parent_id(i).ok().map(|oid| oid.to_string()))
        .collect();

    Ok(Commit {
        sha,
        short_sha,
        message,
        body,
        author: crate::models::git_repository::Author {
            name: author.name().unwrap_or("Unknown").to_string(),
            email: author.email().unwrap_or("unknown@example.com").to_string(),
            timestamp: author_timestamp,
        },
        committer: crate::models::git_repository::Author {
            name: committer.name().unwrap_or("Unknown").to_string(),
            email: committer
                .email()
                .unwrap_or("unknown@example.com")
                .to_string(),
            timestamp: committer_timestamp,
        },
        timestamp: author_timestamp,
        parents,
        tree_sha: commit.tree_id().to_string(),
    })
}

pub fn diff_to_file_diffs(diff: &Git2Diff) -> GitResult<Vec<FileDiff>> {
    use crate::models::git_repository::{DiffHunk, DiffLine, DiffLineType, FileStatusType};

    let mut file_diffs = Vec::new();

    diff.foreach(
        &mut |delta, _progress| {
            let old_path = delta
                .old_file()
                .path()
                .map(|p| p.to_string_lossy().to_string());
            let new_path = delta
                .new_file()
                .path()
                .map(|p| p.to_string_lossy().to_string());

            let status = match delta.status() {
                git2::Delta::Added => FileStatusType::Added,
                git2::Delta::Deleted => FileStatusType::Deleted,
                git2::Delta::Modified => FileStatusType::Modified,
                git2::Delta::Renamed => FileStatusType::Renamed {
                    old_path: old_path.clone().unwrap_or_default(),
                },
                git2::Delta::Copied => FileStatusType::Copied,
                _ => FileStatusType::Modified,
            };

            file_diffs.push(FileDiff {
                old_path,
                new_path,
                status,
                hunks: Vec::new(), // Will be populated below
                binary: delta.old_file().is_binary() || delta.new_file().is_binary(),
                additions: 0,
                deletions: 0,
            });

            true
        },
        None,
        None,
        None,
    )?;

    // Get detailed hunks and lines - collect first, then update
    let mut all_hunks: Vec<(Vec<DiffHunk>, usize, usize)> = Vec::new();

    for _ in 0..file_diffs.len() {
        let mut hunks = Vec::new();
        let mut additions = 0;
        let mut deletions = 0;

        diff.print(git2::DiffFormat::Patch, |_delta, hunk, line| {
            // Add hunk if needed
            if let Some(hunk_header) = hunk {
                if hunks.is_empty()
                    || hunks.last().map(|h: &DiffHunk| &h.header)
                        != Some(&String::from_utf8_lossy(hunk_header.header()).to_string())
                {
                    hunks.push(DiffHunk {
                        old_start: hunk_header.old_start() as usize,
                        old_lines: hunk_header.old_lines() as usize,
                        new_start: hunk_header.new_start() as usize,
                        new_lines: hunk_header.new_lines() as usize,
                        header: String::from_utf8_lossy(hunk_header.header()).to_string(),
                        lines: Vec::new(),
                    });
                }
            }

            // Add line to current hunk
            if let Some(current_hunk) = hunks.last_mut() {
                let origin = match line.origin() {
                    '+' => {
                        additions += 1;
                        DiffLineType::Addition
                    }
                    '-' => {
                        deletions += 1;
                        DiffLineType::Deletion
                    }
                    ' ' => DiffLineType::Context,
                    'F' => DiffLineType::FileHeader,
                    'H' => DiffLineType::HunkHeader,
                    'B' => DiffLineType::Binary,
                    _ => DiffLineType::Context,
                };

                current_hunk.lines.push(DiffLine {
                    origin,
                    content: String::from_utf8_lossy(line.content()).to_string(),
                    old_lineno: line.old_lineno().map(|n| n as usize),
                    new_lineno: line.new_lineno().map(|n| n as usize),
                });
            }

            true
        })?;

        all_hunks.push((hunks, additions, deletions));
    }

    // Now update all file_diffs with collected data
    for (i, (hunks, additions, deletions)) in all_hunks.into_iter().enumerate() {
        if let Some(file_diff) = file_diffs.get_mut(i) {
            file_diff.hunks = hunks;
            file_diff.additions = additions;
            file_diff.deletions = deletions;
        }
    }

    Ok(file_diffs)
}

fn commit_touches_file(
    repo: &Git2Repository,
    commit: &Git2Commit,
    file_path: &str,
) -> GitResult<bool> {
    let tree = commit.tree()?;

    let parent_tree = if commit.parent_count() > 0 {
        Some(commit.parent(0)?.tree()?)
    } else {
        None
    };

    let diff = repo.diff_tree_to_tree(parent_tree.as_ref(), Some(&tree), None)?;

    let mut touches = false;
    diff.foreach(
        &mut |delta, _| {
            if let Some(path) = delta.new_file().path() {
                if path.to_string_lossy() == file_path {
                    touches = true;
                }
            }
            if let Some(path) = delta.old_file().path() {
                if path.to_string_lossy() == file_path {
                    touches = true;
                }
            }
            true
        },
        None,
        None,
        None,
    )?;

    Ok(touches)
}
