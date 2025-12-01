use crate::core::{error::AppError, validation};
use crate::database::DbPool;
use crate::models::{ChecklistItem, ChecklistSection, CodeExamples, Examples};
use crate::repositories::{ChecklistRepository, ProjectRepository};
use tauri::State;

#[tauri::command]
pub fn get_all_sections(
    pool: State<DbPool>,
    project_id: Option<String>,
) -> Result<Vec<ChecklistSection>, AppError> {
    let conn: r2d2::PooledConnection<r2d2_sqlite::SqliteConnectionManager> = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        match ProjectRepository::get_current_project(&conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ChecklistRepository::get_all_sections(&conn, &project_id).map_err(Into::into)
}

#[tauri::command]
pub fn add_section(
    pool: State<DbPool>,
    section: ChecklistSection,
    project_id: Option<String>,
    display_order: i32,
) -> Result<(), AppError> {
    // Validate section title
    validation::validate_section_title(&section.title)?;

    let mut conn = pool.get()?;

    let project_id = if let Some(pid) = project_id {
        pid
    } else {
        let read_conn = pool.get()?;
        match ProjectRepository::get_current_project(&read_conn)? {
            Some(project) => project.id,
            None => return Err(AppError::NotFound("No project found".to_string())),
        }
    };

    ChecklistRepository::insert_section(&mut conn, &section, &project_id, display_order)
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_section_title(
    pool: State<DbPool>,
    section_id: String,
    title: String,
) -> Result<(), AppError> {
    validation::validate_section_title(&title)?;
    let conn = pool.get()?;
    ChecklistRepository::update_section_title(&conn, &section_id, &title).map_err(Into::into)
}

#[tauri::command]
pub fn delete_section(pool: State<DbPool>, section_id: String) -> Result<(), AppError> {
    let conn = pool.get()?;
    ChecklistRepository::delete_section(&conn, &section_id).map_err(Into::into)
}

#[tauri::command]
pub fn add_item(
    pool: State<DbPool>,
    section_id: String,
    item: ChecklistItem,
) -> Result<(), AppError> {
    validation::validate_item_text(&item.text)?;
    let conn = pool.get()?;
    ChecklistRepository::add_item(&conn, &section_id, &item).map_err(Into::into)
}

#[tauri::command]
pub fn update_item(pool: State<DbPool>, item_id: String, text: String) -> Result<(), AppError> {
    validation::validate_item_text(&text)?;
    let conn = pool.get()?;
    ChecklistRepository::update_item(&conn, &item_id, &text).map_err(Into::into)
}

#[tauri::command]
pub fn delete_item(pool: State<DbPool>, item_id: String) -> Result<(), AppError> {
    let conn = pool.get()?;
    ChecklistRepository::delete_item(&conn, &item_id).map_err(Into::into)
}

#[tauri::command]
pub fn update_section_examples(
    pool: State<DbPool>,
    section_id: String,
    examples: Option<Examples>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_examples(&mut conn, &section_id, examples.as_ref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_section_code_examples(
    pool: State<DbPool>,
    section_id: String,
    code_examples: Option<CodeExamples>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_code_examples(&mut conn, &section_id, code_examples.as_ref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_section_code_example(
    pool: State<DbPool>,
    section_id: String,
    code_example: Option<String>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_code_example(&mut conn, &section_id, code_example.as_deref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_item_examples(
    pool: State<DbPool>,
    item_id: String,
    examples: Option<Examples>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_item_examples(&mut conn, &item_id, examples.as_ref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_item_code_examples(
    pool: State<DbPool>,
    item_id: String,
    code_examples: Option<CodeExamples>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_item_code_examples(&mut conn, &item_id, code_examples.as_ref())
        .map_err(Into::into)
}

#[tauri::command]
pub fn update_item_code_example(
    pool: State<DbPool>,
    item_id: String,
    code_example: Option<String>,
) -> Result<(), AppError> {
    let mut conn = pool.get()?;
    ChecklistRepository::update_item_code_example(&mut conn, &item_id, code_example.as_deref())
        .map_err(Into::into)
}
