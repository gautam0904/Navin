import React from 'react';
import { CodeExamples } from '../../../types/checklist';
import { EditableCodeExampleSection } from './EditableCodeExampleSection';

interface EditableCodeExamplesProps {
  codeExamples: CodeExamples;
  onCodeExamplesChange: (codeExamples: CodeExamples) => void;
  onSave: () => void;
}

export const EditableCodeExamples: React.FC<EditableCodeExamplesProps> = ({
  codeExamples,
  onCodeExamplesChange,
  onSave,
}) => {
  return (
    <>
      <EditableCodeExampleSection
        title="Good Code Examples"
        examples={codeExamples.good}
        onExamplesChange={(good) => onCodeExamplesChange({ ...codeExamples, good })}
        onSave={onSave}
        theme="good"
      />
      <EditableCodeExampleSection
        title="Bad Code Examples"
        examples={codeExamples.bad}
        onExamplesChange={(bad) => onCodeExamplesChange({ ...codeExamples, bad })}
        onSave={onSave}
        theme="bad"
      />
    </>
  );
};
