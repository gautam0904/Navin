use std::fmt;

#[derive(Debug)]
pub enum AppError {
    DatabaseError(String),
    NotFoundError(String),
    ValidationError(String),
    IoError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
            AppError::NotFoundError(msg) => write!(f, "Not found: {}", msg),
            AppError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            AppError::IoError(msg) => write!(f, "IO error: {}", msg),
        }
    }
}

impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::DatabaseError(err.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::IoError(err.to_string())
    }
}
