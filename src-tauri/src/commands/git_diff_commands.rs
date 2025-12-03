use crate::commands::git_state::GitState;
use crate::core::git_engine::GitEngine;
use crate::models::git_repository::FileDiff;
use tauri::State;
use tracing::{error, info, instrument};

/// Get unstaged diff for a file
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_file_diff_unstaged(
    file_path: String,
    state: State<'_, GitState>,
) -> Result<FileDiff, String> {
    info!(file_path, "Getting unstaged diff");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let diff = engine.get_file_diff_unstaged(&file_path).map_err(|e| {
        error!("Failed to get unstaged diff: {:?}", e);
        format!("Could not retrieve unstaged diff: {}", e)
    })?;

    info!("Unstaged diff retrieved successfully");
    Ok(diff)
}

/// Get staged diff for a file
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_file_diff_staged(
    file_path: String,
    state: State<'_, GitState>,
) -> Result<FileDiff, String> {
    info!(file_path, "Getting staged diff");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let diff = engine.get_file_diff_staged(&file_path).map_err(|e| {
        error!("Failed to get staged diff: {:?}", e);
        format!("Could not retrieve staged diff: {}", e)
    })?;

    info!("Staged diff retrieved successfully");
    Ok(diff)
}

/// Get diff between two commits
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_diff_between_commits(
    commit1: String,
    commit2: String,
    state: State<'_, GitState>,
) -> Result<Vec<FileDiff>, String> {
    info!(commit1, commit2, "Getting diff between commits");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let diffs = engine
        .get_diff_between_commits(&commit1, &commit2)
        .map_err(|e| {
            error!("Failed to get diff: {:?}", e);
            format!("Could not retrieve diff: {}", e)
        })?;

    info!("Diff between commits retrieved successfully");
    Ok(diffs)
}
