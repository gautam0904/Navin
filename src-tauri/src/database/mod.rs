mod seeds;

use rusqlite::{Connection, Result};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub use seeds::seed_default_data;
pub use seeds::get_default_checklist_data;

/// Get the database path based on environment (dev or production)
pub fn get_db_path(app: &AppHandle) -> PathBuf {
    // DEV MODE → store DB next to src-tauri
    let dev_path = std::path::Path::new("navin.db");
    if dev_path.exists() {
        return dev_path.to_path_buf();
    }

    // PRODUCTION → AppData folder
    let dir = app
        .path()
        .app_data_dir()
        .unwrap_or(std::env::current_dir().expect("Failed to get current dir"));

    let db_path = dir.join("navin.db");

    if let Some(parent) = db_path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    db_path
}

/// Open a database connection
pub fn open_connection(app: &AppHandle) -> Result<Connection> {
    let db_path = get_db_path(app);
    Connection::open(&db_path)
}

/// Check if a column exists in a table
fn column_exists(conn: &Connection, table: &str, column: &str) -> bool {
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
fn migrate_database(conn: &Connection) -> Result<()> {
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
        println!("👉 No existing database found, skipping migration...");
        return Ok(());
    }

    // Check if migration is needed (if project_id column doesn't exist)
    let needs_migration = !column_exists(conn, "checklist_sections", "project_id");
    
    if !needs_migration {
        println!("👉 Database already migrated, skipping migration...");
        return Ok(());
    }

    println!("👉 Migrating database to support projects...");

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

    // Step 5: Make project_id NOT NULL (SQLite doesn't support this directly, so we'll recreate the table)
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

    // Drop old table
    conn.execute("DROP TABLE checklist_sections", [])?;

    // Rename new table
    conn.execute("ALTER TABLE checklist_sections_new RENAME TO checklist_sections", [])?;

    conn.execute("COMMIT", [])?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;

    // Step 6: Migrate user_progress table if it exists
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
        println!("👉 Migrating user_progress table...");
        
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

    println!("✅ Database migration completed successfully");
    Ok(())
}

/// Initialize database schema
pub fn init_schema(conn: &Connection) -> Result<()> {
    // Projects table - each project has its own checklist
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

    // Checklist sections table - now linked to projects
    conn.execute(
        "CREATE TABLE IF NOT EXISTS checklist_sections (
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

    // Checklist items table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS checklist_items (
            id TEXT PRIMARY KEY,
            section_id TEXT NOT NULL,
            text TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (section_id) REFERENCES checklist_sections(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Item examples table (good/bad examples for individual items)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS item_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT NOT NULL,
            example_type TEXT NOT NULL CHECK(example_type IN ('good', 'bad')),
            example_text TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (item_id) REFERENCES checklist_items(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Item code examples table (legacy - single code example)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS item_code_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT NOT NULL UNIQUE,
            code_text TEXT NOT NULL,
            FOREIGN KEY (item_id) REFERENCES checklist_items(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Item code examples table v2 (good/bad with language)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS item_code_examples_v2 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT NOT NULL,
            example_type TEXT NOT NULL CHECK(example_type IN ('good', 'bad')),
            language TEXT NOT NULL,
            code_text TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (item_id) REFERENCES checklist_items(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Section examples table (good/bad examples)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS section_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id TEXT NOT NULL,
            example_type TEXT NOT NULL CHECK(example_type IN ('good', 'bad')),
            example_text TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (section_id) REFERENCES checklist_sections(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Code examples table (legacy - single code example)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS section_code_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id TEXT NOT NULL UNIQUE,
            code_text TEXT NOT NULL,
            FOREIGN KEY (section_id) REFERENCES checklist_sections(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Section code examples table (good/bad with language)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS section_code_examples_v2 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id TEXT NOT NULL,
            example_type TEXT NOT NULL CHECK(example_type IN ('good', 'bad')),
            language TEXT NOT NULL,
            code_text TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (section_id) REFERENCES checklist_sections(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // User progress table (checked items) - now linked to projects
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user_progress (
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

    // Create indexes for better performance
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_items_section_id ON checklist_items(section_id)",
        [],
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_examples_section_id ON section_examples(section_id)",
        [],
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_sections_project_id ON checklist_sections(project_id)",
        [],
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_progress_project_id ON user_progress(project_id)",
        [],
    )?;

    Ok(())
}

/// Initialize database with schema and seed data
pub fn init_db(app: &AppHandle) -> Result<()> {
    let db_path = get_db_path(app);
    println!("👉 Opening DB at: {:?}", db_path);
    
    // Ensure parent directory exists
    if let Some(parent) = db_path.parent() {
        if let Err(e) = std::fs::create_dir_all(parent) {
            return Err(rusqlite::Error::SqliteFailure(
                rusqlite::ffi::Error::new(rusqlite::ffi::SQLITE_CANTOPEN),
                Some(format!("Failed to create database directory: {}", e)),
            ));
        }
    }
    
    let mut conn = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            eprintln!("❌ Failed to open database at {:?}: {}", db_path, e);
            return Err(e);
        }
    };
    
    // Run migration first (handles existing databases)
    if let Err(e) = migrate_database(&conn) {
        eprintln!("⚠️ Migration warning (continuing): {}", e);
        // Continue even if migration fails for new databases
    }
    
    // Initialize schema (creates new tables if needed)
    init_schema(&conn).map_err(|e| {
        eprintln!("❌ Failed to initialize schema: {}", e);
        e
    })?;
    println!("✅ Database schema initialized");
    
    // Seed default data
    if let Err(e) = seed_default_data(&mut conn) {
        eprintln!("⚠️ Failed to seed default data (continuing): {}", e);
        // Continue even if seeding fails (might already be seeded)
    }
    
    Ok(())
}

