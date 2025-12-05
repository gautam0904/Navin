mod checklist_data;
mod checklist_data_part1;
mod checklist_data_part2;
pub mod migrations;
pub mod pool;
pub mod queries;
pub mod schema;
mod seeds;

use rusqlite::{Connection, Result};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub use checklist_data::get_default_checklist_data;
pub use pool::{create_pool, DbPool};
pub use seeds::seed_default_data;

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

/// Open a database connection (kept for backwards compatibility during migration)
#[allow(dead_code)]
pub fn open_connection(app: &AppHandle) -> Result<Connection> {
    let db_path = get_db_path(app);
    Connection::open(&db_path)
}

/// Initialize database with schema and seed data
pub fn init_db(app: &AppHandle) -> Result<()> {
    let db_path = get_db_path(app);
    tracing::info!("Opening DB at: {:?}", db_path);

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
            tracing::error!("Failed to open database at {:?}: {}", db_path, e);
            return Err(e);
        }
    };

    // Run migration first (handles existing databases)
    if let Err(e) = migrations::migrate_database(&conn) {
        tracing::warn!("Migration warning (continuing): {}", e);
        // Continue even if migration fails for new databases
    }

    // Initialize schema (creates new tables if needed)
    schema::init_schema(&conn).map_err(|e| {
        tracing::error!("Failed to initialize schema: {}", e);
        e
    })?;
    tracing::info!("Database schema initialized");

    // Seed default data
    if let Err(e) = seed_default_data(&mut conn) {
        tracing::warn!("Failed to seed default data (continuing): {}", e);
        // Continue even if seeding fails (might already be seeded)
    }

    Ok(())
}
