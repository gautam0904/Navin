use crate::core::git_error::GitResult;
use crate::models::git_repository::{DiffHunk, DiffLine, DiffLineType, FileDiff, FileStatusType};
use git2::Diff as Git2Diff;

/// Convert a git2 diff to a vector of FileDiff structures
pub fn diff_to_file_diffs(diff: &Git2Diff) -> GitResult<Vec<FileDiff>> {
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
