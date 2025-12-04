use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Quality rule definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QualityRule {
    pub id: i64,
    pub checklist_item_id: Option<i64>,
    pub rule_type: RuleType,
    pub pattern: Option<String>,
    pub severity: RuleSeverity,
    pub weight: f32,
    pub auto_fixable: bool,
    pub enabled: bool,
    pub name: String,
    pub description: Option<String>,
}

/// Rule type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RuleType {
    ESLint,
    Prettier,
    Custom,
    Pattern,
    Complexity,
    TypeScript,
    CommitMessage,
    BranchNaming,
}

/// Rule severity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RuleSeverity {
    Error,
    Warning,
    Info,
}

/// File quality score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileScore {
    pub file_path: String,
    pub overall_score: f32,
    pub category_scores: HashMap<String, f32>,
    pub violations: Vec<RuleViolation>,
    pub analyzed_at: DateTime<Utc>,
    pub commit_sha: Option<String>,
}

/// Commit quality score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitScore {
    pub commit_sha: String,
    pub overall_score: f32,
    pub message_score: f32,
    pub code_score: f32,
    pub test_score: f32,
    pub files_analyzed: usize,
    pub violations: Vec<RuleViolation>,
}

/// Branch quality score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchScore {
    pub branch_name: String,
    pub overall_score: f32,
    pub naming_score: f32,
    pub commit_quality_avg: f32,
    pub recent_commits: Vec<CommitScore>,
}

/// PR quality score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PRScore {
    pub pr_number: u32,
    pub overall_score: f32,
    pub checklist_progress: f32,
    pub code_quality: f32,
    pub test_coverage: f32,
    pub api_contract_adherence: f32,
    pub violations: Vec<RuleViolation>,
    pub file_scores: Vec<FileScore>,
}

/// Rule violation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuleViolation {
    pub rule_id: i64,
    pub rule_name: String,
    pub severity: RuleSeverity,
    pub message: String,
    pub file_path: String,
    pub line: Option<usize>,
    pub column: Option<usize>,
    pub auto_fix: Option<AutoFixSuggestion>,
}

/// Auto-fix suggestion
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AutoFixSuggestion {
    pub description: String,
    pub diff: String,
    pub can_apply_automatically: bool,
}

/// Quality check result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CheckResult {
    pub passed: bool,
    pub score: f32,
    pub violations: Vec<RuleViolation>,
    pub blocking_issues: Vec<RuleViolation>,
}

/// Project health score
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectHealth {
    pub overall_score: f32,
    pub category_breakdown: HashMap<String, CategoryHealth>,
    pub trend: Vec<HealthDataPoint>,
    pub hotspots: Vec<FileHotspot>,
}

/// Category health
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryHealth {
    pub name: String,
    pub score: f32,
    pub weight: f32,
    pub violation_count: usize,
    pub file_count: usize,
}

/// Health data point for trend analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthDataPoint {
    pub timestamp: DateTime<Utc>,
    pub score: f32,
    pub commit_sha: String,
}

/// File hotspot (needs attention)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileHotspot {
    pub path: String,
    pub score: f32,
    pub violation_count: usize,
    pub severity_breakdown: HashMap<String, usize>,
}

/// Custom rule definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomRule {
    pub name: String,
    pub description: String,
    pub pattern: String,
    pub severity: RuleSeverity,
    pub weight: f32,
    pub auto_fixable: bool,
    pub fix_pattern: Option<String>,
}

/// Scoring configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoringConfig {
    pub category_weights: HashMap<String, f32>,
    pub severity_multipliers: HashMap<String, f32>,
    pub thresholds: QualityThresholds,
}

/// Quality thresholds
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QualityThresholds {
    pub excellent: f32, // >= 90
    pub good: f32,      // >= 75
    pub fair: f32,      // >= 60
    pub poor: f32,      // < 60
}

impl Default for QualityThresholds {
    fn default() -> Self {
        Self {
            excellent: 90.0,
            good: 75.0,
            fair: 60.0,
            poor: 60.0,
        }
    }
}
