import React, { useState } from 'react';
import { Check, X, Plus, Trash2, Edit2, Save, Code2 } from 'lucide-react';
import { Examples, CodeExamples, CodeExample, LANGUAGES } from '../types/checklist';
import { CodeEditor } from './CodeEditor';

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
  const [editingGoodIndex, setEditingGoodIndex] = useState<number | null>(null);
  const [editingBadIndex, setEditingBadIndex] = useState<number | null>(null);
  const [editingGoodCodeIndex, setEditingGoodCodeIndex] = useState<number | null>(null);
  const [editingBadCodeIndex, setEditingBadCodeIndex] = useState<number | null>(null);
  const [editingLegacyCode, setEditingLegacyCode] = useState(false);
  
  const [tempGoodText, setTempGoodText] = useState('');
  const [tempBadText, setTempBadText] = useState('');
  const [tempGoodCode, setTempGoodCode] = useState<CodeExample>({ language: 'typescript', code: '' });
  const [tempBadCode, setTempBadCode] = useState<CodeExample>({ language: 'typescript', code: '' });

  const currentExamples = examples || { good: [], bad: [] };
  const currentCodeExamples = codeExamples || { good: [], bad: [] };

  // Text Examples Handlers
  const handleAddGood = () => {
    const newExamples = {
      ...currentExamples,
      good: [...currentExamples.good, ''],
    };
    onExamplesChange(newExamples);
    setEditingGoodIndex(currentExamples.good.length);
    setTempGoodText('');
  };

  const handleAddBad = () => {
    const newExamples = {
      ...currentExamples,
      bad: [...currentExamples.bad, ''],
    };
    onExamplesChange(newExamples);
    setEditingBadIndex(currentExamples.bad.length);
    setTempBadText('');
  };

  const handleEditGood = (index: number) => {
    setEditingGoodIndex(index);
    setTempGoodText(currentExamples.good[index] || '');
  };

  const handleEditBad = (index: number) => {
    setEditingBadIndex(index);
    setTempBadText(currentExamples.bad[index] || '');
  };

  const handleSaveGood = (index: number) => {
    const newGood = [...currentExamples.good];
    newGood[index] = tempGoodText;
    onExamplesChange({
      ...currentExamples,
      good: newGood,
    });
    setEditingGoodIndex(null);
    setTempGoodText('');
    onSave();
  };

  const handleSaveBad = (index: number) => {
    const newBad = [...currentExamples.bad];
    newBad[index] = tempBadText;
    onExamplesChange({
      ...currentExamples,
      bad: newBad,
    });
    setEditingBadIndex(null);
    setTempBadText('');
    onSave();
  };

  const handleDeleteGood = (index: number) => {
    const newGood = currentExamples.good.filter((_, i) => i !== index);
    onExamplesChange({
      ...currentExamples,
      good: newGood,
    });
    onSave();
  };

  const handleDeleteBad = (index: number) => {
    const newBad = currentExamples.bad.filter((_, i) => i !== index);
    onExamplesChange({
      ...currentExamples,
      bad: newBad,
    });
    onSave();
  };

  // Code Examples Handlers
  const handleAddGoodCode = () => {
    const newCodeExamples = {
      ...currentCodeExamples,
      good: [...currentCodeExamples.good, { language: 'typescript', code: '' }],
    };
    onCodeExamplesChange(newCodeExamples);
    setEditingGoodCodeIndex(currentCodeExamples.good.length);
    setTempGoodCode({ language: 'typescript', code: '' });
  };

  const handleAddBadCode = () => {
    const newCodeExamples = {
      ...currentCodeExamples,
      bad: [...currentCodeExamples.bad, { language: 'typescript', code: '' }],
    };
    onCodeExamplesChange(newCodeExamples);
    setEditingBadCodeIndex(currentCodeExamples.bad.length);
    setTempBadCode({ language: 'typescript', code: '' });
  };

  const handleEditGoodCode = (index: number) => {
    setEditingGoodCodeIndex(index);
    setTempGoodCode(currentCodeExamples.good[index] || { language: 'typescript', code: '' });
  };

  const handleEditBadCode = (index: number) => {
    setEditingBadCodeIndex(index);
    setTempBadCode(currentCodeExamples.bad[index] || { language: 'typescript', code: '' });
  };

  const handleSaveGoodCode = (index: number) => {
    const newGood = [...currentCodeExamples.good];
    newGood[index] = tempGoodCode;
    onCodeExamplesChange({
      ...currentCodeExamples,
      good: newGood,
    });
    setEditingGoodCodeIndex(null);
    setTempGoodCode({ language: 'typescript', code: '' });
    onSave();
  };

  const handleSaveBadCode = (index: number) => {
    const newBad = [...currentCodeExamples.bad];
    newBad[index] = tempBadCode;
    onCodeExamplesChange({
      ...currentCodeExamples,
      bad: newBad,
    });
    setEditingBadCodeIndex(null);
    setTempBadCode({ language: 'typescript', code: '' });
    onSave();
  };

  const handleDeleteGoodCode = (index: number) => {
    const newGood = currentCodeExamples.good.filter((_, i) => i !== index);
    onCodeExamplesChange({
      ...currentCodeExamples,
      good: newGood,
    });
    onSave();
  };

  const handleDeleteBadCode = (index: number) => {
    const newBad = currentCodeExamples.bad.filter((_, i) => i !== index);
    onCodeExamplesChange({
      ...currentCodeExamples,
      bad: newBad,
    });
    onSave();
  };

  // Legacy code example handler
  const handleLegacyCodeExampleSave = () => {
    if (onCodeExampleChange) {
      onCodeExampleChange(legacyCodeExample || '');
      setEditingLegacyCode(false);
      onSave();
    }
  };

  return (
    <div className="space-y-5">
      {/* Text Examples - Good */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl border border-green-200">
              <Check size={20} className="text-green-600" />
            </div>
            <h4 className="font-bold text-green-800 text-lg">Good Examples (Text)</h4>
          </div>
          <button
            onClick={handleAddGood}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {currentExamples.good.map((ex, i) => (
            <div key={i} className="flex items-center gap-2">
              {editingGoodIndex === i ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={tempGoodText}
                    onChange={(e) => setTempGoodText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveGood(i);
                      if (e.key === 'Escape') {
                        setEditingGoodIndex(null);
                        setTempGoodText('');
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveGood(i)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingGoodIndex(null);
                      setTempGoodText('');
                    }}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 font-mono text-sm text-green-700 bg-white/60 px-3 py-2 rounded-lg border border-green-200">
                    {ex}
                  </div>
                  <button
                    onClick={() => handleEditGood(i)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteGood(i)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </>
              )}
            </div>
          ))}
          {currentExamples.good.length === 0 && (
            <p className="text-sm text-gray-500 italic">No good examples yet. Click "Add" to add one.</p>
          )}
        </div>
      </div>

      {/* Text Examples - Bad */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl border border-red-200">
              <X size={20} className="text-red-600" />
            </div>
            <h4 className="font-bold text-red-800 text-lg">Bad Examples (Text)</h4>
          </div>
          <button
            onClick={handleAddBad}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {currentExamples.bad.map((ex, i) => (
            <div key={i} className="flex items-center gap-2">
              {editingBadIndex === i ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={tempBadText}
                    onChange={(e) => setTempBadText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveBad(i);
                      if (e.key === 'Escape') {
                        setEditingBadIndex(null);
                        setTempBadText('');
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-red-300 rounded-lg text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveBad(i)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingBadIndex(null);
                      setTempBadText('');
                    }}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 font-mono text-sm text-red-700 bg-white/60 px-3 py-2 rounded-lg border border-red-200">
                    {ex}
                  </div>
                  <button
                    onClick={() => handleEditBad(i)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-red-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteBad(i)}
                    className="p-2 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </>
              )}
            </div>
          ))}
          {currentExamples.bad.length === 0 && (
            <p className="text-sm text-gray-500 italic">No bad examples yet. Click "Add" to add one.</p>
          )}
        </div>
      </div>

      {/* Code Examples - Good */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl border border-blue-200">
              <Code2 size={20} className="text-blue-600" />
              <Check size={16} className="text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
            <h4 className="font-bold text-blue-800 text-lg">Good Code Examples</h4>
          </div>
          <button
            onClick={handleAddGoodCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            Add Code
          </button>
        </div>
        <div className="space-y-3">
          {currentCodeExamples.good.map((codeEx, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-blue-200">
              {editingGoodCodeIndex === i ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Language:</label>
                    <select
                      value={tempGoodCode.language}
                      onChange={(e) => setTempGoodCode({ ...tempGoodCode, language: e.target.value })}
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
                    value={tempGoodCode.code}
                    onChange={(value) => {
                      if (value !== undefined) {
                        setTempGoodCode({ ...tempGoodCode, code: value });
                      }
                    }}
                    language={tempGoodCode.language}
                    height="250px"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveGoodCode(i)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingGoodCodeIndex(null);
                        setTempGoodCode({ language: 'typescript', code: '' });
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
                        onClick={() => handleEditGoodCode(i)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={14} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoodCode(i)}
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
          {currentCodeExamples.good.length === 0 && (
            <p className="text-sm text-gray-500 italic">No good code examples yet. Click "Add Code" to add one.</p>
          )}
        </div>
      </div>

      {/* Code Examples - Bad */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl border border-orange-200 relative">
              <Code2 size={20} className="text-orange-600" />
              <X size={16} className="text-red-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
            <h4 className="font-bold text-orange-800 text-lg">Bad Code Examples</h4>
          </div>
          <button
            onClick={handleAddBadCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            Add Code
          </button>
        </div>
        <div className="space-y-3">
          {currentCodeExamples.bad.map((codeEx, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200">
              {editingBadCodeIndex === i ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Language:</label>
                    <select
                      value={tempBadCode.language}
                      onChange={(e) => setTempBadCode({ ...tempBadCode, language: e.target.value })}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <CodeEditor
                    value={tempBadCode.code}
                    onChange={(value) => {
                      if (value !== undefined) {
                        setTempBadCode({ ...tempBadCode, code: value });
                      }
                    }}
                    language={tempBadCode.language}
                    height="250px"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveBadCode(i)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBadCodeIndex(null);
                        setTempBadCode({ language: 'typescript', code: '' });
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
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                      {codeEx.language.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBadCode(i)}
                        className="p-1.5 hover:bg-orange-50 rounded transition-colors"
                      >
                        <Edit2 size={14} className="text-orange-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteBadCode(i)}
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
          {currentCodeExamples.bad.length === 0 && (
            <p className="text-sm text-gray-500 italic">No bad code examples yet. Click "Add Code" to add one.</p>
          )}
        </div>
      </div>

      {/* Legacy Single Code Example Support */}
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
                  onClick={() => {
                    setEditingLegacyCode(false);
                  }}
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
