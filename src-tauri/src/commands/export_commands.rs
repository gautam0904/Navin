use crate::core::error::AppError;
use crate::database::DbPool;
use crate::models::ChecklistSection;
use crate::repositories::{ChecklistRepository, ProjectRepository};
use tauri::State;

// -------------------------------------------------------
//  EXPORT/IMPORT COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn save_export_file(
    _pool: State<DbPool>,
    content: String,
    filename: String,
) -> Result<(), AppError> {
    use std::env;
    use std::fs::File;
    use std::io::Write;

    // Use system temp directory - frontend can provide better UX for file location
    let dir = env::temp_dir();

    let file_path = dir.join(filename);

    let mut file = File::create(&file_path)?;

    file.write_all(content.as_bytes())?;

    tracing::info!("File saved to: {:?}", file_path);
    Ok(())
}

#[tauri::command]
pub async fn open_import_file(_pool: State<'_, DbPool>) -> Result<String, AppError> {
    // For now, return error - dialog implementation needs proper async handling
    // Using a simple file path input or clipboard approach for now
    Err(AppError::ValidationError(
        "File import dialog not yet fully implemented. Please use clipboard import with JSON string.".to_string()
    ))
}

/// Import checklist data and progress into database
#[tauri::command]
pub fn import_checklist_data(
    pool: State<DbPool>,
    sections: Vec<ChecklistSection>,
    checked_items: Vec<String>,
    project_id: Option<String>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;

    // Get or create project
    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        let read_conn = pool.get()?;
        match ProjectRepository::get_current_project(&read_conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    // Delete existing sections for this project (or all if importing full replacement)
    conn.execute(
        "DELETE FROM checklist_sections WHERE project_id = ?1",
        rusqlite::params![project_id],
    )?;

    // Import sections
    for (idx, section) in sections.iter().enumerate() {
        ChecklistRepository::insert_section(&mut conn, section, &project_id, idx as i32)?;
    }

    // Clear and set checked items
    conn.execute(
        "DELETE FROM user_progress WHERE project_id = ?1",
        rusqlite::params![project_id],
    )?;

    for item_id in checked_items {
        conn.execute(
            "INSERT INTO user_progress (item_id, project_id, is_checked, checked_at) 
             VALUES (?1, ?2, 1, datetime('now'))",
            rusqlite::params![item_id, project_id],
        )?;
    }

    Ok(())
}
