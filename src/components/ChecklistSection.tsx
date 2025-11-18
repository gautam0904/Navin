import React from 'react';
import { ChevronDown, ChevronRight, Check, Edit2, Trash2, Plus } from 'lucide-react';
import { ChecklistSection as ChecklistSectionType } from '../types/checklist';
import { ChecklistItem } from './ChecklistItem';
import { Examples } from './Examples';

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  checkedItems: Record<string, boolean>;
  isExpanded: boolean;
  isAdminMode: boolean;
  editingSection: string | null;
  editingItem: string | null;
  showExamples: boolean;
  onToggle: () => void;
  onItemToggle: (itemId: string) => void;
  onSectionEdit: () => void;
  onSectionDelete: () => void;
  onSectionTitleChange: (title: string) => void;
  onItemEdit: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemTextChange: (itemId: string, text: string) => void;
  onItemAdd: () => void;
  onExamplesToggle: () => void;
  onEditingSectionBlur: () => void;
  onEditingItemBlur: () => void;
  onExamplesChange?: (sectionId: string, examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (sectionId: string, codeExamples: { good: Array<{ language: string; code: string }>; bad: Array<{ language: string; code: string }> }) => void;
  onCodeExampleChange?: (sectionId: string, codeExample: string) => void;
  onExamplesSave?: (sectionId: string) => void;
  onItemExamplesChange?: (itemId: string, examples: { good: string[]; bad: string[] }) => void;
  onItemCodeExamplesChange?: (itemId: string, codeExamples: { good: Array<{ language: string; code: string }>; bad: Array<{ language: string; code: string }> }) => void;
  onItemCodeExampleChange?: (itemId: string, codeExample: string) => void;
  onItemExamplesSave?: (itemId: string) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  section,
  checkedItems,
  isExpanded,
  isAdminMode,
  editingSection,
  editingItem,
  showExamples,
  onToggle,
  onItemToggle,
  onSectionEdit,
  onSectionDelete,
  onSectionTitleChange,
  onItemEdit,
  onItemDelete,
  onItemTextChange,
  onItemAdd,
  onExamplesToggle,
  onEditingSectionBlur,
  onEditingItemBlur,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onExamplesSave,
  onItemExamplesChange,
  onItemCodeExamplesChange,
  onItemCodeExampleChange,
  onItemExamplesSave,
}) => {
  const sectionCompleted = section.items.filter(item => checkedItems[item.id]).length;
  const sectionTotal = section.items.length;
  const sectionPercent = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
  const isEditingSection = editingSection === section.id;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 mb-4">
      {/* Section Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-300">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onToggle}
            className="flex-1 flex items-center gap-3 text-left group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-300 group-hover:shadow-md transition-all">
              {isExpanded ? (
                <ChevronDown className="text-blue-600" size={20} />
              ) : (
                <ChevronRight className="text-gray-500 group-hover:text-blue-600 transition-colors" size={20} />
              )}
            </div>
            {isEditingSection ? (
              <input
                type="text"
                value={section.title}
                onChange={(e) => onSectionTitleChange(e.target.value)}
                onBlur={onEditingSectionBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') onEditingSectionBlur();
                }}
                className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-white flex-1 px-2"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 flex-1">{section.title}</h2>
            )}
          </button>
          <div className="flex items-center gap-3">
            {isAdminMode && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionEdit();
                  }}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                >
                  <Edit2 size={18} className="text-blue-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionDelete();
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-300">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${sectionPercent}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-800 min-w-[60px]">
                {sectionCompleted}/{sectionTotal}
              </span>
              {sectionCompleted === sectionTotal && sectionTotal > 0 && (
                <div className="p-1 bg-green-50 rounded-lg border border-green-200">
                  <Check className="text-green-600" size={18} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-6 space-y-5">
          {/* Checklist Items */}
          <div className="space-y-2">
            {section.items.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                isChecked={checkedItems[item.id] || false}
                isEditing={editingItem === item.id}
                isAdminMode={isAdminMode}
                onToggle={() => onItemToggle(item.id)}
                onEdit={() => onItemEdit(item.id)}
                onDelete={() => onItemDelete(item.id)}
                onTextChange={(text) => onItemTextChange(item.id, text)}
                onBlur={onEditingItemBlur}
                onExamplesChange={onItemExamplesChange}
                onCodeExamplesChange={onItemCodeExamplesChange}
                onCodeExampleChange={onItemCodeExampleChange}
                onExamplesSave={onItemExamplesSave}
              />
            ))}
          </div>

          {/* Add Item Button */}
          {isAdminMode && (
            <button
              onClick={onItemAdd}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 rounded-xl transition-all font-semibold border-2 border-green-200"
            >
              <Plus size={18} />
              Add Item
            </button>
          )}

          {/* Examples */}
          <Examples
            section={section}
            isExpanded={showExamples}
            isAdminMode={isAdminMode}
            onToggle={onExamplesToggle}
            onExamplesChange={
              onExamplesChange
                ? (examples) => onExamplesChange(section.id, examples)
                : undefined
            }
            onCodeExamplesChange={
              onCodeExamplesChange
                ? (codeExamples) => onCodeExamplesChange(section.id, codeExamples)
                : undefined
            }
            onCodeExampleChange={
              onCodeExampleChange
                ? (codeExample) => onCodeExampleChange(section.id, codeExample)
                : undefined
            }
            onSave={onExamplesSave ? () => onExamplesSave(section.id) : undefined}
          />
        </div>
      )}
    </div>
  );
};

