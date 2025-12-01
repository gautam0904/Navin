use rusqlite::{Connection, Result};

/// Initialize database schema with all tables and indexes
pub fn init_schema(conn: &Connection) -> Result<()> {
    create_tables(conn)?;
    create_indexes(conn)?;
    Ok(())
}

fn create_tables(conn: &Connection) -> Result<()> {
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

    // Checklist sections table - linked to projects
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

    // Example and code example tables
    create_example_tables(conn)?;

    // User progress table - checked items linked to projects
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

    Ok(())
}

fn create_example_tables(conn: &Connection) -> Result<()> {
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

    // Section code examples table (legacy - single code example)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS section_code_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id TEXT NOT NULL UNIQUE,
            code_text TEXT NOT NULL,
            FOREIGN KEY (section_id) REFERENCES checklist_sections(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Section code examples table v2 (good/bad with language)
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

    Ok(())
}

fn create_indexes(conn: &Connection) -> Result<()> {
    // Create indexes for better query performance
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
