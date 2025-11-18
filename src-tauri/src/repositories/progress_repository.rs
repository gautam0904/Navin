use rusqlite::{params, Connection, Result};

pub struct ProgressRepository;

impl ProgressRepository {
    /// Get all checked items for a project
    pub fn get_all_checked_items(conn: &Connection, project_id: &str) -> Result<Vec<String>> {
        let mut stmt = conn.prepare(
            "SELECT item_id FROM user_progress WHERE project_id = ?1 AND is_checked = 1"
        )?;

        let items: Vec<String> = stmt
            .query_map(params![project_id], |row| Ok(row.get(0)?))?
            .collect::<Result<Vec<_>>>()?;

        Ok(items)
    }

    /// Toggle item checked status for a project
    pub fn toggle_item(conn: &Connection, item_id: &str, project_id: &str) -> Result<bool> {
        // Check current status
        let current_status: Option<i32> = conn
            .query_row(
                "SELECT is_checked FROM user_progress WHERE item_id = ?1 AND project_id = ?2",
                params![item_id, project_id],
                |row| row.get(0),
            )
            .ok();

        let new_status = if current_status == Some(1) { 0 } else { 1 };

        if current_status.is_some() {
            // Update existing
            conn.execute(
                "UPDATE user_progress SET is_checked = ?1, checked_at = datetime('now') 
                 WHERE item_id = ?2 AND project_id = ?3",
                params![new_status, item_id, project_id],
            )?;
        } else {
            // Insert new
            conn.execute(
                "INSERT INTO user_progress (item_id, project_id, is_checked, checked_at) 
                 VALUES (?1, ?2, ?3, datetime('now'))",
                params![item_id, project_id, new_status],
            )?;
        }

        Ok(new_status == 1)
    }

    /// Set item checked status for a project
    pub fn set_item_checked(conn: &Connection, item_id: &str, project_id: &str, is_checked: bool) -> Result<()> {
        let checked = if is_checked { 1 } else { 0 };
        
        conn.execute(
            "INSERT OR REPLACE INTO user_progress (item_id, project_id, is_checked, checked_at) 
             VALUES (?1, ?2, ?3, datetime('now'))",
            params![item_id, project_id, checked],
        )?;
        Ok(())
    }

    /// Reset all progress for a project
    pub fn reset_all(conn: &Connection, project_id: &str) -> Result<()> {
        conn.execute("DELETE FROM user_progress WHERE project_id = ?1", params![project_id])?;
        Ok(())
    }
}

