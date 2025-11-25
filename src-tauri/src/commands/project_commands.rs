use crate::database::open_connection;
use crate::repositories::{ChecklistRepository, ProjectRepository};
use rusqlite::Result;
use tauri::AppHandle;

// -------------------------------------------------------
//  PROJECT COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn get_all_projects(app: AppHandle) -> Result<Vec<crate::repositories::ProjectRow>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::get_all_projects(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_current_project(app: AppHandle) -> Result<Option<crate::repositories::ProjectRow>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_project(app: AppHandle, name: String, description: Option<String>) -> Result<crate::repositories::ProjectRow, String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    let project_id = format!("project-{}", timestamp);
    ProjectRepository::create_project(&conn, &project_id, &name, description.as_deref()).map_err(|e| e.to_string())?;

    // Initialize checklist with default data
    let default_sections = crate::database::get_default_checklist_data();
    
    for (sec_idx, section) in default_sections.iter().enumerate() {
        let mut new_section = section.clone();
        // Generate unique ID for section
        new_section.id = format!("{}-sec-{}", project_id, sec_idx);
        
        // Update item IDs
        let mut new_items = Vec::new();
        for (item_idx, item) in section.items.iter().enumerate() {
            let mut new_item = item.clone();
            new_item.id = format!("{}-item-{}-{}", project_id, sec_idx, item_idx);
            new_items.push(new_item);
        }
        new_section.items = new_items;
        
        // Insert section
        ChecklistRepository::insert_section(&mut conn, &new_section, &project_id, sec_idx as i32)
            .map_err(|e| format!("Failed to insert section {}: {}", new_section.title, e))?;
    }

    // Return the created project
    ProjectRepository::get_project_by_id(&conn, &project_id)
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Failed to retrieve created project".to_string())
}

#[tauri::command]
pub fn update_project(app: AppHandle, project_id: String, name: String, description: Option<String>) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::update_project(&conn, &project_id, &name, description.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_project(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::delete_project(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn switch_project(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::switch_project(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_project_checklist(app: AppHandle, project_id: String) -> Result<Vec<crate::models::ChecklistSection>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::get_all_sections(&conn, &project_id).map_err(|e| e.to_string())
}
