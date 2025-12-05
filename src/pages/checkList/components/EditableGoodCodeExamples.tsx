import React, { useState } from 'react';
import { Code2, Check, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { CodeExample, LANGUAGES } from '../../../types/checklist';
import { CodeEditor } from './CodeEditor';

interface EditableGoodCodeExamplesProps {
  examples: Array<CodeExample>;
  onExamplesChange: (examples: Array<CodeExample>) => void;
  onSave: () => void;
}

export const EditableGoodCodeExamples: React.FC<EditableGoodCodeExamplesProps> = ({
  examples,
  onExamplesChange,
  onSave,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempCode, setTempCode] = useState<CodeExample>({
    language: 'typescript',
    code: '',
  });

  const handleAdd = () => {
    const newExamples = [...examples, { language: 'typescript', code: '' }];
    onExamplesChange(newExamples);
    setEditingIndex(examples.length);
    setTempCode({ language: 'typescript', code: '' });
  };

  const handleSave = (index: number) => {
    const newExamples = [...examples];
    newExamples[index] = tempCode;
    onExamplesChange(newExamples);
    setEditingIndex(null);
    setTempCode({ language: 'typescript', code: '' });
    onSave();
  };

  const handleDelete = (index: number) => {
    const newExamples = examples.filter((_, i) => i !== index);
    onExamplesChange(newExamples);
    onSave();
  };

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl border border-blue-200 relative">
            <Code2 size={20} className="text-blue-600" />
            <Check
              size={16}
              className="text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5"
            />
          </div>
          <h4 className="font-bold text-blue-800 text-lg">Good Code Examples</h4>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          Add Code
        </button>
      </div>
      <div className="space-y-3">
        {examples.map((codeEx, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-blue-200">
            {editingIndex === i ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Language:</label>
                  <select
                    value={tempCode.language}
                    onChange={(e) => setTempCode({ ...tempCode, language: e.target.value })}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <CodeEditor
                  value={tempCode.code}
                  onChange={(value) => {
                    if (value !== undefined) {
                      setTempCode({ ...tempCode, code: value });
                    }
                  }}
                  language={tempCode.language}
                  height="250px"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleSave(i)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setTempCode({ language: 'typescript', code: '' });
                    }}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {codeEx.language.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingIndex(i);
                        setTempCode(codeEx);
                      }}
                      className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={14} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                    {codeEx.code}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
        {examples.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No good code examples yet. Click &quot;Add Code&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
};
