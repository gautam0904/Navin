use crate::core::git_engine::GitEngine;
use crate::models::git_repository::*;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

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
pub async fn open_repository(path: String, state: State<'_, GitState>) -> Result<RepositoryInfo, String> {
    let engine = GitEngine::open(&path).map_err(|e| e.to_string())?;
    let info = engine.get_info().map_err(|e| e.to_string())?;

    // Store current repository path
    let mut current = state.current_repo.lock().unwrap();
    *current = Some(PathBuf::from(path));

    Ok(info)
}

/// Discover repository from a path
#[tauri::command]
pub async fn discover_repository(path: String) -> Result<RepositoryInfo, String> {
    let engine = GitEngine::discover(&path).map_err(|e| e.to_string())?;
    engine.get_info().map_err(|e| e.to_string())
}

/// Get repository status
#[tauri::command]
pub async fn get_repository_status(state: State<'_, GitState>) -> Result<RepositoryStatus, String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.get_status().map_err(|e| e.to_string())
}

/// Get branches
#[tauri::command]
pub async fn get_branches(state: State<'_, GitState>) -> Result<Vec<Branch>, String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.get_branches().map_err(|e| e.to_string())
}

/// Stage a file
#[tauri::command]
pub async fn stage_file(file_path: String, state: State<'_, GitState>) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.stage_file(&file_path).map_err(|e| e.to_string())
}

/// Stage all changes
#[tauri::command]
pub async fn stage_all(state: State<'_, GitState>) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.stage_all().map_err(|e| e.to_string())
}

/// Unstage a file
#[tauri::command]
pub async fn unstage_file(file_path: String, state: State<'_, GitState>) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.unstage_file(&file_path).map_err(|e| e.to_string())
}

/// Unstage all changes
#[tauri::command]
pub async fn unstage_all(state: State<'_, GitState>) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.unstage_all().map_err(|e| e.to_string())
}

/// Create a commit
#[tauri::command]
pub async fn create_commit(
    message: String,
    author_name: String,
    author_email: String,
    state: State<'_, GitState>,
) -> Result<String, String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine
        .create_commit(&message, &author_name, &author_email)
        .map_err(|e| e.to_string())
}

/// Checkout a branch
#[tauri::command]
pub async fn checkout_branch(branch_name: String, state: State<'_, GitState>) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.checkout_branch(&branch_name).map_err(|e| e.to_string())
}

/// Create a new branch
#[tauri::command]
pub async fn create_branch(
    name: String,
    from: Option<String>,
    state: State<'_, GitState>,
) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine
        .create_branch(&name, from.as_deref())
        .map_err(|e| e.to_string())
}

/// Delete a branch
#[tauri::command]
pub async fn delete_branch(
    name: String,
    force: bool,
    state: State<'_, GitState>,
) -> Result<(), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.delete_branch(&name, force).map_err(|e| e.to_string())
}

/// Get current repository path
#[tauri::command]
pub async fn get_current_repository(state: State<'_, GitState>) -> Result<Option<String>, String> {
    let current = state.current_repo.lock().unwrap();
    Ok(current.as_ref().map(|p| p.to_string_lossy().to_string()))
}

/// Get git configuration
#[tauri::command]
pub async fn get_git_config(state: State<'_, GitState>) -> Result<(String, String), String> {
    let current = state.current_repo.lock().unwrap();
    let path = current.as_ref().ok_or("No repository open")?;

    let engine = GitEngine::open(path).map_err(|e| e.to_string())?;
    engine.get_config().map_err(|e| e.to_string())
}
