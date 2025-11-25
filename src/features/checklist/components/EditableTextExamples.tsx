import React, { useState } from 'react';
import { Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Examples } from '../../../types/checklist';

interface EditableTextExamplesProps {
  examples: Examples;
  type: 'good' | 'bad';
  onExamplesChange: (examples: Examples) => void;
  onSave: () => void;
}

export const EditableTextExamples: React.FC<EditableTextExamplesProps> = ({
  examples,
  type,
  onExamplesChange,
  onSave,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');

  const currentExamples = type === 'good' ? examples.good : examples.bad;
  const isGood = type === 'good';

  const handleAdd = () => {
    const newExamples = {
      ...examples,
      [type]: [...currentExamples, ''],
    };
    onExamplesChange(newExamples);
    setEditingIndex(currentExamples.length);
    setTempText('');
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempText(currentExamples[index] || '');
  };

  const handleSave = (index: number) => {
    const newList = [...currentExamples];
    newList[index] = tempText;
    onExamplesChange({
      ...examples,
      [type]: newList,
    });
    setEditingIndex(null);
    setTempText('');
    onSave();
  };

  const handleDelete = (index: number) => {
    const newList = currentExamples.filter((_, i) => i !== index);
    onExamplesChange({
      ...examples,
      [type]: newList,
    });
    onSave();
  };

  const colors = isGood
    ? {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-300',
        iconBg: 'bg-green-100',
        iconBorder: 'border-green-200',
        iconColor: 'text-green-600',
        title: 'text-green-800',
        btn: 'bg-green-600 hover:bg-green-700',
        inputBorder: 'border-green-300',
        inputText: 'text-green-700',
        inputFocus: 'focus:ring-green-500',
        itemBg: 'bg-white/60',
        itemBorder: 'border-green-200',
        itemText: 'text-green-700',
        hover: 'hover:bg-green-100',
      }
    : {
        bg: 'from-red-50 to-pink-50',
        border: 'border-red-300',
        iconBg: 'bg-red-100',
        iconBorder: 'border-red-200',
        iconColor: 'text-red-600',
        title: 'text-red-800',
        btn: 'bg-red-600 hover:bg-red-700',
        inputBorder: 'border-red-300',
        inputText: 'text-red-700',
        inputFocus: 'focus:ring-red-500',
        itemBg: 'bg-white/60',
        itemBorder: 'border-red-200',
        itemText: 'text-red-700',
        hover: 'hover:bg-red-100',
      };

  const Icon = isGood ? Check : X;

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-5 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colors.iconBg} rounded-xl border ${colors.iconBorder}`}>
            <Icon size={20} className={colors.iconColor} />
          </div>
          <h4 className={`font-bold ${colors.title} text-lg`}>
            {isGood ? 'Good' : 'Bad'} Examples (Text)
          </h4>
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-3 py-1.5 ${colors.btn} text-white rounded-lg transition-colors text-sm font-semibold`}
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {currentExamples.map((ex, i) => (
          <div key={i} className="flex items-center gap-2">
            {editingIndex === i ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(i);
                    if (e.key === 'Escape') {
                      setEditingIndex(null);
                      setTempText('');
                    }
                  }}
                  className={`flex-1 px-3 py-2 bg-white border ${colors.inputBorder} rounded-lg ${colors.inputText} focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  autoFocus
                />
                <button
                  onClick={() => handleSave(i)}
                  className={`p-2 ${colors.btn} text-white rounded-lg transition-colors`}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setTempText('');
                  }}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`flex-1 font-mono text-sm ${colors.itemText} ${colors.itemBg} px-3 py-2 rounded-lg border ${colors.itemBorder}`}
                >
                  {ex}
                </div>
                <button
                  onClick={() => handleEdit(i)}
                  className={`p-2 ${colors.hover} rounded-lg transition-colors`}
                >
                  <Edit2 size={16} className={colors.iconColor} />
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </>
            )}
          </div>
        ))}
        {currentExamples.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No {isGood ? 'good' : 'bad'} examples yet. Click &quot;Add&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
};
