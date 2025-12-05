use super::checklist_data_part1::*;
use super::checklist_data_part2::*;
use crate::models::ChecklistSection;

/// Get the default checklist data (hardcoded)
pub fn get_default_checklist_data() -> Vec<ChecklistSection> {
    vec![
        branch_section(),
        api_section(),
        code_section(),
        performance_section(),
        stability_section(),
        testing_section(),
        review_section(),
        tooling_section(),
        docs_section(),
        mindset_section(),
    ]
}
