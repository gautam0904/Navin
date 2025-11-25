import React from 'react';
import { Examples, CodeExamples } from '../../../types/checklist';
import { EditableTextExamples } from './EditableTextExamples';
import { EditableCodeExamples } from './EditableCodeExamples';
import { LegacyCodeEditor } from './LegacyCodeEditor';

interface EditableExamplesProps {
  examples?: Examples;
  codeExamples?: CodeExamples;
  // Legacy support
  codeExample?: string;
  onExamplesChange: (examples: Examples) => void;
  onCodeExamplesChange: (codeExamples: CodeExamples) => void;
  // Legacy support
  onCodeExampleChange?: (codeExample: string) => void;
  onSave: () => void;
}

export const EditableExamples: React.FC<EditableExamplesProps> = ({
  examples,
  codeExamples,
  codeExample: legacyCodeExample,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onSave,
}) => {
  const currentExamples = examples || { good: [], bad: [] };
  const currentCodeExamples = codeExamples || { good: [], bad: [] };

  return (
    <div className="space-y-5">
      <EditableTextExamples
        examples={currentExamples}
        onExamplesChange={onExamplesChange}
        onSave={onSave}
      />

      <EditableCodeExamples
        codeExamples={currentCodeExamples}
        onCodeExamplesChange={onCodeExamplesChange}
        onSave={onSave}
      />

      {legacyCodeExample && onCodeExampleChange && (
        <LegacyCodeEditor
          codeExample={legacyCodeExample}
          onCodeExampleChange={onCodeExampleChange}
          onSave={onSave}
        />
      )}
    </div>
  );
};
