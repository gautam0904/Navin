use crate::commands::git_state::GitState;
use crate::core::git_engine::GitEngine;
use crate::models::git_repository::Remote;
use tauri::State;
use tracing::{error, info, instrument};

/// List all remotes
#[tauri::command]
#[instrument(skip(state))]
pub async fn list_remotes(state: State<'_, GitState>) -> Result<Vec<Remote>, String> {
    info!("Listing remotes");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let remotes = engine.list_remotes().map_err(|e| {
        error!("Failed to list remotes: {:?}", e);
        format!("Could not retrieve remotes: {}", e)
    })?;

    info!(count = remotes.len(), "Remotes listed successfully");
    Ok(remotes)
}

/// Add a new remote
#[tauri::command]
#[instrument(skip(state))]
pub async fn add_remote(
    name: String,
    url: String,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!(name, url, "Adding remote");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.add_remote(&name, &url).map_err(|e| {
        error!("Failed to add remote: {:?}", e);
        format!("Could not add remote: {}", e)
    })?;

    info!("Remote added successfully");
    Ok(())
}

/// Remove a remote
#[tauri::command]
#[instrument(skip(state))]
pub async fn remove_remote(name: String, state: State<'_, GitState>) -> Result<(), String> {
    info!(name, "Removing remote");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.remove_remote(&name).map_err(|e| {
        error!("Failed to remove remote: {:?}", e);
        format!("Could not remove remote: {}", e)
    })?;

    info!("Remote removed successfully");
    Ok(())
}

/// Fetch from a remote
#[tauri::command]
#[instrument(skip(state))]
pub async fn fetch_remote(name: String, state: State<'_, GitState>) -> Result<(), String> {
    info!(name, "Fetching from remote");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.fetch(&name).map_err(|e| {
        error!("Failed to fetch: {:?}", e);
        format!("Could not fetch from remote: {}", e)
    })?;

    info!("Fetch completed successfully");
    Ok(())
}

/// Push to a remote
#[tauri::command]
#[instrument(skip(state))]
pub async fn push_to_remote(
    remote: String,
    branch: String,
    force: Option<bool>,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!(remote, branch, force, "Pushing to remote");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine
        .push(&remote, &branch, force.unwrap_or(false))
        .map_err(|e| {
            error!("Failed to push: {:?}", e);
            format!("Could not push to remote: {}", e)
        })?;

    info!("Push completed successfully");
    Ok(())
}

/// Pull from a remote
#[tauri::command]
#[instrument(skip(state))]
pub async fn pull_from_remote(
    remote: String,
    branch: String,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!(remote, branch, "Pulling from remote");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        error!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.pull(&remote, &branch).map_err(|e| {
        error!("Failed to pull: {:?}", e);
        format!("Could not pull from remote: {}", e)
    })?;

    info!("Pull completed successfully");
    Ok(())
}
