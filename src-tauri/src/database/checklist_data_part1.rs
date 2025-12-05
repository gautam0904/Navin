use crate::models::*;

/// Branch naming section
pub fn branch_section() -> ChecklistSection {
    ChecklistSection {
        id: "branch".to_string(),
        title: "🏷️ Branch Naming".to_string(),
        items: vec![
            ChecklistItem {
                id: "branch-1".to_string(),
                text: "Format: feature/<notionId>-<short-title> or bug/<notionId>-<short-title>"
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
    }
}

/// API / Contract handling section
pub fn api_section() -> ChecklistSection {
    ChecklistSection {
        id: "api".to_string(),
        title: "🧱 API / Contract Handling".to_string(),
        items: vec![
            ChecklistItem {
                id: "api-1".to_string(),
                text: "Created contract (mock API or TypeScript interface) if backend not ready"
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
    }
}

/// Code quality section
pub fn code_section() -> ChecklistSection {
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
    }
}

/// Performance section
pub fn performance_section() -> ChecklistSection {
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
    }
}

/// Stability section
pub fn stability_section() -> ChecklistSection {
    ChecklistSection {
        id: "stability".to_string(),
        title: "🔒 Stability / Compatibility".to_string(),
        items: vec![
            ChecklistItem {
                id: "stab-1".to_string(),
                text: "Existing features not broken — tested related pages/components".to_string(),
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
    }
}
