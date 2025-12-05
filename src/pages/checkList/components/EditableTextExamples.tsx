import React, { useState } from 'react';
import { Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Examples } from '../../../types/checklist';

interface EditableTextExamplesProps {
  examples: Examples;
  onExamplesChange: (examples: Examples) => void;
  onSave: () => void;
}

export const EditableTextExamples: React.FC<EditableTextExamplesProps> = ({
  examples,
  onExamplesChange,
  onSave,
}) => {
  const [editingGoodIndex, setEditingGoodIndex] = useState<number | null>(null);
  const [editingBadIndex, setEditingBadIndex] = useState<number | null>(null);
  const [tempGoodText, setTempGoodText] = useState('');
  const [tempBadText, setTempBadText] = useState('');

  const handleAddGood = () => {
    const newExamples = {
      ...examples,
      good: [...examples.good, ''],
    };
    onExamplesChange(newExamples);
    setEditingGoodIndex(examples.good.length);
    setTempGoodText('');
  };

  const handleSaveGood = (index: number) => {
    const newGood = [...examples.good];
    newGood[index] = tempGoodText;
    onExamplesChange({
      ...examples,
      good: newGood,
    });
    setEditingGoodIndex(null);
    setTempGoodText('');
    onSave();
  };

  const handleDeleteGood = (index: number) => {
    const newGood = examples.good.filter((_, i) => i !== index);
    onExamplesChange({
      ...examples,
      good: newGood,
    });
    onSave();
  };

  const handleAddBad = () => {
    const newExamples = {
      ...examples,
      bad: [...examples.bad, ''],
    };
    onExamplesChange(newExamples);
    setEditingBadIndex(examples.bad.length);
    setTempBadText('');
  };

  const handleSaveBad = (index: number) => {
    const newBad = [...examples.bad];
    newBad[index] = tempBadText;
    onExamplesChange({
      ...examples,
      bad: newBad,
    });
    setEditingBadIndex(null);
    setTempBadText('');
    onSave();
  };

  const handleDeleteBad = (index: number) => {
    const newBad = examples.bad.filter((_, i) => i !== index);
    onExamplesChange({
      ...examples,
      bad: newBad,
    });
    onSave();
  };

  return (
    <>
      {/* Text Examples - Good */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 shadow-lg">
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
          {examples.good.map((ex, i) => (
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
                    onClick={() => {
                      setEditingGoodIndex(i);
                      setTempGoodText(ex);
                    }}
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
          {examples.good.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No good examples yet. Click &quot;Add&quot; to add one.
            </p>
          )}
        </div>
      </div>

      {/* Text Examples - Bad */}
      <div className="bg-linear-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg">
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
          {examples.bad.map((ex, i) => (
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
                    onClick={() => {
                      setEditingBadIndex(i);
                      setTempBadText(ex);
                    }}
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
          {examples.bad.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No bad examples yet. Click &quot;Add&quot; to add one.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
