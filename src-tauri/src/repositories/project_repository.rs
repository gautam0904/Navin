use rusqlite::{params, Connection, Result};

pub struct ProjectRepository;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ProjectRow {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub is_default: bool,
    pub created_at: String,
    pub updated_at: String,
}

impl ProjectRepository {
    /// Get all projects
    pub fn get_all_projects(conn: &Connection) -> Result<Vec<ProjectRow>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, is_default, created_at, updated_at 
             FROM projects ORDER BY is_default DESC, created_at ASC"
        )?;

        let projects: Vec<ProjectRow> = stmt
            .query_map([], |row| {
                Ok(ProjectRow {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    is_default: row.get::<_, i32>(3)? == 1,
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                })
            })?
            .collect::<Result<Vec<_>>>()?;

        Ok(projects)
    }

    /// Get current active project (default project)
    pub fn get_current_project(conn: &Connection) -> Result<Option<ProjectRow>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, is_default, created_at, updated_at 
             FROM projects WHERE is_default = 1 LIMIT 1"
        )?;

        let result = stmt.query_row([], |row| {
            Ok(ProjectRow {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                is_default: row.get::<_, i32>(3)? == 1,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        });

        match result {
            Ok(project) => Ok(Some(project)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(e),
        }
    }

    /// Create a new project
    pub fn create_project(
        conn: &Connection,
        id: &str,
        name: &str,
        description: Option<&str>,
    ) -> Result<ProjectRow> {
        conn.execute(
            "INSERT INTO projects (id, name, description, is_default, created_at, updated_at) 
             VALUES (?1, ?2, ?3, 0, datetime('now'), datetime('now'))",
            params![id, name, description],
        )?;

        let project = ProjectRow {
            id: id.to_string(),
            name: name.to_string(),
            description: description.map(|s| s.to_string()),
            is_default: false,
            created_at: "".to_string(),
            updated_at: "".to_string(),
        };

        Ok(project)
    }

    /// Update project
    pub fn update_project(
        conn: &Connection,
        project_id: &str,
        name: &str,
        description: Option<&str>,
    ) -> Result<()> {
        conn.execute(
            "UPDATE projects SET name = ?1, description = ?2, updated_at = datetime('now') 
             WHERE id = ?3",
            params![name, description, project_id],
        )?;
        Ok(())
    }

    /// Delete project
    pub fn delete_project(conn: &Connection, project_id: &str) -> Result<()> {
        // Don't allow deleting the default project
        let is_default: i32 = conn
            .query_row(
                "SELECT is_default FROM projects WHERE id = ?1",
                params![project_id],
                |row| row.get(0),
            )?;

        if is_default == 1 {
            return Err(rusqlite::Error::SqliteFailure(
                rusqlite::ffi::Error::new(rusqlite::ffi::SQLITE_CONSTRAINT),
                Some("Cannot delete the default project".to_string()),
            ));
        }

        conn.execute("DELETE FROM projects WHERE id = ?1", params![project_id])?;
        Ok(())
    }

    /// Switch to a project (set as default)
    pub fn switch_project(conn: &Connection, project_id: &str) -> Result<()> {
        conn.execute("BEGIN TRANSACTION", [])?;

        // Unset all defaults
        conn.execute("UPDATE projects SET is_default = 0", [])?;

        // Set new default
        conn.execute(
            "UPDATE projects SET is_default = 1, updated_at = datetime('now') WHERE id = ?1",
            params![project_id],
        )?;

        conn.execute("COMMIT", [])?;
        Ok(())
    }

    /// Get project by ID
    pub fn get_project_by_id(conn: &Connection, project_id: &str) -> Result<Option<ProjectRow>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, is_default, created_at, updated_at 
             FROM projects WHERE id = ?1"
        )?;

        let result = stmt.query_row(params![project_id], |row| {
            Ok(ProjectRow {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                is_default: row.get::<_, i32>(3)? == 1,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        });

        match result {
            Ok(project) => Ok(Some(project)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(e),
        }
    }
}

