use crate::commands::git_state::GitState;
use crate::core::git_stash_operations::GitStashOperations;
use crate::models::git_repository::Stash;
use git2::Repository;
use tauri::State;
use tracing::{error, info, instrument, warn};

/// List all stashes in the current repository
#[tauri::command]
#[instrument(skip(state))]
pub async fn list_stashes(state: State<'_, GitState>) -> Result<Vec<Stash>, String> {
    info!("Listing stashes");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let mut repo = Repository::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let stashes = repo.list_stashes().map_err(|e| {
        error!("Failed to list stashes: {:?}", e);
        format!("Could not list stashes: {}", e)
    })?;

    info!(count = stashes.len(), "Stashes listed successfully");
    Ok(stashes)
}

/// Create a new stash with an optional message
#[tauri::command]
#[instrument(skip(state), fields(message = ?message))]
pub async fn create_stash(
    message: Option<String>,
    state: State<'_, GitState>,
) -> Result<String, String> {
    info!("Creating stash");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let mut repo = Repository::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let stash_id = repo.create_stash(message.as_deref()).map_err(|e| {
        error!("Failed to create stash: {:?}", e);
        format!("Could not create stash: {}", e)
    })?;

    info!(stash_id = %stash_id, "Stash created successfully");
    Ok(stash_id)
}

/// Apply a stash by index (keeps the stash)
#[tauri::command]
#[instrument(skip(state), fields(index = index))]
pub async fn apply_stash(index: usize, state: State<'_, GitState>) -> Result<(), String> {
    info!("Applying stash");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let mut repo = Repository::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    repo.apply_stash(index).map_err(|e| {
        error!("Failed to apply stash: {:?}", e);
        format!("Could not apply stash at index {}: {}", index, e)
    })?;

    info!("Stash applied successfully");
    Ok(())
}

/// Pop a stash by index (applies and removes it)
#[tauri::command]
#[instrument(skip(state), fields(index = index))]
pub async fn pop_stash(index: usize, state: State<'_, GitState>) -> Result<(), String> {
    info!("Popping stash");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let mut repo = Repository::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    repo.pop_stash(index).map_err(|e| {
        error!("Failed to pop stash: {:?}", e);
        format!("Could not pop stash at index {}: {}", index, e)
    })?;

    info!("Stash popped successfully");
    Ok(())
}

/// Drop (delete) a stash by index
#[tauri::command]
#[instrument(skip(state), fields(index = index))]
pub async fn drop_stash(index: usize, state: State<'_, GitState>) -> Result<(), String> {
    info!("Dropping stash");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let mut repo = Repository::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    repo.drop_stash(index).map_err(|e| {
        error!("Failed to drop stash: {:?}", e);
        format!("Could not drop stash at index {}: {}", index, e)
    })?;

    info!("Stash dropped successfully");
    Ok(())
}
