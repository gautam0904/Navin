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
            let code_examples = helpers::fetch_code_examples(
                conn,
                q::GET_SECTION_CODE_EXAMPLES_V2,
                &section_row.id,
            )?;
            let code_example =
                Self::get_legacy_code_example(conn, q::GET_SECTION_CODE_EXAMPLE, &section_row.id)?;

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
            let code_examples =
                helpers::fetch_code_examples(conn, q::GET_ITEM_CODE_EXAMPLES_V2, &id)?;
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
}
