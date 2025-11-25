import React from 'react';
import { CodeExamples } from '../../../types/checklist';
import { EditableGoodCodeExamples } from './EditableGoodCodeExamples';
import { EditableBadCodeExamples } from './EditableBadCodeExamples';

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
      <EditableGoodCodeExamples
        examples={codeExamples.good}
        onExamplesChange={(good) => onCodeExamplesChange({ ...codeExamples, good })}
        onSave={onSave}
      />
      <EditableBadCodeExamples
        examples={codeExamples.bad}
        onExamplesChange={(bad) => onCodeExamplesChange({ ...codeExamples, bad })}
        onSave={onSave}
      />
    </>
  );
};
