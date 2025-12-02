use crate::core::git_engine::GitEngine;
use crate::models::git_repository::*;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;
use tracing::{error, info, instrument, warn};

/// Global repository state
pub struct GitState {
    current_repo: Mutex<Option<PathBuf>>,
}

impl GitState {
    pub fn new() -> Self {
        Self {
            current_repo: Mutex::new(None),
        }
    }
}

impl Default for GitState {
    fn default() -> Self {
        Self::new()
    }
}

/// Open a repository
#[tauri::command]
#[instrument(skip(state), fields(path = %path))]
pub async fn open_repository(path: String, state: State<'_, GitState>) -> Result<RepositoryInfo, String> {
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
    use tracing::debug;    
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
pub async fn checkout_branch(branch_name: String, state: State<'_, GitState>) -> Result<(), String> {
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
    
    engine
        .create_branch(&name, from.as_deref())
        .map_err(|e| {
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
