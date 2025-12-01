use crate::models::*;
use crate::repositories::ChecklistRepository;
use rusqlite::{Connection, Result};

/// Seed the database with default checklist data
pub fn seed_default_data(conn: &mut Connection) -> Result<()> {
    // Check if default project data already exists
    let default_project_id = "default-project";
    let count: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM checklist_sections WHERE project_id = ?1",
            rusqlite::params![default_project_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if count > 0 {
        println!("👉 Default project data already seeded, skipping...");
        return Ok(());
    }

    println!("👉 Seeding database with default checklist data...");

    // Ensure default project exists
    let project_exists: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM projects WHERE id = ?1",
            rusqlite::params![default_project_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if project_exists == 0 {
        conn.execute(
            "INSERT INTO projects (id, name, is_default, created_at, updated_at) 
             VALUES (?1, 'Default Project', 1, datetime('now'), datetime('now'))",
            rusqlite::params![default_project_id],
        )?;
    }

    let default_sections = get_default_checklist_data();

    for (idx, section) in default_sections.iter().enumerate() {
        ChecklistRepository::insert_section(conn, section, default_project_id, idx as i32)?;
    }

    println!("✅ Successfully seeded {} sections", default_sections.len());
    Ok(())
}

/// Get the default checklist data (hardcoded)
pub fn get_default_checklist_data() -> Vec<ChecklistSection> {
    vec![
        ChecklistSection {
            id: "branch".to_string(),
            title: "🏷️ Branch Naming".to_string(),
            items: vec![
                ChecklistItem {
                    id: "branch-1".to_string(),
                    text:
                        "Format: feature/<notionId>-<short-title> or bug/<notionId>-<short-title>"
                            .to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "branch-2".to_string(),
                    text: "No spaces or underscores".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "branch-3".to_string(),
                    text: "Concise and descriptive".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
            ],
            code_examples: None,
            examples: Some(Examples {
                good: vec![
                    "feature/1234-outreach-status-card".to_string(),
                    "bug/5678-fix-patient-filter".to_string(),
                    "feature/9012-add-export-button".to_string(),
                ],
                bad: vec![
                    "feature_new_card (no notion ID, uses underscore)".to_string(),
                    "fix bug (no structure, spaces)".to_string(),
                    "feature/add new feature (spaces, not descriptive)".to_string(),
                ],
            }),
            code_example: None,
        },
        ChecklistSection {
            id: "api".to_string(),
            title: "🧱 API / Contract Handling".to_string(),
            items: vec![
                ChecklistItem {
                    id: "api-1".to_string(),
                    text:
                        "Created contract (mock API or TypeScript interface) if backend not ready"
                            .to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "api-2".to_string(),
                    text: "Node mock API serves contract data locally".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "api-3".to_string(),
                    text: "Data structure matches backend expectations".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "api-4".to_string(),
                    text: "Contracts stored in /contracts or /mocks folder".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "api-5".to_string(),
                    text: "Minimal refactoring needed when backend is ready".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
            ],
            code_examples: None,
            examples: None,
            code_example: Some(
                r#"// contracts/patient.contract.ts
export interface PatientResponse {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastVisit: string;
}

export const mockPatientData: PatientResponse[] = [
  {
    id: '1',
    name: 'John Doe',
    status: 'active',
    lastVisit: '2024-01-15'
  }
];"#
                .to_string(),
            ),
        },
        ChecklistSection {
            id: "code".to_string(),
            title: "⚙️ Code Quality & Architecture".to_string(),
            items: vec![
                ChecklistItem {
                    id: "code-1".to_string(),
                    text: "Components are small, focused, and reusable".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "code-2".to_string(),
                    text: "React Query best practices followed (query keys, loading/error states)"
                        .to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "code-3".to_string(),
                    text: "Code is readable: meaningful names, short functions".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "code-4".to_string(),
                    text: "No code duplication — reused hooks/components/utilities".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "code-5".to_string(),
                    text: "Components are pure and stateless where possible".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "code-6".to_string(),
                    text: "Avoided unnecessary re-renders (memo, useCallback, useMemo)".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
            ],
            code_examples: None,
            examples: None,
            code_example: Some(
                r#"// Good: Small, focused, single responsibility
interface PatientCardProps {
  patient: Patient;
  onSelect: (id: string) => void;
}

export const PatientCard = ({ patient, onSelect }: PatientCardProps) => {
  return (
    <div className="patient-card" onClick={() => onSelect(patient.id)}>
      <h3>{patient.name}</h3>
      <StatusBadge status={patient.status} />
    </div>
  );
};"#
                .to_string(),
            ),
        },
        ChecklistSection {
            id: "performance".to_string(),
            title: "🧠 Performance & Optimization".to_string(),
            items: vec![
                ChecklistItem {
                    id: "perf-1".to_string(),
                    text: "Heavy components lazy loaded".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "perf-2".to_string(),
                    text: "Unnecessary API calls avoided (React Query caching used)".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "perf-3".to_string(),
                    text: "Large lists optimized (virtualization if needed)".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "perf-4".to_string(),
                    text: "Logic split into custom hooks for clarity and reuse".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
            ],
            code_examples: None,
            examples: None,
            code_example: Some(
                r#"// Good: Lazy load heavy components
import { lazy, Suspense } from 'react';

const PatientChart = lazy(() => import('./PatientChart'));

export const Dashboard = () => (
  <Suspense fallback={<ChartSkeleton />}>
    <PatientChart />
  </Suspense>
);"#
                .to_string(),
            ),
        },
        ChecklistSection {
            id: "stability".to_string(),
            title: "🔒 Stability / Compatibility".to_string(),
            items: vec![
                ChecklistItem {
                    id: "stab-1".to_string(),
                    text: "Existing features not broken — tested related pages/components"
                        .to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "stab-2".to_string(),
                    text: "Followed existing code conventions and naming patterns".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
                ChecklistItem {
                    id: "stab-3".to_string(),
                    text: "Maintained consistent folder structure and imports".to_string(),
                    is_checked: None,
                    examples: None,
                    code_examples: None,
                    code_example: None,
                },
            ],
            code_examples: None,
            examples: None,
            code_example: None,
        },
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
        },
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
        },
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
        },
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
        },
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
        },
    ]
}
