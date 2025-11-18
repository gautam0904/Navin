use crate::models::*;
use rusqlite::{params, Connection, Result};

pub struct ChecklistRepository;

impl ChecklistRepository {
    /// Get all sections with their items, examples, and code examples for a project
    pub fn get_all_sections(conn: &Connection, project_id: &str) -> Result<Vec<ChecklistSection>> {
        // Get all sections ordered by display_order for the given project
        let mut stmt = conn.prepare(
            "SELECT id, title, display_order FROM checklist_sections 
             WHERE project_id = ?1 ORDER BY display_order"
        )?;
        
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
            // Get items for this section
            let items = Self::get_items_for_section(conn, &section_row.id)?;

            // Get examples for this section
            let examples = Self::get_examples_for_section(conn, &section_row.id)?;

            // Get code examples for this section (new structure with language)
            let code_examples = Self::get_code_examples_for_section(conn, &section_row.id)?;
            
            // Get legacy code example for this section (backward compatibility)
            let code_example = Self::get_code_example_for_section(conn, &section_row.id)?;

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
        let mut stmt = conn.prepare(
            "SELECT id, text, display_order FROM checklist_items 
             WHERE section_id = ?1 ORDER BY display_order"
        )?;

        let item_rows: Vec<(String, String, i32)> = stmt
            .query_map(params![section_id], |row| {
                Ok((
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                ))
            })?
            .collect::<Result<Vec<_>>>()?;

        let mut items = Vec::new();
        for (id, text, _) in item_rows {
            // Get examples for this item
            let examples = Self::get_examples_for_item(conn, &id)?;
            
            // Get code examples for this item (new structure with language)
            let code_examples = Self::get_code_examples_for_item(conn, &id)?;
            
            // Get legacy code example for this item (backward compatibility)
            let code_example = Self::get_code_example_for_item(conn, &id)?;

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

    fn get_examples_for_item(conn: &Connection, item_id: &str) -> Result<Examples> {
        let mut stmt = conn.prepare(
            "SELECT example_type, example_text, display_order FROM item_examples 
             WHERE item_id = ?1 ORDER BY example_type, display_order"
        )?;

        let mut good = Vec::new();
        let mut bad = Vec::new();

        let rows = stmt.query_map(params![item_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
            ))
        })?;

        for row in rows {
            let (example_type, example_text) = row?;
            if example_type == "good" {
                good.push(example_text);
            } else {
                bad.push(example_text);
            }
        }

        Ok(Examples { good, bad })
    }

    fn get_code_examples_for_section(conn: &Connection, section_id: &str) -> Result<CodeExamples> {
        let mut stmt = conn.prepare(
            "SELECT example_type, language, code_text, display_order FROM section_code_examples_v2 
             WHERE section_id = ?1 ORDER BY example_type, display_order"
        )?;

        let mut good = Vec::new();
        let mut bad = Vec::new();

        let rows = stmt.query_map(params![section_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
            ))
        })?;

        for row in rows {
            let (example_type, language, code_text) = row?;
            let code_example = CodeExample { language, code: code_text };
            if example_type == "good" {
                good.push(code_example);
            } else {
                bad.push(code_example);
            }
        }

        Ok(CodeExamples { good, bad })
    }

    fn get_code_examples_for_item(conn: &Connection, item_id: &str) -> Result<CodeExamples> {
        let mut stmt = conn.prepare(
            "SELECT example_type, language, code_text, display_order FROM item_code_examples_v2 
             WHERE item_id = ?1 ORDER BY example_type, display_order"
        )?;

        let mut good = Vec::new();
        let mut bad = Vec::new();

        let rows = stmt.query_map(params![item_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
            ))
        })?;

        for row in rows {
            let (example_type, language, code_text) = row?;
            let code_example = CodeExample { language, code: code_text };
            if example_type == "good" {
                good.push(code_example);
            } else {
                bad.push(code_example);
            }
        }

        Ok(CodeExamples { good, bad })
    }

    fn get_code_example_for_item(conn: &Connection, item_id: &str) -> Result<String> {
        let mut stmt = conn.prepare(
            "SELECT code_text FROM item_code_examples WHERE item_id = ?1"
        )?;

        let code_text: Option<String> = stmt
            .query_row(params![item_id], |row| row.get(0))
            .ok();

        Ok(code_text.unwrap_or_default())
    }

    fn get_examples_for_section(conn: &Connection, section_id: &str) -> Result<Examples> {
        let mut stmt = conn.prepare(
            "SELECT example_type, example_text, display_order FROM section_examples 
             WHERE section_id = ?1 ORDER BY example_type, display_order"
        )?;

        let mut good = Vec::new();
        let mut bad = Vec::new();

        let rows = stmt.query_map(params![section_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
            ))
        })?;

        for row in rows {
            let (example_type, example_text) = row?;
            if example_type == "good" {
                good.push(example_text);
            } else {
                bad.push(example_text);
            }
        }

        Ok(Examples { good, bad })
    }

    fn get_code_example_for_section(conn: &Connection, section_id: &str) -> Result<String> {
        let mut stmt = conn.prepare(
            "SELECT code_text FROM section_code_examples WHERE section_id = ?1"
        )?;

        let code_text: Option<String> = stmt
            .query_row(params![section_id], |row| row.get(0))
            .ok();

        Ok(code_text.unwrap_or_default())
    }

    /// Insert a section with all its data
    pub fn insert_section(conn: &mut Connection, section: &ChecklistSection, project_id: &str, display_order: i32) -> Result<()> {
        let tx = conn.transaction()?;

        // Insert section
        tx.execute(
            "INSERT OR REPLACE INTO checklist_sections (id, project_id, title, display_order, updated_at) 
             VALUES (?1, ?2, ?3, ?4, datetime('now'))",
            params![section.id, project_id, section.title, display_order],
        )?;

        // Insert items
        for (idx, item) in section.items.iter().enumerate() {
            tx.execute(
                "INSERT OR REPLACE INTO checklist_items (id, section_id, text, display_order, updated_at) 
                 VALUES (?1, ?2, ?3, ?4, datetime('now'))",
                params![item.id, section.id, item.text, idx as i32],
            )?;
        }

        // Insert examples
        if let Some(examples) = &section.examples {
            // Delete existing examples
            tx.execute(
                "DELETE FROM section_examples WHERE section_id = ?1",
                params![section.id],
            )?;

            for (idx, good_example) in examples.good.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_examples (section_id, example_type, example_text, display_order) 
                     VALUES (?1, 'good', ?2, ?3)",
                    params![section.id, good_example, idx as i32],
                )?;
            }

            for (idx, bad_example) in examples.bad.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_examples (section_id, example_type, example_text, display_order) 
                     VALUES (?1, 'bad', ?2, ?3)",
                    params![section.id, bad_example, idx as i32],
                )?;
            }
        }

        // Insert code example
        if let Some(code_example) = &section.code_example {
            tx.execute(
                "INSERT OR REPLACE INTO section_code_examples (section_id, code_text) 
                 VALUES (?1, ?2)",
                params![section.id, code_example],
            )?;
        }

        tx.commit()?;
        Ok(())
    }

    /// Delete a section and all related data
    pub fn delete_section(conn: &Connection, section_id: &str) -> Result<()> {
        conn.execute(
            "DELETE FROM checklist_sections WHERE id = ?1",
            params![section_id],
        )?;
        Ok(())
    }

    /// Update section title
    pub fn update_section_title(conn: &Connection, section_id: &str, title: &str) -> Result<()> {
        conn.execute(
            "UPDATE checklist_sections SET title = ?1, updated_at = datetime('now') WHERE id = ?2",
            params![title, section_id],
        )?;
        Ok(())
    }

    /// Add item to section
    pub fn add_item(conn: &Connection, section_id: &str, item: &ChecklistItem) -> Result<()> {
        // Get max display_order for this section
        let max_order: i32 = conn
            .query_row(
                "SELECT COALESCE(MAX(display_order), -1) + 1 FROM checklist_items WHERE section_id = ?1",
                params![section_id],
                |row| row.get(0),
            )
            .unwrap_or(0);

        conn.execute(
            "INSERT INTO checklist_items (id, section_id, text, display_order, updated_at) 
             VALUES (?1, ?2, ?3, ?4, datetime('now'))",
            params![item.id, section_id, item.text, max_order],
        )?;
        Ok(())
    }

    /// Update item text
    pub fn update_item(conn: &Connection, item_id: &str, text: &str) -> Result<()> {
        conn.execute(
            "UPDATE checklist_items SET text = ?1, updated_at = datetime('now') WHERE id = ?2",
            params![text, item_id],
        )?;
        Ok(())
    }

    /// Delete item
    pub fn delete_item(conn: &Connection, item_id: &str) -> Result<()> {
        conn.execute("DELETE FROM checklist_items WHERE id = ?1", params![item_id])?;
        Ok(())
    }

    /// Update examples for a section
    pub fn update_examples(conn: &mut Connection, section_id: &str, examples: Option<&Examples>) -> Result<()> {
        let tx = conn.transaction()?;

        // Delete existing examples
        tx.execute(
            "DELETE FROM section_examples WHERE section_id = ?1",
            params![section_id],
        )?;

        // Insert new examples if provided
        if let Some(examples) = examples {
            for (idx, good_example) in examples.good.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_examples (section_id, example_type, example_text, display_order) 
                     VALUES (?1, 'good', ?2, ?3)",
                    params![section_id, good_example, idx as i32],
                )?;
            }

            for (idx, bad_example) in examples.bad.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_examples (section_id, example_type, example_text, display_order) 
                     VALUES (?1, 'bad', ?2, ?3)",
                    params![section_id, bad_example, idx as i32],
                )?;
            }
        }

        tx.commit()?;
        Ok(())
    }

    /// Update code example for a section
    pub fn update_code_example(conn: &mut Connection, section_id: &str, code_example: Option<&str>) -> Result<()> {
        if let Some(code) = code_example {
            if !code.is_empty() {
                conn.execute(
                    "INSERT OR REPLACE INTO section_code_examples (section_id, code_text) 
                     VALUES (?1, ?2)",
                    params![section_id, code],
                )?;
            } else {
                conn.execute(
                    "DELETE FROM section_code_examples WHERE section_id = ?1",
                    params![section_id],
                )?;
            }
        } else {
            conn.execute(
                "DELETE FROM section_code_examples WHERE section_id = ?1",
                params![section_id],
            )?;
        }
        Ok(())
    }

    /// Update examples for an item
    pub fn update_item_examples(conn: &mut Connection, item_id: &str, examples: Option<&Examples>) -> Result<()> {
        let tx = conn.transaction()?;

        // Delete existing examples
        tx.execute(
            "DELETE FROM item_examples WHERE item_id = ?1",
            params![item_id],
        )?;

        // Insert new examples if provided
        if let Some(examples) = examples {
            for (idx, good_example) in examples.good.iter().enumerate() {
                tx.execute(
                    "INSERT INTO item_examples (item_id, example_type, example_text, display_order) 
                     VALUES (?1, 'good', ?2, ?3)",
                    params![item_id, good_example, idx as i32],
                )?;
            }

            for (idx, bad_example) in examples.bad.iter().enumerate() {
                tx.execute(
                    "INSERT INTO item_examples (item_id, example_type, example_text, display_order) 
                     VALUES (?1, 'bad', ?2, ?3)",
                    params![item_id, bad_example, idx as i32],
                )?;
            }
        }

        tx.commit()?;
        Ok(())
    }

    /// Update code examples for an item (good/bad with language)
    pub fn update_item_code_examples(conn: &mut Connection, item_id: &str, code_examples: Option<&CodeExamples>) -> Result<()> {
        let tx = conn.transaction()?;

        // Delete existing code examples
        tx.execute(
            "DELETE FROM item_code_examples_v2 WHERE item_id = ?1",
            params![item_id],
        )?;

        // Insert new code examples if provided
        if let Some(code_examples) = code_examples {
            for (idx, good_example) in code_examples.good.iter().enumerate() {
                tx.execute(
                    "INSERT INTO item_code_examples_v2 (item_id, example_type, language, code_text, display_order) 
                     VALUES (?1, 'good', ?2, ?3, ?4)",
                    params![item_id, good_example.language, good_example.code, idx as i32],
                )?;
            }

            for (idx, bad_example) in code_examples.bad.iter().enumerate() {
                tx.execute(
                    "INSERT INTO item_code_examples_v2 (item_id, example_type, language, code_text, display_order) 
                     VALUES (?1, 'bad', ?2, ?3, ?4)",
                    params![item_id, bad_example.language, bad_example.code, idx as i32],
                )?;
            }
        }

        tx.commit()?;
        Ok(())
    }

    /// Update code example for an item (legacy - single code example)
    pub fn update_item_code_example(conn: &mut Connection, item_id: &str, code_example: Option<&str>) -> Result<()> {
        if let Some(code) = code_example {
            if !code.is_empty() {
                conn.execute(
                    "INSERT OR REPLACE INTO item_code_examples (item_id, code_text) 
                     VALUES (?1, ?2)",
                    params![item_id, code],
                )?;
            } else {
                conn.execute(
                    "DELETE FROM item_code_examples WHERE item_id = ?1",
                    params![item_id],
                )?;
            }
        } else {
            conn.execute(
                "DELETE FROM item_code_examples WHERE item_id = ?1",
                params![item_id],
            )?;
        }
        Ok(())
    }

    /// Update code examples for a section (good/bad with language)
    pub fn update_code_examples(conn: &mut Connection, section_id: &str, code_examples: Option<&CodeExamples>) -> Result<()> {
        let tx = conn.transaction()?;

        // Delete existing code examples
        tx.execute(
            "DELETE FROM section_code_examples_v2 WHERE section_id = ?1",
            params![section_id],
        )?;

        // Insert new code examples if provided
        if let Some(code_examples) = code_examples {
            for (idx, good_example) in code_examples.good.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_code_examples_v2 (section_id, example_type, language, code_text, display_order) 
                     VALUES (?1, 'good', ?2, ?3, ?4)",
                    params![section_id, good_example.language, good_example.code, idx as i32],
                )?;
            }

            for (idx, bad_example) in code_examples.bad.iter().enumerate() {
                tx.execute(
                    "INSERT INTO section_code_examples_v2 (section_id, example_type, language, code_text, display_order) 
                     VALUES (?1, 'bad', ?2, ?3, ?4)",
                    params![section_id, bad_example.language, bad_example.code, idx as i32],
                )?;
            }
        }

        tx.commit()?;
        Ok(())
    }
}

