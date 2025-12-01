use crate::models::{CodeExample, CodeExamples, Examples};
use rusqlite::{params, Connection, Result};

/// Generic helper to fetch good/bad examples for a given entity (section or item)
pub fn fetch_examples(
    conn: &Connection,
    query: &str,
    entity_id: &str,
) -> Result<Examples> {
    let mut stmt = conn.prepare(query)?;

    let mut good = Vec::new();
    let mut bad = Vec::new();

    let rows = stmt.query_map(params![entity_id], |row| {
        Ok((
            row.get::<_, String>(0)?, // example_type
            row.get::<_, String>(1)?, // example_text
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

/// Generic helper to fetch good/bad code examples for a given entity (section or item)
pub fn fetch_code_examples(
    conn: &Connection,
    query: &str,
    entity_id: &str,
) -> Result<CodeExamples> {
    let mut stmt = conn.prepare(query)?;

    let mut good = Vec::new();
    let mut bad = Vec::new();

    let rows = stmt.query_map(params![entity_id], |row| {
        Ok((
            row.get::<_, String>(0)?, // example_type
            row.get::<_, String>(1)?, // language
            row.get::<_, String>(2)?, // code_text
        ))
    })?;

    for row in rows {
        let (example_type, language, code_text) = row?;
        let code_example = CodeExample {
            language,
            code: code_text,
        };
        if example_type == "good" {
            good.push(code_example);
        } else {
            bad.push(code_example);
        }
    }

    Ok(CodeExamples { good, bad })
}

/// Generic helper to update examples with a transaction
pub fn update_examples_with_transaction(
    conn: &mut Connection,
    delete_query: &str,
    insert_query: &str,
    entity_id: &str,
    examples: Option<&Examples>,
) -> Result<()> {
    let tx = conn.transaction()?;

    // Delete existing examples
    tx.execute(delete_query, params![entity_id])?;

    // Insert new examples if provided
    if let Some(examples) = examples {
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
    }

    tx.commit()?;
    Ok(())
}

/// Generic helper to update code examples with a transaction
pub fn update_code_examples_with_transaction(
    conn: &mut Connection,
    delete_query: &str,
    insert_query: &str,
    entity_id: &str,
    code_examples: Option<&CodeExamples>,
) -> Result<()> {
    let tx = conn.transaction()?;

    // Delete existing code examples
    tx.execute(delete_query, params![entity_id])?;

    // Insert new code examples if provided
    if let Some(code_examples) = code_examples {
        for (idx, good_example) in code_examples.good.iter().enumerate() {
            tx.execute(
                insert_query,
                params![
                    entity_id,
                    "good",
                    &good_example.language,
                    &good_example.code,
                    idx as i32
                ],
            )?;
        }

        for (idx, bad_example) in code_examples.bad.iter().enumerate() {
            tx.execute(
                insert_query,
                params![
                    entity_id,
                    "bad",
                    &bad_example.language,
                    &bad_example.code,
                    idx as i32
                ],
            )?;
        }
    }

    tx.commit()?;
    Ok(())
}
