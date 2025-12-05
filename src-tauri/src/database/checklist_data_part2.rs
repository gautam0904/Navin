use crate::models::*;

/// Testing section
pub fn testing_section() -> ChecklistSection {
    ChecklistSection {
        id: "testing".to_string(),
        title: "🧪 Testing".to_string(),
        items: vec![
            ChecklistItem {
                id: "test-1".to_string(),
                text: "Wrote logical test cases for new components".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "test-2".to_string(),
                text: "Unit tests with React Testing Library".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "test-3".to_string(),
                text: "Mocked APIs with MSW (if used)".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "test-4".to_string(),
                text: "Tested edge cases (loading, error, empty states)".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "test-5".to_string(),
                text: "Tests don't depend on unstable UI".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "test-6".to_string(),
                text: "Followed \"AAA pattern\" (Arrange, Act, Assert)".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
        ],
        code_examples: None,
        examples: None,
        code_example: Some(
            r#"describe('PatientCard', () => {
  it('should render patient name', () => {
    // Arrange
    const mockPatient = { id: '1', name: 'John Doe', status: 'active' };
    render(<PatientCard patient={mockPatient} onSelect={jest.fn()} />);
    
    // Act & Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});"#
                .to_string(),
        ),
    }
}

/// Code review section
pub fn review_section() -> ChecklistSection {
    ChecklistSection {
        id: "review".to_string(),
        title: "💎 Code Review Standards".to_string(),
        items: vec![
            ChecklistItem {
                id: "rev-1".to_string(),
                text: "Checked naming, lint, formatting".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "rev-2".to_string(),
                text: "Removed unused imports/console logs".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "rev-3".to_string(),
                text: "No inline styles or hardcoded text unless necessary".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "rev-4".to_string(),
                text: "Code reads like a story — clean, logical flow".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "rev-5".to_string(),
                text: "Commit messages are clear and meaningful".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
        ],
        code_examples: None,
        examples: Some(Examples {
            good: vec![
                "feat: add patient status filter to dashboard".to_string(),
                "fix: resolve infinite loop in appointment query".to_string(),
                "refactor: extract patient card component".to_string(),
            ],
            bad: vec![
                "update".to_string(),
                "fix bug".to_string(),
                "changes".to_string(),
                "wip".to_string(),
            ],
        }),
        code_example: None,
    }
}

/// Tooling section
pub fn tooling_section() -> ChecklistSection {
    ChecklistSection {
        id: "tooling".to_string(),
        title: "🧰 Tooling / Quality".to_string(),
        items: vec![
            ChecklistItem {
                id: "tool-1".to_string(),
                text: "Ran lint + prettier before commit".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "tool-2".to_string(),
                text: "TypeScript strict typing used (unknown > any)".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "tool-3".to_string(),
                text: "Followed ESLint and Prettier rules".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "tool-4".to_string(),
                text: "Used environment variables for config (no hardcoded values)".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
        ],
        code_examples: None,
        examples: None,
        code_example: None,
    }
}

/// Documentation section
pub fn docs_section() -> ChecklistSection {
    ChecklistSection {
        id: "docs".to_string(),
        title: "🧭 Documentation".to_string(),
        items: vec![
            ChecklistItem {
                id: "doc-1".to_string(),
                text: "Added JSDoc/comments for complex logic".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "doc-2".to_string(),
                text: "Documented contracts, query keys, and props".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "doc-3".to_string(),
                text: "Updated Notion or internal wiki if relevant".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
        ],
        code_examples: None,
        examples: None,
        code_example: None,
    }
}

/// Developer mindset section
pub fn mindset_section() -> ChecklistSection {
    ChecklistSection {
        id: "mindset".to_string(),
        title: "🧑‍💻 Developer Mindset".to_string(),
        items: vec![
            ChecklistItem {
                id: "mind-1".to_string(),
                text: "Thought about scale and future use".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "mind-2".to_string(),
                text: "Didn't over-engineer".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "mind-3".to_string(),
                text: "Built consistent, predictable patterns".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
            ChecklistItem {
                id: "mind-4".to_string(),
                text: "Prioritized maintainability over cleverness".to_string(),
                is_checked: None,
                examples: None,
                code_examples: None,
                code_example: None,
            },
        ],
        code_examples: None,
        examples: None,
        code_example: None,
    }
}
