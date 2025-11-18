use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChecklistSection {
    pub id: String,
    pub title: String,
    pub items: Vec<ChecklistItem>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub examples: Option<Examples>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_examples: Option<CodeExamples>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_example: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChecklistItem {
    pub id: String,
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_checked: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub examples: Option<Examples>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_examples: Option<CodeExamples>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_example: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Examples {
    pub good: Vec<String>,
    pub bad: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeExample {
    pub language: String,
    pub code: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeExamples {
    pub good: Vec<CodeExample>,
    pub bad: Vec<CodeExample>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SectionRow {
    pub id: String,
    pub title: String,
    pub display_order: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ItemRow {
    pub id: String,
    pub section_id: String,
    pub text: String,
    pub display_order: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExampleRow {
    pub section_id: String,
    pub example_type: String,
    pub example_text: String,
    pub display_order: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeExampleRow {
    pub section_id: String,
    pub code_text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProgressRow {
    pub item_id: String,
    pub is_checked: bool,
}

