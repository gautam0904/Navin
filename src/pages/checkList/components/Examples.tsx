import React from 'react';
import { ChecklistSection, CodeExamples } from '../../../types/checklist';
import { EditableExamples } from './EditableExamples';
import { TextExamplesDisplay } from './TextExamplesDisplay';
import { CodeExamplesDisplay } from './CodeExamplesDisplay';
import { ExamplesToggleButton } from './ExamplesToggleButton';
import { LegacyCodeExampleDisplay } from '@/features/checklist/components/LegacyCodeExampleDisplay';

interface ExamplesProps {
  section: ChecklistSection;
  isExpanded: boolean;
  isAdminMode?: boolean;
  onToggle: () => void;
  onExamplesChange?: (examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (codeExamples: CodeExamples) => void;
  onCodeExampleChange?: (codeExample: string) => void;
  onSave?: () => void;
}

const hasExamples = (section: ChecklistSection): boolean => {
  const hasTextExamples =
    section.examples && (section.examples.good.length > 0 || section.examples.bad.length > 0);
  const hasCodeExamples =
    section.codeExamples &&
    (section.codeExamples.good.length > 0 || section.codeExamples.bad.length > 0);
  const hasLegacyCode = !!section.codeExample;
  return hasTextExamples || hasCodeExamples || hasLegacyCode;
};

const AdminExamplesView: React.FC<{
  isExpanded: boolean;
  onToggle: () => void;
  section: ChecklistSection;
  onExamplesChange?: (examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (codeExamples: CodeExamples) => void;
  onCodeExampleChange?: (codeExample: string) => void;
  onSave?: () => void;
}> = ({
  isExpanded,
  onToggle,
  section,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onSave,
}) => {
  return (
    <div className="pt-4 border-t-2 border-gray-200">
      <ExamplesToggleButton isExpanded={isExpanded} onToggle={onToggle} />

      {isExpanded && onExamplesChange && onSave && (
        <div className="mt-5">
          <EditableExamples
            examples={section.examples}
            codeExamples={section.codeExamples}
            codeExample={section.codeExample}
            onExamplesChange={onExamplesChange}
            onCodeExamplesChange={onCodeExamplesChange || (() => {})}
            onCodeExampleChange={onCodeExampleChange}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  );
};

const ViewExamplesContent: React.FC<{ section: ChecklistSection }> = ({ section }) => {
  return (
    <div className="mt-5 space-y-5 animate-fade-in">
      {section.examples && <TextExamplesDisplay examples={section.examples} />}

      {section.codeExamples && <CodeExamplesDisplay codeExamples={section.codeExamples} />}

      {section.codeExample && <LegacyCodeExampleDisplay codeExample={section.codeExample} />}
    </div>
  );
};

export const Examples: React.FC<ExamplesProps> = ({
  section,
  isExpanded,
  isAdminMode = false,
  onToggle,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onSave,
}) => {
  if (!section.examples && !section.codeExample && !isAdminMode) return null;

  if (isAdminMode) {
    return (
      <AdminExamplesView
        isExpanded={isExpanded}
        onToggle={onToggle}
        section={section}
        onExamplesChange={onExamplesChange}
        onCodeExamplesChange={onCodeExamplesChange}
        onCodeExampleChange={onCodeExampleChange}
        onSave={onSave}
      />
    );
  }

  if (!hasExamples(section)) return null;

  return (
    <div className="pt-4 border-t-2 border-border-medium dark:border-border-light">
      <ExamplesToggleButton isExpanded={isExpanded} onToggle={onToggle} />
      {isExpanded && <ViewExamplesContent section={section} />}
    </div>
  );
};
