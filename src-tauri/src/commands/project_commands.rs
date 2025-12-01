use crate::core::{error::AppError, validation};
use crate::database::DbPool;
use crate::repositories::{ChecklistRepository, ProjectRepository};
use tauri::State;

// -------------------------------------------------------
//  PROJECT COMMANDS
// -------------------------------------------------------

#[tauri::command]
pub fn get_all_projects(
    pool: State<DbPool>,
) -> Result<Vec<crate::repositories::ProjectRow>, AppError> {
    let conn = pool.get()?;
    ProjectRepository::get_all_projects(&conn).map_err(Into::into)
}

#[tauri::command]
pub fn get_current_project(
    pool: State<DbPool>,
) -> Result<Option<crate::repositories::ProjectRow>, AppError> {
    let conn = pool.get()?;
    ProjectRepository::get_current_project(&conn).map_err(Into::into)
}

#[tauri::command]
pub fn create_project(
    pool: State<DbPool>,
    name: String,
    description: Option<String>,
) -> Result<crate::repositories::ProjectRow, AppError> {
    // Validate inputs
    validation::validate_project_name(&name)?;
    if let Some(desc) = &description {
        validation::validate_max_length(desc, "Project description", 1000)?;
    }

    let conn = pool.get()?;
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let project_id = format!("project-{}", timestamp);

    ProjectRepository::create_project(&conn, &project_id, &name, description.as_deref())?;

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

        // Get mutable connection for insert
        let mut conn_mut = pool.get()?;

        // Insert section
        ChecklistRepository::insert_section(
            &mut conn_mut,
            &new_section,
            &project_id,
            sec_idx as i32,
        )
        .map_err(|e| AppError::DatabaseError(e))?;
    }

    // Return the created project
    let conn = pool.get()?;
    ProjectRepository::get_project_by_id(&conn, &project_id)?
        .ok_or_else(|| AppError::NotFound("Failed to retrieve created project".to_string()))
}

#[tauri::command]
pub fn update_project(
    pool: State<DbPool>,
    project_id: String,
    name: String,
    description: Option<String>,
) -> Result<(), AppError> {
    // Validate inputs
    validation::validate_project_name(&name)?;
    if let Some(desc) = &description {
        validation::validate_max_length(desc, "Project description", 1000)?;
    }

    let conn = pool.get()?;
    ProjectRepository::update_project(&conn, &project_id, &name, description.as_deref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn delete_project(pool: State<DbPool>, project_id: String) -> Result<(), AppError> {
    let conn = pool.get()?;
    ProjectRepository::delete_project(&conn, &project_id).map_err(Into::into)
}

#[tauri::command]
pub fn switch_project(pool: State<DbPool>, project_id: String) -> Result<(), AppError> {
    let conn = pool.get()?;
    ProjectRepository::switch_project(&conn, &project_id).map_err(Into::into)
}

#[tauri::command]
pub fn get_project_checklist(
    pool: State<DbPool>,
    project_id: String,
) -> Result<Vec<crate::models::ChecklistSection>, AppError> {
    let conn = pool.get()?;
    ChecklistRepository::get_all_sections(&conn, &project_id).map_err(Into::into)
}
