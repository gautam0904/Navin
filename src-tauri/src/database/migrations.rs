use rusqlite::{Connection, Result};

/// Check if a column exists in a table
pub fn column_exists(conn: &Connection, table: &str, column: &str) -> bool {
    let query = format!(
        "SELECT COUNT(*) FROM pragma_table_info('{}') WHERE name='{}'",
        table, column
    );
    conn.query_row(&query, [], |row| {
        let count: i32 = row.get(0).unwrap_or(0);
        Ok(count > 0)
    })
    .unwrap_or(false)
}

/// Migrate existing database to support projects
pub fn migrate_database(conn: &Connection) -> Result<()> {
    // Check if checklist_sections table exists first
    let table_exists: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='checklist_sections'",
            [],
            |row| {
                let count: i32 = row.get(0).unwrap_or(0);
                Ok(count > 0)
            },
        )
        .unwrap_or(false);

    // If table doesn't exist, no migration needed (fresh install)
    if !table_exists {
        tracing::info!("No existing database found, skipping migration");
        return Ok(());
    }

    // Check if migration is needed (if project_id column doesn't exist)
    let needs_migration = !column_exists(conn, "checklist_sections", "project_id");

    if !needs_migration {
        tracing::info!("Database already migrated, skipping migration");
        return Ok(());
    }

    tracing::info!("Migrating database to support projects...");

    // Step 1: Create projects table if it doesn't exist
    conn.execute(
        "CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            is_default INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )",
        [],
    )?;

    // Step 2: Create default project
    let default_project_id = "default-project".to_string();
    conn.execute(
        "INSERT OR IGNORE INTO projects (id, name, is_default) VALUES (?1, ?2, 1)",
        rusqlite::params![default_project_id, "Default Project"],
    )?;

    // Step 3: Add project_id column to checklist_sections (temporary nullable)
    conn.execute(
        "ALTER TABLE checklist_sections ADD COLUMN project_id TEXT",
        [],
    )?;

    // Step 4: Update existing sections to use default project
    conn.execute(
        "UPDATE checklist_sections SET project_id = ?1 WHERE project_id IS NULL",
        rusqlite::params![default_project_id],
    )?;

    // Step 5: Recreate table with project_id NOT NULL
    migrate_checklist_sections(conn)?;

    // Step 6: Migrate user_progress table if needed
    migrate_user_progress(conn, &default_project_id)?;

    tracing::info!("Database migration completed successfully");
    Ok(())
}

fn migrate_checklist_sections(conn: &Connection) -> Result<()> {
    // Disable foreign key constraints temporarily
    conn.execute("PRAGMA foreign_keys = OFF", [])?;
    conn.execute("BEGIN TRANSACTION", [])?;

    // Create new table with project_id
    conn.execute(
        "CREATE TABLE checklist_sections_new (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            title TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Copy data
    conn.execute(
        "INSERT INTO checklist_sections_new (id, project_id, title, display_order, created_at, updated_at)
         SELECT id, project_id, title, display_order, created_at, updated_at FROM checklist_sections",
        [],
    )?;

    // Drop old table and rename
    conn.execute("DROP TABLE checklist_sections", [])?;
    conn.execute(
        "ALTER TABLE checklist_sections_new RENAME TO checklist_sections",
        [],
    )?;

    conn.execute("COMMIT", [])?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;

    Ok(())
}

fn migrate_user_progress(conn: &Connection, default_project_id: &str) -> Result<()> {
    let progress_table_exists: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='user_progress'",
            [],
            |row| {
                let count: i32 = row.get(0).unwrap_or(0);
                Ok(count > 0)
            },
        )
        .unwrap_or(false);

    if progress_table_exists && !column_exists(conn, "user_progress", "project_id") {
        tracing::info!("Migrating user_progress table...");

        // Disable foreign key constraints temporarily
        conn.execute("PRAGMA foreign_keys = OFF", [])?;
        conn.execute("BEGIN TRANSACTION", [])?;

        conn.execute(
            "CREATE TABLE user_progress_new (
                item_id TEXT NOT NULL,
                project_id TEXT NOT NULL,
                is_checked INTEGER NOT NULL DEFAULT 0,
                checked_at TEXT,
                PRIMARY KEY (item_id, project_id),
                FOREIGN KEY (item_id) REFERENCES checklist_items(id) ON DELETE CASCADE,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Copy existing progress to default project
        conn.execute(
            "INSERT INTO user_progress_new (item_id, project_id, is_checked, checked_at)
             SELECT item_id, ?1, is_checked, checked_at FROM user_progress",
            rusqlite::params![default_project_id],
        )?;

        conn.execute("DROP TABLE user_progress", [])?;
        conn.execute("ALTER TABLE user_progress_new RENAME TO user_progress", [])?;

        conn.execute("COMMIT", [])?;
        conn.execute("PRAGMA foreign_keys = ON", [])?;
    }

    Ok(())
}
