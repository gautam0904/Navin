use crate::database::open_connection;
use crate::models::{ChecklistSection, ChecklistItem, Examples, CodeExamples};
use crate::repositories::{ChecklistRepository, ProjectRepository};
use rusqlite::Result;
use tauri::AppHandle;

// -------------------------------------------------------
//  CHECKLIST COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn get_all_sections(app: AppHandle, project_id: Option<String>) -> Result<Vec<ChecklistSection>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    // Get project_id - use provided or get current default project
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ChecklistRepository::get_all_sections(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_section(app: AppHandle, section: ChecklistSection, project_id: Option<String>, display_order: i32) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    ChecklistRepository::insert_section(&mut conn, &section, &project_id, display_order).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_section_title(app: AppHandle, section_id: String, title: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_section_title(&conn, &section_id, &title).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_section(app: AppHandle, section_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::delete_section(&conn, &section_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_item(app: AppHandle, section_id: String, item: ChecklistItem) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::add_item(&conn, &section_id, &item).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_item(app: AppHandle, item_id: String, text: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item(&conn, &item_id, &text).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_item(app: AppHandle, item_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::delete_item(&conn, &item_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_section_examples(app: AppHandle, section_id: String, examples: Option<Examples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_examples(&mut conn, &section_id, examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_section_code_examples(app: AppHandle, section_id: String, code_examples: Option<CodeExamples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_code_examples(&mut conn, &section_id, code_examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_section_code_example(app: AppHandle, section_id: String, code_example: Option<String>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_code_example(&mut conn, &section_id, code_example.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_item_examples(app: AppHandle, item_id: String, examples: Option<Examples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_examples(&mut conn, &item_id, examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_item_code_examples(app: AppHandle, item_id: String, code_examples: Option<CodeExamples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_code_examples(&mut conn, &item_id, code_examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_item_code_example(app: AppHandle, item_id: String, code_example: Option<String>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_code_example(&mut conn, &item_id, code_example.as_deref()).map_err(|e| e.to_string())
}
