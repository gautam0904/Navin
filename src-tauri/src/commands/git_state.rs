use std::path::PathBuf;
use std::sync::Mutex;

/// Global repository state
pub struct GitState {
    pub(crate) current_repo: Mutex<Option<PathBuf>>,
}

impl GitState {
    pub fn new() -> Self {
        Self {
            current_repo: Mutex::new(None),
        }
    }
}

impl Default for GitState {
    fn default() -> Self {
        Self::new()
    }
}
