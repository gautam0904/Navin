use std::fs;
use std::path::Path;
use serde::{Serialize, Deserialize};
use crate::core::error::AppError;
use crate::core::result::AppResult;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileEntry>>,
}

#[tauri::command]
pub fn read_dir(path: String) -> AppResult<Vec<FileEntry>> {
    let path = Path::new(&path);
    if !path.exists() {
        return Err(AppError::IoError(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Path not found",
        )));
    }

    let mut entries = Vec::new();
    
    match fs::read_dir(path) {
        Ok(dir) => {
            for entry in dir {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    let name = entry.file_name().to_string_lossy().to_string();
                    let is_dir = path.is_dir();
                    
                    // Skip hidden files/folders (starting with .)
                    if name.starts_with('.') {
                        continue;
                    }

                    entries.push(FileEntry {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_dir,
                        children: None, // Lazy load children
                    });
                }
            }
        }
        Err(e) => return Err(AppError::IoError(e)),
    }

    // Sort: directories first, then files
    entries.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.cmp(&b.name)
        } else {
            b.is_dir.cmp(&a.is_dir)
        }
    });

    Ok(entries)
}
