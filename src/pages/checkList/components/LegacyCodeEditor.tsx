import React, { useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface LegacyCodeEditorProps {
  codeExample: string;
  onCodeExampleChange: (codeExample: string) => void;
  onSave: () => void;
}

export const LegacyCodeEditor: React.FC<LegacyCodeEditorProps> = ({
  codeExample,
  onCodeExampleChange,
  onSave,
}) => {
  const [editingLegacyCode, setEditingLegacyCode] = useState(false);
  const [currentCode, setCurrentCode] = useState(codeExample);

  const handleSave = () => {
    onCodeExampleChange(currentCode);
    setEditingLegacyCode(false);
    onSave();
  };

  const handleCancel = () => {
    setCurrentCode(codeExample);
    setEditingLegacyCode(false);
  };

  return (
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
              onClick={handleCancel}
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
            value={currentCode}
            onChange={(value) => {
              if (value !== undefined) {
                setCurrentCode(value);
              }
            }}
            language="typescript"
            height="300px"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSave}
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
            {codeExample}
          </pre>
        </div>
      )}
    </div>
  );
};
