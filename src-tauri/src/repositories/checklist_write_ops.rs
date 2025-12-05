use crate::database::queries as q;
use crate::models::*;
use crate::repositories::ChecklistRepository;
use rusqlite::{params, Connection, Result};

/// Write operations for ChecklistRepository
impl ChecklistRepository {
    /// Insert a section with all its data
    pub fn insert_section(
        conn: &mut Connection,
        section: &ChecklistSection,
        project_id: &str,
        display_order: i32,
    ) -> Result<()> {
        let tx = conn.transaction()?;

        // Insert section
        tx.execute(
            q::INSERT_SECTION,
            params![section.id, project_id, section.title, display_order],
        )?;

        // Insert items
        for (idx, item) in section.items.iter().enumerate() {
            tx.execute(
                q::INSERT_ITEM,
                params![item.id, section.id, item.text, idx as i32],
            )?;
        }

        // Insert examples if provided
        if let Some(examples) = &section.examples {
            Self::insert_examples_in_tx(&tx, q::INSERT_SECTION_EXAMPLE, &section.id, examples)?;
        }

        // Insert code example (legacy)
        if let Some(code_example) = &section.code_example {
            tx.execute(
                q::INSERT_OR_REPLACE_SECTION_CODE_EXAMPLE,
                params![section.id, code_example],
            )?;
        }

        tx.commit()?;
        Ok(())
    }

    pub(super) fn insert_examples_in_tx(
        tx: &rusqlite::Transaction,
        insert_query: &str,
        entity_id: &str,
        examples: &Examples,
    ) -> Result<()> {
        for (idx, good_example) in examples.good.iter().enumerate() {
            tx.execute(
                insert_query,
                params![entity_id, "good", good_example, idx as i32],
            )?;
        }

        for (idx, bad_example) in examples.bad.iter().enumerate() {
            tx.execute(
                insert_query,
                params![entity_id, "bad", bad_example, idx as i32],
            )?;
        }

        Ok(())
    }

    /// Delete a section and all related data
    pub fn delete_section(conn: &Connection, section_id: &str) -> Result<()> {
        conn.execute(q::DELETE_SECTION, params![section_id])?;
        Ok(())
    }

    /// Update section title
    pub fn update_section_title(conn: &Connection, section_id: &str, title: &str) -> Result<()> {
        conn.execute(q::UPDATE_SECTION_TITLE, params![title, section_id])?;
        Ok(())
    }

    /// Add item to section
    pub fn add_item(conn: &Connection, section_id: &str, item: &ChecklistItem) -> Result<()> {
        let max_order: i32 =
            conn.query_row(q::GET_MAX_ITEM_ORDER, params![section_id], |row| row.get(0))?;

        conn.execute(
            q::INSERT_ITEM,
            params![item.id, section_id, item.text, max_order],
        )?;
        Ok(())
    }

    /// Update item text
    pub fn update_item(conn: &Connection, item_id: &str, text: &str) -> Result<()> {
        conn.execute(q::UPDATE_ITEM, params![text, item_id])?;
        Ok(())
    }

    /// Delete item
    pub fn delete_item(conn: &Connection, item_id: &str) -> Result<()> {
        conn.execute(q::DELETE_ITEM, params![item_id])?;
        Ok(())
    }
}
