use crate::database::queries as q;
use crate::models::*;
use crate::repositories::helpers;
use crate::repositories::ChecklistRepository;
use rusqlite::{params, Connection, Result};

/// Update operations for examples and code examples
impl ChecklistRepository {
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
