import React, { useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { Examples, CodeExamples } from '../../../types/checklist';
import { CodeEditor } from './CodeEditor';
import { EditableTextExamples } from './EditableTextExamples';
import { EditableCodeExamples } from './EditableCodeExamples';

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
  const [editingLegacyCode, setEditingLegacyCode] = useState(false);

  const currentExamples = examples || { good: [], bad: [] };
  const currentCodeExamples = codeExamples || { good: [], bad: [] };

  const handleLegacyCodeExampleSave = () => {
    if (onCodeExampleChange) {
      onCodeExampleChange(legacyCodeExample || '');
      setEditingLegacyCode(false);
      onSave();
    }
  };

  return (
    <div className="space-y-5">
      <EditableTextExamples
        examples={currentExamples}
        type="good"
        onExamplesChange={onExamplesChange}
        onSave={onSave}
      />
      <EditableTextExamples
        examples={currentExamples}
        type="bad"
        onExamplesChange={onExamplesChange}
        onSave={onSave}
      />
      <EditableCodeExamples
        codeExamples={currentCodeExamples}
        type="good"
        onCodeExamplesChange={onCodeExamplesChange}
        onSave={onSave}
      />
      <EditableCodeExamples
        codeExamples={currentCodeExamples}
        type="bad"
        onCodeExamplesChange={onCodeExamplesChange}
        onSave={onSave}
      />
      {legacyCodeExample && onCodeExampleChange && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-lg">Code Example (Legacy)</h4>
            <div className="flex gap-2">
              {!editingLegacyCode && (
                <button
                  onClick={() => setEditingLegacyCode(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              )}
              {editingLegacyCode && (
                <button
                  onClick={() => setEditingLegacyCode(false)}
                  className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          {editingLegacyCode ? (
            <div>
              <CodeEditor
                value={legacyCodeExample}
                onChange={(value) => {
                  if (value !== undefined && onCodeExampleChange) {
                    onCodeExampleChange(value);
                  }
                }}
                language="typescript"
                height="300px"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleLegacyCodeExampleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <Save size={16} />
                  Save Code Example
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-100 leading-relaxed whitespace-pre-wrap">
                {legacyCodeExample}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
