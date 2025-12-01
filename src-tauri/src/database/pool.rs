use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::OpenFlags;
use std::path::PathBuf;

/// Type alias for the connection pool
pub type DbPool = Pool<SqliteConnectionManager>;

/// Create a new connection pool for the database
pub fn create_pool(db_path: PathBuf) -> Result<DbPool, r2d2::Error> {
    let manager = SqliteConnectionManager::file(db_path)
        .with_flags(OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE)
        .with_init(|conn| {
            // Enable foreign keys for all connections
            conn.execute_batch(
                "PRAGMA foreign_keys = ON;
                 PRAGMA journal_mode = WAL;
                 PRAGMA synchronous = NORMAL;
                 PRAGMA cache_size = -64000;
                 PRAGMA temp_store = MEMORY;",
            )?;
            Ok(())
        });

    Pool::builder()
        .max_size(8)
        .connection_timeout(std::time::Duration::from_secs(30))
        .build(manager)
}
