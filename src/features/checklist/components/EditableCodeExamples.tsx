import React, { useState } from 'react';
import { Code2, Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { CodeExamples, CodeExample, LANGUAGES } from '../../../types/checklist';
import { CodeEditor } from './CodeEditor';

interface EditableCodeExamplesProps {
  codeExamples: CodeExamples;
  type: 'good' | 'bad';
  onCodeExamplesChange: (codeExamples: CodeExamples) => void;
  onSave: () => void;
}

export const EditableCodeExamples: React.FC<EditableCodeExamplesProps> = ({
  codeExamples,
  type,
  onCodeExamplesChange,
  onSave,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempCode, setTempCode] = useState<CodeExample>({ language: 'typescript', code: '' });

  const currentExamples = type === 'good' ? codeExamples.good : codeExamples.bad;
  const isGood = type === 'good';

  const handleAdd = () => {
    const newCodeExamples = {
      ...codeExamples,
      [type]: [...currentExamples, { language: 'typescript', code: '' }],
    };
    onCodeExamplesChange(newCodeExamples);
    setEditingIndex(currentExamples.length);
    setTempCode({ language: 'typescript', code: '' });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempCode(currentExamples[index] || { language: 'typescript', code: '' });
  };

  const handleSave = (index: number) => {
    const newList = [...currentExamples];
    newList[index] = tempCode;
    onCodeExamplesChange({
      ...codeExamples,
      [type]: newList,
    });
    setEditingIndex(null);
    setTempCode({ language: 'typescript', code: '' });
    onSave();
  };

  const handleDelete = (index: number) => {
    const newList = currentExamples.filter((_, i) => i !== index);
    onCodeExamplesChange({
      ...codeExamples,
      [type]: newList,
    });
    onSave();
  };

  const colors = isGood
    ? {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-300',
        iconBg: 'bg-blue-100',
        iconBorder: 'border-blue-200',
        iconColor: 'text-blue-600',
        title: 'text-blue-800',
        btn: 'bg-blue-600 hover:bg-blue-700',
        itemBorder: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        hover: 'hover:bg-blue-50',
      }
    : {
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-300',
        iconBg: 'bg-orange-100',
        iconBorder: 'border-orange-200',
        iconColor: 'text-orange-600',
        title: 'text-orange-800',
        btn: 'bg-orange-600 hover:bg-orange-700',
        itemBorder: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-700',
        hover: 'hover:bg-orange-50',
      };

  return (
    <div
      className={`bg-linear-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-5 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colors.iconBg} rounded-xl border ${colors.iconBorder} relative`}>
            <Code2 size={20} className={colors.iconColor} />
            {isGood && (
              <Check
                size={16}
                className="text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5"
              />
            )}
            {!isGood && (
              <X
                size={16}
                className="text-red-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5"
              />
            )}
          </div>
          <h4 className={`font-bold ${colors.title} text-lg`}>
            {isGood ? 'Good' : 'Bad'} Code Examples
          </h4>
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-3 py-1.5 ${colors.btn} text-white rounded-lg transition-colors text-sm font-semibold`}
        >
          <Plus size={16} />
          Add Code
        </button>
      </div>
      <div className="space-y-3">
        {currentExamples.map((codeEx, i) => (
          <div key={i} className={`bg-white rounded-lg p-3 border ${colors.itemBorder}`}>
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
                  <span className={`px-2 py-1 ${colors.badge} rounded text-xs font-semibold`}>
                    {codeEx.language.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className={`p-1.5 ${colors.hover} rounded transition-colors`}
                    >
                      <Edit2 size={14} className={colors.iconColor} />
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
        {currentExamples.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No {isGood ? 'good' : 'bad'} code examples yet. Click &quot;Add Code&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
};
