/// SQL query constants organized by domain

// ========================================
// CHECKLIST QUERIES
// ========================================

// Section queries
pub const GET_SECTIONS: &str = 
    "SELECT id, title, display_order FROM checklist_sections 
     WHERE project_id = ?1 ORDER BY display_order";

pub const INSERT_SECTION: &str =
    "INSERT OR REPLACE INTO checklist_sections (id, project_id, title, display_order, updated_at) 
     VALUES (?1, ?2, ?3, ?4, datetime('now'))";

pub const DELETE_SECTION: &str = "DELETE FROM checklist_sections WHERE id = ?1";

pub const UPDATE_SECTION_TITLE: &str =
    "UPDATE checklist_sections SET title = ?1, updated_at = datetime('now') WHERE id = ?2";

// Item queries
pub const GET_ITEMS_FOR_SECTION: &str =
    "SELECT id, text, display_order FROM checklist_items 
     WHERE section_id = ?1 ORDER BY display_order";

pub const INSERT_ITEM: &str =
    "INSERT INTO checklist_items (id, section_id, text, display_order, updated_at) 
     VALUES (?1, ?2, ?3, ?4, datetime('now'))";

pub const GET_MAX_ITEM_ORDER: &str =
    "SELECT COALESCE(MAX(display_order), -1) + 1 FROM checklist_items WHERE section_id = ?1";

pub const UPDATE_ITEM: &str =
    "UPDATE checklist_items SET text = ?1, updated_at = datetime('now') WHERE id = ?2";

pub const DELETE_ITEM: &str = "DELETE FROM checklist_items WHERE id = ?1";

// Example queries
pub const GET_SECTION_EXAMPLES: &str =
    "SELECT example_type, example_text, display_order FROM section_examples 
     WHERE section_id = ?1 ORDER BY example_type, display_order";

pub const GET_ITEM_EXAMPLES: &str =
    "SELECT example_type, example_text, display_order FROM item_examples 
     WHERE item_id = ?1 ORDER BY example_type, display_order";

pub const DELETE_SECTION_EXAMPLES: &str = "DELETE FROM section_examples WHERE section_id = ?1";

pub const DELETE_ITEM_EXAMPLES: &str = "DELETE FROM item_examples WHERE item_id = ?1";

pub const INSERT_SECTION_EXAMPLE: &str =
    "INSERT INTO section_examples (section_id, example_type, example_text, display_order) 
     VALUES (?1, ?2, ?3, ?4)";

pub const INSERT_ITEM_EXAMPLE: &str =
    "INSERT INTO item_examples (item_id, example_type, example_text, display_order) 
     VALUES (?1, ?2, ?3, ?4)";

// Code example queries (v2 - with language)
pub const GET_SECTION_CODE_EXAMPLES_V2: &str =
    "SELECT example_type, language, code_text, display_order FROM section_code_examples_v2 
     WHERE section_id = ?1 ORDER BY example_type, display_order";

pub const GET_ITEM_CODE_EXAMPLES_V2: &str =
    "SELECT example_type, language, code_text, display_order FROM item_code_examples_v2 
     WHERE item_id = ?1 ORDER BY example_type, display_order";

pub const DELETE_SECTION_CODE_EXAMPLES_V2: &str = 
    "DELETE FROM section_code_examples_v2 WHERE section_id = ?1";

pub const DELETE_ITEM_CODE_EXAMPLES_V2: &str = 
    "DELETE FROM item_code_examples_v2 WHERE item_id = ?1";

pub const INSERT_SECTION_CODE_EXAMPLE_V2: &str =
    "INSERT INTO section_code_examples_v2 (section_id, example_type, language, code_text, display_order) 
     VALUES (?1, ?2, ?3, ?4, ?5)";

pub const INSERT_ITEM_CODE_EXAMPLE_V2: &str =
    "INSERT INTO item_code_examples_v2 (item_id, example_type, language, code_text, display_order) 
     VALUES (?1, ?2, ?3, ?4, ?5)";

// Legacy code example queries
pub const GET_SECTION_CODE_EXAMPLE: &str =
    "SELECT code_text FROM section_code_examples WHERE section_id = ?1";

pub const GET_ITEM_CODE_EXAMPLE: &str =
    "SELECT code_text FROM item_code_examples WHERE item_id = ?1";

pub const INSERT_OR_REPLACE_SECTION_CODE_EXAMPLE: &str =
    "INSERT OR REPLACE INTO section_code_examples (section_id, code_text) VALUES (?1, ?2)";

pub const INSERT_OR_REPLACE_ITEM_CODE_EXAMPLE: &str =
    "INSERT OR REPLACE INTO item_code_examples (item_id, code_text) VALUES (?1, ?2)";

pub const DELETE_SECTION_CODE_EXAMPLE: &str = 
    "DELETE FROM section_code_examples WHERE section_id = ?1";

pub const DELETE_ITEM_CODE_EXAMPLE: &str = 
    "DELETE FROM item_code_examples WHERE item_id = ?1";

// ========================================
// PROJECT QUERIES
// ========================================

pub const GET_ALL_PROJECTS: &str =
    "SELECT id, name, description, is_default, created_at, updated_at 
     FROM projects ORDER BY created_at DESC";

pub const GET_CURRENT_PROJECT: &str =
    "SELECT id, name, description, is_default, created_at, updated_at 
     FROM projects WHERE is_default = 1 LIMIT 1";

pub const GET_PROJECT_BY_ID: &str =
    "SELECT id, name, description, is_default, created_at, updated_at 
     FROM projects WHERE id = ?1";

pub const CREATE_PROJECT: &str =
    "INSERT INTO projects (id, name, description, is_default) VALUES (?1, ?2, ?3, 0)";

pub const UPDATE_PROJECT: &str =
    "UPDATE projects SET name = ?1, description = ?2, updated_at = datetime('now') WHERE id = ?3";

pub const DELETE_PROJECT: &str = "DELETE FROM projects WHERE id = ?1";

pub const UNSET_ALL_DEFAULT_PROJECTS: &str = "UPDATE projects SET is_default = 0";

pub const SET_DEFAULT_PROJECT: &str = "UPDATE projects SET is_default = 1 WHERE id = ?1";

// ========================================
// PROGRESS QUERIES
// ========================================

pub const GET_CHECKED_ITEMS: &str =
    "SELECT item_id FROM user_progress WHERE project_id = ?1 AND is_checked = 1";

pub const GET_ITEM_CHECKED_STATUS: &str =
    "SELECT is_checked FROM user_progress WHERE item_id = ?1 AND project_id = ?2";

pub const INSERT_OR_REPLACE_PROGRESS: &str =
    "INSERT OR REPLACE INTO user_progress (item_id, project_id, is_checked, checked_at) 
     VALUES (?1, ?2, ?3, datetime('now'))";

pub const DELETE_PROGRESS: &str =
    "DELETE FROM user_progress WHERE item_id = ?1 AND project_id = ?2";

pub const RESET_ALL_PROGRESS: &str = "DELETE FROM user_progress WHERE project_id = ?1";

// ========================================
// MIGRATION/SCHEMA QUERIES
// ========================================

pub const CHECK_TABLE_EXISTS: &str =
    "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?1";

pub const CHECK_COLUMN_EXISTS: &str =
    "SELECT COUNT(*) FROM pragma_table_info(?1) WHERE name=?2";

pub const DELETE_CHECKLIST_SECTIONS_BY_PROJECT: &str =
    "DELETE FROM checklist_sections WHERE project_id = ?1";

pub const DELETE_USER_PROGRESS_BY_PROJECT: &str =
    "DELETE FROM user_progress WHERE project_id = ?1";
