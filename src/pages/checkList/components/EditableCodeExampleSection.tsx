import { useState } from 'react';
import { Code2, Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { CodeExample, LANGUAGES } from '../../../types/checklist';
import { CodeEditor } from './CodeEditor';

interface EditableCodeExampleSectionProps {
  title: string;
  examples: CodeExample[];
  onExamplesChange: (examples: CodeExample[]) => void;
  onSave: () => void;
  theme: 'good' | 'bad';
}

function getThemeStyles(theme: 'good' | 'bad') {
  const isGood = theme === 'good';
  return {
    bgGradient: isGood
      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300'
      : 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300',
    iconBg: isGood ? 'bg-blue-100 border-blue-200' : 'bg-orange-100 border-orange-200',
    titleColor: isGood ? 'text-blue-800' : 'text-orange-800',
    buttonBg: isGood ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700',
    badgeBg: isGood ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700',
    editHover: isGood ? 'hover:bg-blue-50' : 'hover:bg-orange-50',
    editColor: isGood ? 'text-blue-600' : 'text-orange-600',
    borderColor: isGood ? 'border-blue-200' : 'border-orange-200',
    focusRing: isGood ? 'focus:ring-blue-500' : 'focus:ring-orange-500',
    isGood,
  };
}

interface CodeExampleEditorProps {
  code: CodeExample;
  onSave: (code: CodeExample) => void;
  onCancel: () => void;
  focusRing: string;
}

function CodeExampleEditor({ code, onSave, onCancel, focusRing }: CodeExampleEditorProps) {
  const [tempCode, setTempCode] = useState<CodeExample>(code);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Language:</label>
        <select
          value={tempCode.language}
          onChange={(e) => setTempCode({ ...tempCode, language: e.target.value })}
          className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${focusRing}`}
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
          onClick={() => onSave(tempCode)}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          <Save size={16} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface CodeExampleViewProps {
  code: CodeExample;
  onEdit: () => void;
  onDelete: () => void;
  badgeBg: string;
  editHover: string;
  editColor: string;
}

function CodeExampleView({
  code,
  onEdit,
  onDelete,
  badgeBg,
  editHover,
  editColor,
}: CodeExampleViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 ${badgeBg} rounded text-xs font-semibold`}>
          {code.language.toUpperCase()}
        </span>
        <div className="flex gap-2">
          <button onClick={onEdit} className={`p-1.5 ${editHover} rounded transition-colors`}>
            <Edit2 size={14} className={editColor} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>
      <div className="bg-gray-900 rounded p-3 overflow-x-auto">
        <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">{code.code}</pre>
      </div>
    </div>
  );
}

export function EditableCodeExampleSection({
  title,
  examples,
  onExamplesChange,
  onSave,
  theme,
}: EditableCodeExampleSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const styles = getThemeStyles(theme);

  const handleAdd = () => {
    const newExamples = [...examples, { language: 'typescript', code: '' }];
    onExamplesChange(newExamples);
    setEditingIndex(examples.length);
  };

  const handleSave = (index: number, code: CodeExample) => {
    const newExamples = [...examples];
    newExamples[index] = code;
    onExamplesChange(newExamples);
    setEditingIndex(null);
    onSave();
  };

  const handleDelete = (index: number) => {
    const newExamples = examples.filter((_, i) => i !== index);
    onExamplesChange(newExamples);
    onSave();
  };

  return (
    <div className={`${styles.bgGradient} rounded-2xl p-5 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${styles.iconBg} rounded-xl border relative`}>
            <Code2 size={20} className={styles.editColor} />
            {styles.isGood ? (
              <Check
                size={16}
                className="text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5"
              />
            ) : (
              <X
                size={16}
                className="text-red-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5"
              />
            )}
          </div>
          <h4 className={`font-bold ${styles.titleColor} text-lg`}>{title}</h4>
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-3 py-1.5 ${styles.buttonBg} text-white rounded-lg transition-colors text-sm font-semibold`}
        >
          <Plus size={16} />
          Add Code
        </button>
      </div>
      <div className="space-y-3">
        {examples.map((codeEx, i) => (
          <div key={i} className={`bg-white rounded-lg p-3 border ${styles.borderColor}`}>
            {editingIndex === i ? (
              <CodeExampleEditor
                code={codeEx}
                onSave={(code) => handleSave(i, code)}
                onCancel={() => setEditingIndex(null)}
                focusRing={styles.focusRing}
              />
            ) : (
              <CodeExampleView
                code={codeEx}
                onEdit={() => setEditingIndex(i)}
                onDelete={() => handleDelete(i)}
                badgeBg={styles.badgeBg}
                editHover={styles.editHover}
                editColor={styles.editColor}
              />
            )}
          </div>
        ))}
        {examples.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No {title.toLowerCase()} yet. Click &quot;Add Code&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
}
