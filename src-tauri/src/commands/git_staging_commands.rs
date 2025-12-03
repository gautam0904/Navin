use crate::commands::git_state::GitState;
use crate::core::git_engine::GitEngine;
use tauri::State;
use tracing::{error, info, instrument, warn};

/// Stage a file
#[tauri::command]
#[instrument(skip(state), fields(file = %file_path))]
pub async fn stage_file(file_path: String, state: State<'_, GitState>) -> Result<(), String> {
    info!("Staging file");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.stage_file(&file_path).map_err(|e| {
        error!("Failed to stage file: {:?}", e);
        format!("Could not stage file '{}': {}", file_path, e)
    })?;

    info!("File staged successfully");
    Ok(())
}

/// Stage all changes
#[tauri::command]
#[instrument(skip(state))]
pub async fn stage_all(state: State<'_, GitState>) -> Result<(), String> {
    info!("Staging all changes");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.stage_all().map_err(|e| {
        error!("Failed to stage all: {:?}", e);
        format!("Could not stage changes: {}", e)
    })?;

    info!("All changes staged successfully");
    Ok(())
}

/// Unstage a file
#[tauri::command]
#[instrument(skip(state), fields(file = %file_path))]
pub async fn unstage_file(file_path: String, state: State<'_, GitState>) -> Result<(), String> {
    info!("Unstaging file");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.unstage_file(&file_path).map_err(|e| {
        error!("Failed to unstage file: {:?}", e);
        format!("Could not unstage file '{}': {}", file_path, e)
    })?;

    info!("File unstaged successfully");
    Ok(())
}

/// Unstage all changes
#[tauri::command]
#[instrument(skip(state))]
pub async fn unstage_all(state: State<'_, GitState>) -> Result<(), String> {
    info!("Unstaging all changes");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.unstage_all().map_err(|e| {
        error!("Failed to unstage all: {:?}", e);
        format!("Could not unstage changes: {}", e)
    })?;

    info!("All changes unstaged successfully");
    Ok(())
}

/// Create a commit
#[tauri::command]
#[instrument(skip(state, message, author_name, author_email), fields(message_len = message.len()))]
pub async fn create_commit(
    message: String,
    author_name: String,
    author_email: String,
    state: State<'_, GitState>,
) -> Result<String, String> {
    info!("Creating commit");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let commit_hash = engine
        .create_commit(&message, &author_name, &author_email)
        .map_err(|e| {
            error!("Failed to create commit: {:?}", e);
            format!("Could not create commit: {}", e)
        })?;

    info!(commit_hash = %commit_hash, "Commit created successfully");
    Ok(commit_hash)
}

/// Checkout a branch
#[tauri::command]
#[instrument(skip(state), fields(branch = %branch_name))]
pub async fn checkout_branch(
    branch_name: String,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!("Checking out branch");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.checkout_branch(&branch_name).map_err(|e| {
        error!("Failed to checkout branch: {:?}", e);
        format!("Could not checkout branch '{}': {}", branch_name, e)
    })?;

    info!("Branch checked out successfully");
    Ok(())
}

/// Create a new branch
#[tauri::command]
#[instrument(skip(state, from), fields(branch = %name, from = ?from))]
pub async fn create_branch(
    name: String,
    from: Option<String>,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!("Creating new branch");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.create_branch(&name, from.as_deref()).map_err(|e| {
        error!("Failed to create branch: {:?}", e);
        format!("Could not create branch '{}': {}", name, e)
    })?;

    info!("Branch created successfully");
    Ok(())
}

/// Delete a branch
#[tauri::command]
#[instrument(skip(state), fields(branch = %name, force = %force))]
pub async fn delete_branch(
    name: String,
    force: bool,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!("Deleting branch");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.delete_branch(&name, force).map_err(|e| {
        error!("Failed to delete branch: {:?}", e);
        format!("Could not delete branch '{}': {}", name, e)
    })?;

    info!("Branch deleted successfully");
    Ok(())
}
