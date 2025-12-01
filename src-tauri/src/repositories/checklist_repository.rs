use crate::database::queries as q;
use crate::models::*;
use crate::repositories::helpers;
use rusqlite::{params, Connection, Result};

pub struct ChecklistRepository;

impl ChecklistRepository {
    /// Get all sections with their items, examples, and code examples for a project
    pub fn get_all_sections(conn: &Connection, project_id: &str) -> Result<Vec<ChecklistSection>> {
        let mut stmt = conn.prepare(q::GET_SECTIONS)?;

        let section_rows: Vec<SectionRow> = stmt
            .query_map(params![project_id], |row| {
                Ok(SectionRow {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    display_order: row.get(2)?,
                })
            })?
            .collect::<Result<Vec<_>>>()?;

        let mut sections = Vec::new();

        for section_row in section_rows {
            let items = Self::get_items_for_section(conn, &section_row.id)?;
            let examples = helpers::fetch_examples(conn, q::GET_SECTION_EXAMPLES, &section_row.id)?;
            let code_examples = helpers::fetch_code_examples(conn, q::GET_SECTION_CODE_EXAMPLES_V2, &section_row.id)?;
            let code_example = Self::get_legacy_code_example(conn, q::GET_SECTION_CODE_EXAMPLE, &section_row.id)?;

            sections.push(ChecklistSection {
                id: section_row.id,
                title: section_row.title,
                items,
                examples: if examples.good.is_empty() && examples.bad.is_empty() {
                    None
                } else {
                    Some(examples)
                },
                code_examples: if code_examples.good.is_empty() && code_examples.bad.is_empty() {
                    None
                } else {
                    Some(code_examples)
                },
                code_example: if code_example.is_empty() {
                    None
                } else {
                    Some(code_example)
                },
            });
        }

        Ok(sections)
    }

    fn get_items_for_section(conn: &Connection, section_id: &str) -> Result<Vec<ChecklistItem>> {
        let mut stmt = conn.prepare(q::GET_ITEMS_FOR_SECTION)?;

        let item_rows: Vec<(String, String)> = stmt
            .query_map(params![section_id], |row| Ok((row.get(0)?, row.get(1)?)))?
            .collect::<Result<Vec<_>>>()?;

        let mut items = Vec::new();
        for (id, text) in item_rows {
            let examples = helpers::fetch_examples(conn, q::GET_ITEM_EXAMPLES, &id)?;
            let code_examples = helpers::fetch_code_examples(conn, q::GET_ITEM_CODE_EXAMPLES_V2, &id)?;
            let code_example = Self::get_legacy_code_example(conn, q::GET_ITEM_CODE_EXAMPLE, &id)?;

            items.push(ChecklistItem {
                id,
                text,
                is_checked: None,
                examples: if examples.good.is_empty() && examples.bad.is_empty() {
                    None
                } else {
                    Some(examples)
                },
                code_examples: if code_examples.good.is_empty() && code_examples.bad.is_empty() {
                    None
                } else {
                    Some(code_examples)
                },
                code_example: if code_example.is_empty() {
                    None
                } else {
                    Some(code_example)
                },
            });
        }

        Ok(items)
    }

    fn get_legacy_code_example(conn: &Connection, query: &str, entity_id: &str) -> Result<String> {
        let code_text: Option<String> = conn
            .query_row(query, params![entity_id], |row| row.get(0))
            .ok();

        Ok(code_text.unwrap_or_default())
    }

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

    fn insert_examples_in_tx(
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
        let max_order: i32 = conn.query_row(q::GET_MAX_ITEM_ORDER, params![section_id], |row| row.get(0))?;

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

    /// Update examples for a section
    pub fn update_examples(
        conn: &mut Connection,
        section_id: &str,
        examples: Option<&Examples>,
    ) -> Result<()> {
        helpers::update_examples_with_transaction(
            conn,
            q::DELETE_SECTION_EXAMPLES,
            q::INSERT_SECTION_EXAMPLE,
            section_id,
            examples,
        )
    }

    /// Update code example for a section (legacy)
    pub fn update_code_example(
        conn: &mut Connection,
        section_id: &str,
        code_example: Option<&str>,
    ) -> Result<()> {
        if let Some(code) = code_example {
            if !code.is_empty() {
                conn.execute(
                    q::INSERT_OR_REPLACE_SECTION_CODE_EXAMPLE,
                    params![section_id, code],
                )?;
            } else {
                conn.execute(q::DELETE_SECTION_CODE_EXAMPLE, params![section_id])?;
            }
        } else {
            conn.execute(q::DELETE_SECTION_CODE_EXAMPLE, params![section_id])?;
        }
        Ok(())
    }

    /// Update examples for an item
    pub fn update_item_examples(
        conn: &mut Connection,
        item_id: &str,
        examples: Option<&Examples>,
    ) -> Result<()> {
        helpers::update_examples_with_transaction(
            conn,
            q::DELETE_ITEM_EXAMPLES,
            q::INSERT_ITEM_EXAMPLE,
            item_id,
            examples,
        )
    }

    /// Update code examples for an item (good/bad with language)
    pub fn update_item_code_examples(
        conn: &mut Connection,
        item_id: &str,
        code_examples: Option<&CodeExamples>,
    ) -> Result<()> {
        helpers::update_code_examples_with_transaction(
            conn,
            q::DELETE_ITEM_CODE_EXAMPLES_V2,
            q::INSERT_ITEM_CODE_EXAMPLE_V2,
            item_id,
            code_examples,
        )
    }

    /// Update code example for an item (legacy)
    pub fn update_item_code_example(
        conn: &mut Connection,
        item_id: &str,
        code_example: Option<&str>,
    ) -> Result<()> {
        if let Some(code) = code_example {
            if !code.is_empty() {
                conn.execute(
                    q::INSERT_OR_REPLACE_ITEM_CODE_EXAMPLE,
                    params![item_id, code],
                )?;
            } else {
                conn.execute(q::DELETE_ITEM_CODE_EXAMPLE, params![item_id])?;
            }
        } else {
            conn.execute(q::DELETE_ITEM_CODE_EXAMPLE, params![item_id])?;
        }
        Ok(())
    }

    /// Update code examples for a section (good/bad with language)
    pub fn update_code_examples(
        conn: &mut Connection,
        section_id: &str,
        code_examples: Option<&CodeExamples>,
    ) -> Result<()> {
        helpers::update_code_examples_with_transaction(
            conn,
            q::DELETE_SECTION_CODE_EXAMPLES_V2,
            q::INSERT_SECTION_CODE_EXAMPLE_V2,
            section_id,
            code_examples,
        )
    }
}
