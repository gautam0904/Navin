use crate::database::checklist_data::get_default_checklist_data;
use crate::repositories::ChecklistRepository;
use rusqlite::{Connection, Result};

/// Seed the database with default checklist data
pub fn seed_default_data(conn: &mut Connection) -> Result<()> {
    // Check if default project data already exists
    let default_project_id = "default-project";
    let count: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM checklist_sections WHERE project_id = ?1",
            rusqlite::params![default_project_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if count > 0 {
        println!("👉 Default project data already seeded, skipping...");
        return Ok(());
    }

    println!("👉 Seeding database with default checklist data...");

    // Ensure default project exists
    let project_exists: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM projects WHERE id = ?1",
            rusqlite::params![default_project_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if project_exists == 0 {
        conn.execute(
            "INSERT INTO projects (id, name, is_default, created_at, updated_at) 
             VALUES (?1, 'Default Project', 1, datetime('now'), datetime('now'))",
            rusqlite::params![default_project_id],
        )?;
    }

    let default_sections = get_default_checklist_data();

    for (idx, section) in default_sections.iter().enumerate() {
        ChecklistRepository::insert_section(conn, section, default_project_id, idx as i32)?;
    }

    println!("✅ Successfully seeded {} sections", default_sections.len());
    Ok(())
}
