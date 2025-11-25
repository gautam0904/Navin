use crate::database::open_connection;
use crate::models::ChecklistSection;
use crate::repositories::{ChecklistRepository, ProjectRepository};
use rusqlite::Result;
use tauri::AppHandle;

// -------------------------------------------------------
//  EXPORT/IMPORT COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn save_export_file(_app: AppHandle, content: String, filename: String) -> Result<(), String> {
    use std::fs::File;
    use std::io::Write;
    use std::env;

    // Use system temp directory - frontend can provide better UX for file location
    let dir = env::temp_dir();

    let file_path = dir.join(filename);
    
    let mut file = File::create(&file_path)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write file: {}", e))?;
    
    println!("File saved to: {:?}", file_path);
    Ok(())
}

#[tauri::command]
pub async fn open_import_file(_app: AppHandle) -> Result<String, String> {
    // For now, return error - dialog implementation needs proper async handling
    // Using a simple file path input or clipboard approach for now
    Err("File import dialog not yet fully implemented. Please use clipboard import with JSON string.".to_string())
}

/// Import checklist data and progress into database
#[tauri::command]
pub fn import_checklist_data(
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
