mod database;
mod models;
mod repositories;

use database::{init_db, open_connection};
use models::*;
use repositories::{ChecklistRepository, ProgressRepository, ProjectRepository};

type CodeExamples = models::CodeExamples;
use rusqlite::Result;
use tauri::{AppHandle, Manager};

// -------------------------------------------------------
//  CHECKLIST COMMANDS
// -------------------------------------------------------

#[tauri::command]
fn get_all_sections(app: AppHandle, project_id: Option<String>) -> Result<Vec<ChecklistSection>, String> {
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
fn add_section(app: AppHandle, section: ChecklistSection, project_id: Option<String>, display_order: i32) -> Result<(), String> {
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
fn update_section_title(app: AppHandle, section_id: String, title: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_section_title(&conn, &section_id, &title).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_section(app: AppHandle, section_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::delete_section(&conn, &section_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_item(app: AppHandle, section_id: String, item: ChecklistItem) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::add_item(&conn, &section_id, &item).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_item(app: AppHandle, item_id: String, text: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item(&conn, &item_id, &text).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_item(app: AppHandle, item_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::delete_item(&conn, &item_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_section_examples(app: AppHandle, section_id: String, examples: Option<Examples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_examples(&mut conn, &section_id, examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_section_code_examples(app: AppHandle, section_id: String, code_examples: Option<CodeExamples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_code_examples(&mut conn, &section_id, code_examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_section_code_example(app: AppHandle, section_id: String, code_example: Option<String>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_code_example(&mut conn, &section_id, code_example.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_item_examples(app: AppHandle, item_id: String, examples: Option<Examples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_examples(&mut conn, &item_id, examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_item_code_examples(app: AppHandle, item_id: String, code_examples: Option<CodeExamples>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_code_examples(&mut conn, &item_id, code_examples.as_ref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_item_code_example(app: AppHandle, item_id: String, code_example: Option<String>) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::update_item_code_example(&mut conn, &item_id, code_example.as_deref()).map_err(|e| e.to_string())
}

// -------------------------------------------------------
//  PROGRESS COMMANDS
// -------------------------------------------------------

#[tauri::command]
fn get_checked_items(app: AppHandle, project_id: Option<String>) -> Result<Vec<String>, String> {
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
fn toggle_item_checked(app: AppHandle, item_id: String, project_id: Option<String>) -> Result<bool, String> {
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
fn set_item_checked(app: AppHandle, item_id: String, project_id: Option<String>, is_checked: bool) -> Result<(), String> {
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
fn reset_progress(app: AppHandle, project_id: Option<String>) -> Result<(), String> {
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

// -------------------------------------------------------
//  EXPORT/IMPORT COMMANDS
// -------------------------------------------------------

#[tauri::command]
fn save_export_file(app: AppHandle, content: String, filename: String) -> Result<(), String> {
    use std::fs::File;
    use std::io::Write;

    // Get downloads directory or app data directory
    let dir = app
        .path()
        .download_dir()
        .or_else(|_| app.path().app_data_dir())
        .map_err(|e| format!("Failed to get directory: {}", e))?;

    let file_path = dir.join(filename);
    
    let mut file = File::create(&file_path)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
async fn open_import_file(_app: AppHandle) -> Result<String, String> {
    // For now, return error - dialog implementation needs proper async handling
    // Using a simple file path input or clipboard approach for now
    Err("File import dialog not yet fully implemented. Please use clipboard import with JSON string.".to_string())
}

/// Import checklist data and progress into database
#[tauri::command]
fn import_checklist_data(
    app: AppHandle,
    sections: Vec<ChecklistSection>,
    checked_items: Vec<String>,
    project_id: Option<String>,
) -> Result<(), String> {
    let mut conn = open_connection(&app).map_err(|e| e.to_string())?;
    
    // Get or create project
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())? {
            Some(project) => project.id,
            None => return Err("No project found".to_string()),
        }
    };
    
    // Delete existing sections for this project (or all if importing full replacement)
    conn.execute(
        "DELETE FROM checklist_sections WHERE project_id = ?1",
        rusqlite::params![project_id],
    ).map_err(|e| e.to_string())?;
    
    // Import sections
    for (idx, section) in sections.iter().enumerate() {
        ChecklistRepository::insert_section(&mut conn, section, &project_id, idx as i32)
            .map_err(|e| e.to_string())?;
    }
    
    // Clear and set checked items
    conn.execute(
        "DELETE FROM user_progress WHERE project_id = ?1",
        rusqlite::params![project_id],
    ).map_err(|e| e.to_string())?;
    
    for item_id in checked_items {
        conn.execute(
            "INSERT INTO user_progress (item_id, project_id, is_checked, checked_at) 
             VALUES (?1, ?2, 1, datetime('now'))",
            rusqlite::params![item_id, project_id],
        ).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

// -------------------------------------------------------
//  PROJECT COMMANDS
// -------------------------------------------------------

#[tauri::command]
fn get_all_projects(app: AppHandle) -> Result<Vec<repositories::ProjectRow>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::get_all_projects(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_current_project(app: AppHandle) -> Result<Option<repositories::ProjectRow>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::get_current_project(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_project(app: AppHandle, name: String, description: Option<String>) -> Result<repositories::ProjectRow, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    let project_id = format!("project-{}", timestamp);
    ProjectRepository::create_project(&conn, &project_id, &name, description.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_project(app: AppHandle, project_id: String, name: String, description: Option<String>) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::update_project(&conn, &project_id, &name, description.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_project(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::delete_project(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn switch_project(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ProjectRepository::switch_project(&conn, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_project_checklist(app: AppHandle, project_id: String) -> Result<Vec<ChecklistSection>, String> {
    let conn = open_connection(&app).map_err(|e| e.to_string())?;
    ChecklistRepository::get_all_sections(&conn, &project_id).map_err(|e| e.to_string())
}

// -------------------------------------------------------
//  TAURI ENTRYPOINT
// -------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_all_sections,
            add_section,
            update_section_title,
            delete_section,
            add_item,
            update_item,
            delete_item,
            update_section_examples,
            update_section_code_examples,
            update_section_code_example,
            update_item_examples,
            update_item_code_examples,
            update_item_code_example,
            get_checked_items,
            toggle_item_checked,
            set_item_checked,
            reset_progress,
            save_export_file,
            open_import_file,
            import_checklist_data,
            get_all_projects,
            get_current_project,
            create_project,
            update_project,
            delete_project,
            switch_project,
            get_project_checklist
        ])
        .setup(|app| {
            // Initialize database with better error handling
            match init_db(&app.handle()) {
                Ok(_) => {
                    println!("✅ Database initialized successfully");
                    Ok(())
                }
                Err(e) => {
                    let error_msg = format!("Failed to initialize database: {}", e);
                    eprintln!("❌ {}", error_msg);
                    
                    // Try to show error dialog if possible
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.eval(&format!(
                            "alert('Database initialization failed. Please contact support. Error: {}')",
                            e
                        ));
                    }
                    
                    // Return error but don't use SetupError (not in Tauri v2)
                    eprintln!("Setup failed: {}", error_msg);
                    // Continue anyway - app might still work
                    Ok(())
                }
            }
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Allow window to close gracefully - prevent_close() would prevent closing
                // We want to allow normal closing behavior
            }
        })
        .run(tauri::generate_context!())
        .expect("Error running app");
}
