use crate::commands::git_state::GitState;
use crate::core::git_engine::GitEngine;
use crate::models::git_repository::*;
use std::path::PathBuf;
use tauri::State;
use tracing::{error, info, instrument, warn};

/// Open a repository
#[tauri::command]
#[instrument(skip(state), fields(path = %path))]
pub async fn open_repository(
    path: String,
    state: State<'_, GitState>,
) -> Result<RepositoryInfo, String> {
    info!("Opening repository");

    let engine = GitEngine::open(&path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not open repository: {}", e)
    })?;

    let info = engine.get_info().map_err(|e| {
        error!("Failed to get repository info: {:?}", e);
        format!("Could not read repository information: {}", e)
    })?;

    // Store current repository path
    let mut current = state.current_repo.lock().unwrap();
    *current = Some(PathBuf::from(path));

    info!("Repository opened successfully");
    Ok(info)
}

/// Discover repository from a path
#[tauri::command]
#[instrument(fields(path = %path))]
pub async fn discover_repository(path: String) -> Result<RepositoryInfo, String> {
    info!("Discovering repository");

    let engine = GitEngine::discover(&path).map_err(|e| {
        error!("Failed to discover repository: {:?}", e);
        format!("No git repository found at or above: {}", path)
    })?;

    let info = engine.get_info().map_err(|e| {
        error!("Failed to get repository info: {:?}", e);
        format!("Could not read repository information: {}", e)
    })?;

    info!("Repository discovered successfully");
    Ok(info)
}

/// Get repository status
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_repository_status(state: State<'_, GitState>) -> Result<RepositoryStatus, String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let status = engine.get_status().map_err(|e| {
        error!("Failed to get status: {:?}", e);
        format!("Could not read repository status: {}", e)
    })?;
    Ok(status)
}

/// Get branches
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_branches(state: State<'_, GitState>) -> Result<Vec<Branch>, String> {
    info!("Getting branches");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let branches = engine.get_branches().map_err(|e| {
        error!("Failed to get branches: {:?}", e);
        format!("Could not read branches: {}", e)
    })?;

    info!("Branches retrieved successfully");
    Ok(branches)
}

/// Get current repository path
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_current_repository(state: State<'_, GitState>) -> Result<Option<String>, String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().map(|p| p.to_string_lossy().to_string());
    info!(has_repo = path.is_some(), "Current repository check");
    Ok(path)
}

/// Get git configuration
#[tauri::command]
#[instrument(skip(state))]
pub async fn get_git_config(state: State<'_, GitState>) -> Result<(String, String), String> {
    info!("Getting git configuration");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    let config = engine.get_config().map_err(|e| {
        error!("Failed to get config: {:?}", e);
        format!("Could not read git configuration: {}", e)
    })?;

    info!("Git configuration retrieved successfully");
    Ok(config)
}

/// Set git configuration
#[tauri::command]
#[instrument(skip(state))]
pub async fn set_git_config(
    name: String,
    email: String,
    state: State<'_, GitState>,
) -> Result<(), String> {
    info!("Setting git configuration");

    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or_else(|| {
        warn!("No repository is currently open");
        "No repository is currently open".to_string()
    })?;

    let engine = GitEngine::open(path).map_err(|e| {
        error!("Failed to open repository: {:?}", e);
        format!("Could not access repository: {}", e)
    })?;

    engine.set_config(&name, &email).map_err(|e| {
        error!("Failed to set config: {:?}", e);
        format!("Could not update git configuration: {}", e)
    })?;

    info!("Git configuration updated successfully");
    Ok(())
}
