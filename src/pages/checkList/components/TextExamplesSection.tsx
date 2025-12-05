import React, { useState } from 'react';
import { Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Examples } from '../../../types/checklist';

interface TextExamplesSectionProps {
  examples?: Examples;
  onExamplesChange: (examples: Examples) => void;
  onSave: () => void;
}

export const TextExamplesSection: React.FC<TextExamplesSectionProps> = ({
  examples,
  onExamplesChange,
  onSave,
}) => {
  const [editingGoodIndex, setEditingGoodIndex] = useState<number | null>(null);
  const [editingBadIndex, setEditingBadIndex] = useState<number | null>(null);
  const [tempGoodText, setTempGoodText] = useState('');
  const [tempBadText, setTempBadText] = useState('');

  const currentExamples = examples || { good: [], bad: [] };

  // Good text examples
  const handleAddGood = () => {
    const newExamples = { ...currentExamples, good: [...currentExamples.good, ''] };
    onExamplesChange(newExamples);
    setEditingGoodIndex(currentExamples.good.length);
    setTempGoodText('');
  };

  const handleEditGood = (index: number) => {
    setEditingGoodIndex(index);
    setTempGoodText(currentExamples.good[index] || '');
  };

  const handleSaveGood = (index: number) => {
    const good = [...currentExamples.good];
    good[index] = tempGoodText;
    onExamplesChange({ ...currentExamples, good });
    setEditingGoodIndex(null);
    setTempGoodText('');
    onSave();
  };

  const handleDeleteGood = (index: number) => {
    const good = currentExamples.good.filter((_, i) => i !== index);
    onExamplesChange({ ...currentExamples, good });
    onSave();
  };

  // Bad text examples
  const handleAddBad = () => {
    const newExamples = { ...currentExamples, bad: [...currentExamples.bad, ''] };
    onExamplesChange(newExamples);
    setEditingBadIndex(currentExamples.bad.length);
    setTempBadText('');
  };

  const handleEditBad = (index: number) => {
    setEditingBadIndex(index);
    setTempBadText(currentExamples.bad[index] || '');
  };

  const handleSaveBad = (index: number) => {
    const bad = [...currentExamples.bad];
    bad[index] = tempBadText;
    onExamplesChange({ ...currentExamples, bad });
    setEditingBadIndex(null);
    setTempBadText('');
    onSave();
  };

  const handleDeleteBad = (index: number) => {
    const bad = currentExamples.bad.filter((_, i) => i !== index);
    onExamplesChange({ ...currentExamples, bad });
    onSave();
  };

  return (
    <div className="space-y-5">
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
            <p className="text-sm text-gray-500 italic">
              No bad examples yet. Click &quot;Add&quot; to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
