use crate::core::error::AppError;
use crate::database::DbPool;
use crate::repositories::{ProgressRepository, ProjectRepository};
use tauri::State;

// -------------------------------------------------------
//  PROGRESS COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn get_checked_items(
    pool: State<DbPool>,
    project_id: Option<String>,
) -> Result<Vec<String>, AppError> {
    let conn = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ProgressRepository::get_all_checked_items(&conn, &project_id).map_err(Into::into)
}

#[tauri::command]
pub fn toggle_item_checked(
    pool: State<DbPool>,
    item_id: String,
    project_id: Option<String>,
) -> Result<bool, AppError> {
    let conn = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ProgressRepository::toggle_item(&conn, &item_id, &project_id).map_err(Into::into)
}

#[tauri::command]
pub fn set_item_checked(
    pool: State<DbPool>,
    item_id: String,
    project_id: Option<String>,
    is_checked: bool,
) -> Result<(), AppError> {
    let conn = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ProgressRepository::set_item_checked(&conn, &item_id, &project_id, is_checked)
        .map_err(Into::into)
}

#[tauri::command]
pub fn reset_progress(pool: State<DbPool>, project_id: Option<String>) -> Result<(), AppError> {
    let conn = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ProgressRepository::reset_all(&conn, &project_id).map_err(Into::into)
}
