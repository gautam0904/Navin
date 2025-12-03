use crate::commands::git_state::GitState;
use crate::core::git_engine::GitEngine;
use crate::models::git_repository::{Commit, CommitSummary, FileDiff};
use tauri::State;
use tracing::{error, info, instrument};

/// Get paginated commits
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_commits(
    limit: usize,
    offset: usize,
    state: State<'_, GitState>,
) -> Result<Vec<CommitSummary>, String> {
    info!(limit, offset, "Getting commits");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let commits = engine.get_commits(limit, offset).map_err(|e| {
        error!("Failed to get commits: {:?}", e);
        format!("Could not retrieve commits: {}", e)
    })?;

    info!(count = commits.len(), "Commits retrieved successfully");
    Ok(commits)
}

/// Get commit details
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_commit_details(sha: String, state: State<'_, GitState>) -> Result<Commit, String> {
    info!(sha, "Getting commit details");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let commit = engine.get_commit_details(&sha).map_err(|e| {
        error!("Failed to get commit details: {:?}", e);
        format!("Could not retrieve commit details: {}", e)
    })?;

    info!("Commit details retrieved successfully");
    Ok(commit)
}

/// Get commit diff
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_commit_diff(
    sha: String,
    state: State<'_, GitState>,
) -> Result<Vec<FileDiff>, String> {
    info!(sha, "Getting commit diff");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let diffs = engine.get_commit_diff(&sha).map_err(|e| {
        error!("Failed to get commit diff: {:?}", e);
        format!("Could not retrieve commit diff: {}", e)
    })?;

    info!("Commit diff retrieved successfully");
    Ok(diffs)
}

/// Get file history
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_file_history(
    file_path: String,
    limit: usize,
    state: State<'_, GitState>,
) -> Result<Vec<CommitSummary>, String> {
    info!(file_path, limit, "Getting file history");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let commits = engine.get_file_history(&file_path, limit).map_err(|e| {
        error!("Failed to get file history: {:?}", e);
        format!("Could not retrieve file history: {}", e)
    })?;

    info!(count = commits.len(), "File history retrieved successfully");
    Ok(commits)
}
