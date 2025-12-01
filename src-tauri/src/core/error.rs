use serde::Serialize;
use thiserror::Error;

/// Application error types with structured serialization for frontend
#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    DatabaseError(#[from] rusqlite::Error),

    #[error("Database connection pool error: {0}")]
    ConnectionPoolError(#[from] r2d2::Error),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}

/// Serializable error response for frontend
#[derive(Serialize)]
pub struct ErrorResponse {
    pub code: String,
    pub message: String,
}

impl AppError {
    /// Get error code for this error type
    pub fn code(&self) -> &'static str {
        match self {
            AppError::DatabaseError(_) => "DATABASE_ERROR",
            AppError::ConnectionPoolError(_) => "CONNECTION_POOL_ERROR",
            AppError::NotFound(_) => "NOT_FOUND",
            AppError::ValidationError(_) => "VALIDATION_ERROR",
            AppError::IoError(_) => "IO_ERROR",
            AppError::SerializationError(_) => "SERIALIZATION_ERROR",
        }
    }

    /// Convert to serializable error response
    pub fn to_response(&self) -> ErrorResponse {
        ErrorResponse {
            code: self.code().to_string(),
            message: self.to_string(),
        }
    }
}

// Implement Serialize for AppError by converting to ErrorResponse
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        self.to_response().serialize(serializer)
    }
}
