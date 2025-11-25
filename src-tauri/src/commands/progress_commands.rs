use crate::database::open_connection;
use crate::repositories::{ProgressRepository, ProjectRepository};
use rusqlite::Result;
use tauri::AppHandle;

// -------------------------------------------------------
//  PROGRESS COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn get_checked_items(app: AppHandle, project_id: Option<String>) -> Result<Vec<String>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ProgressRepository::get_all_checked_items(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn toggle_item_checked(app: AppHandle, item_id: String, project_id: Option<String>) -> Result<bool, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ProgressRepository::toggle_item(&conn, &item_id, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_item_checked(app: AppHandle, item_id: String, project_id: Option<String>, is_checked: bool) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ProgressRepository::set_item_checked(&conn, &item_id, &project_id, is_checked).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reset_progress(app: AppHandle, project_id: Option<String>) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ProgressRepository::reset_all(&conn, &project_id).map_err(|e| e.to_string())
}
