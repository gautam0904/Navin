import React, { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronRight, FileCode } from 'lucide-react';
import { ChecklistItem as ChecklistItemType, CodeExamples } from '../types/checklist';
import { EditableExamples } from './EditableExamples';

interface ChecklistItemProps {
  item: ChecklistItemType;
  isChecked: boolean;
  isEditing: boolean;
  isAdminMode: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTextChange: (text: string) => void;
  onBlur: () => void;
  onExamplesChange?: (itemId: string, examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (itemId: string, codeExamples: CodeExamples) => void;
  onCodeExampleChange?: (itemId: string, codeExample: string) => void;
  onExamplesSave?: (itemId: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  isChecked,
  isEditing,
  isAdminMode,
  onToggle,
  onEdit,
  onDelete,
  onTextChange,
  onBlur,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onExamplesSave,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const hasTextExamples = item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0);
  const hasCodeExamples = item.codeExamples && (item.codeExamples.good.length > 0 || item.codeExamples.bad.length > 0);
  const hasLegacyCode = item.codeExample;
  const hasExamples = hasTextExamples || hasCodeExamples || hasLegacyCode;

  return (
    <div className="rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-all group">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="w-5 h-5 rounded-lg border-2 border-gray-400 text-green-600 focus:ring-4 focus:ring-green-200 cursor-pointer transition-all"
            disabled={isAdminMode}
          />
        </div>
        {isEditing ? (
          <input
            type="text"
            value={item.text}
            onChange={(e) => onTextChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') onBlur();
            }}
            className="flex-1 text-base border-b-2 border-blue-500 focus:outline-none bg-white font-medium text-gray-900 px-2"
            autoFocus
          />
        ) : (
          <span className={`flex-1 text-base transition-all ${
            isChecked
              ? 'line-through text-gray-500'
              : 'text-gray-800 font-medium'
          }`}>
            {item.text}
          </span>
        )}
        <div className="flex gap-2 items-center">
          {(hasExamples || isAdminMode) && (
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1 p-2 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
              title={showExamples ? "Hide examples" : "Show examples"}
            >
              <FileCode size={16} className="text-indigo-600" />
              {showExamples ? (
                <ChevronDown size={14} className="text-indigo-600" />
              ) : (
                <ChevronRight size={14} className="text-indigo-600" />
              )}
            </button>
          )}
          {isAdminMode && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
              >
                <Edit2 size={16} className="text-blue-600" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Item Examples */}
      {showExamples && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          {isAdminMode && onExamplesChange && onExamplesSave ? (
            <EditableExamples
              examples={item.examples}
              codeExamples={item.codeExamples}
              codeExample={item.codeExample}
              onExamplesChange={(examples) => onExamplesChange(item.id, examples)}
              onCodeExamplesChange={onCodeExamplesChange ? (codeExamples) => onCodeExamplesChange(item.id, codeExamples) : () => {}}
              onCodeExampleChange={onCodeExampleChange ? (codeExample) => onCodeExampleChange(item.id, codeExample) : undefined}
              onSave={() => onExamplesSave(item.id)}
            />
          ) : (
            <div className="space-y-3">
              {item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {item.examples.good.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h5 className="font-semibold text-green-800 mb-2 text-sm">Good:</h5>
                      <ul className="space-y-1">
                        {item.examples.good.map((ex, i) => (
                          <li key={i} className="text-sm text-green-700 font-mono">{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.examples.bad.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="font-semibold text-red-800 mb-2 text-sm">Bad:</h5>
                      <ul className="space-y-1">
                        {item.examples.bad.map((ex, i) => (
                          <li key={i} className="text-sm text-red-700 font-mono">{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {item.codeExamples && (
                <>
                  {item.codeExamples.good.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Good Code:</h5>
                      {item.codeExamples.good.map((codeEx, i) => (
                        <div key={i} className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <div className="text-xs text-gray-400 mb-1">{codeEx.language.toUpperCase()}</div>
                          <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                            {codeEx.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.codeExamples.bad.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-semibold text-orange-800 mb-2 text-sm">Bad Code:</h5>
                      {item.codeExamples.bad.map((codeEx, i) => (
                        <div key={i} className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <div className="text-xs text-gray-400 mb-1">{codeEx.language.toUpperCase()}</div>
                          <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                            {codeEx.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {item.codeExample && (
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                    {item.codeExample}
                  </pre>
                </div>
              )}
              {!hasExamples && !isAdminMode && (
                <p className="text-xs text-gray-500 italic">No examples for this item.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

