use crate::core::error::AppError;

/// Validate that a string is not empty
pub fn validate_not_empty(value: &str, field_name: &str) -> Result<(), AppError> {
    if value.trim().is_empty() {
        return Err(AppError::ValidationError(format!(
            "{} cannot be empty",
            field_name
        )));
    }
    Ok(())
}

/// Validate string length
pub fn validate_max_length(
    value: &str,
    field_name: &str,
    max_length: usize,
) -> Result<(), AppError> {
    if value.len() > max_length {
        return Err(AppError::ValidationError(format!(
            "{} cannot exceed {} characters (got {})",
            field_name,
            max_length,
            value.len()
        )));
    }
    Ok(())
}

/// Validate that an ID has the correct format
pub fn validate_id_format(id: &str, prefix: &str) -> Result<(), AppError> {
    if !id.starts_with(prefix) {
        return Err(AppError::ValidationError(format!(
            "Invalid ID format: expected to start with '{}'",
            prefix
        )));
    }
    Ok(())
}

/// Validate a project name
pub fn validate_project_name(name: &str) -> Result<(), AppError> {
    validate_not_empty(name, "Project name")?;
    validate_max_length(name, "Project name", 200)?;
    Ok(())
}

/// Validate a section title
pub fn validate_section_title(title: &str) -> Result<(), AppError> {
    validate_not_empty(title, "Section title")?;
    validate_max_length(title, "Section title", 500)?;
    Ok(())
}

/// Validate an item text
pub fn validate_item_text(text: &str) -> Result<(), AppError> {
    validate_not_empty(text, "Item text")?;
    validate_max_length(text, "Item text", 1000)?;
    Ok(())
}
