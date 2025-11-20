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
    <div
      className="rounded-xl bg-bg-secondary dark:bg-bg-secondary transition-all duration-200 group/section shadow-sm hover:shadow-md mb-4 cursor-pointer"
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'
      }}
      onClick={onToggle}
    >
      {/* Section Header */}
      <div
        className="w-full px-6 py-5 bg-bg-surface-2/50 dark:bg-bg-surface-2/40 hover:bg-bg-surface-2 dark:hover:bg-bg-surface-2/80 transition-all duration-150 rounded-t-xl flex items-center justify-between gap-4"
        style={{ minHeight: '64px' }}
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          {/* Fixed-size icon container for alignment - always visible */}
          <div className="w-10 h-10 flex-shrink-0 bg-primary dark:bg-primary text-white dark:text-white rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-150 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="text-white dark:text-white transition-transform duration-150" size={20} />
            ) : (
              <ChevronRight className="text-white dark:text-white transition-transform duration-150" size={20} />
            )}
          </div>

          {/* Section Title */}
          <div className="flex-1 min-w-0">
            {isEditingSection ? (
              <input
                type="text"
                value={section.title}
                onChange={(e) => onSectionTitleChange(e.target.value)}
                onBlur={onEditingSectionBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') onEditingSectionBlur();
                }}
                className="text-xl font-semibold text-text-primary dark:text-text-primary border-b-2 border-primary dark:border-primary focus:outline-none bg-transparent w-full px-2 py-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary tracking-tight">
                {section.title}
              </h2>
            )}
            {/* Progress bar under title */}
            <div className="mt-2 progress-container" style={{ height: '6px', maxWidth: '300px' }}>
              <div
                className="progress-fill"
                style={{ width: `${sectionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right side: Admin controls + Progress counter */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isAdminMode && (
            <div
              className="flex gap-1.5 p-1.5 bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionEdit();
                }}
                className="p-2 hover:bg-primary/10 dark:hover:bg-primary/25 rounded-md transition-all duration-150 hover:scale-105 active:scale-95"
                title="Edit Section"
              >
                <Edit2 size={16} className="text-primary dark:text-primary" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionDelete();
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md transition-all duration-150 hover:scale-105 active:scale-95"
                title="Delete Section"
              >
                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          )}
          {/* Fixed-width pill-style progress counter */}
          <div
            className="px-4 py-2 bg-bg-surface-2 dark:bg-bg-surface-3 rounded-full shadow-sm flex items-center gap-2"
            style={{ minWidth: '100px', justifyContent: 'flex-end' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-bold text-text-primary dark:text-text-primary">
              {sectionCompleted}/{sectionTotal}
            </span>
            <span className="text-xs font-semibold text-primary dark:text-primary-light">
              {sectionPercent}%
            </span>
            {sectionCompleted === sectionTotal && sectionTotal > 0 && (
              <Check className="text-primary dark:text-primary-light flex-shrink-0" size={14} strokeWidth={3} />
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-6 py-4 space-y-3 bg-bg-secondary dark:bg-bg-secondary rounded-b-xl">
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
              className="button-primary flex items-center gap-2"
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

