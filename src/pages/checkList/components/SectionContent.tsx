import React from 'react';
import { Plus } from 'lucide-react';
import { ChecklistSection as ChecklistSectionType } from '../../../types/checklist';
import { ChecklistItem } from './ChecklistItem';
import { Examples } from './Examples';

interface SectionContentProps {
  section: ChecklistSectionType;
  checkedItems: Record<string, boolean>;
  isAdminMode: boolean;
  editingItem: string | null;
  showExamples: boolean;
  onItemToggle: (itemId: string) => void;
  onItemEdit: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemTextChange: (itemId: string, text: string) => void;
  onItemAdd: () => void;
  onExamplesToggle: () => void;
  onEditingItemBlur: () => void;
  onExamplesChange?: (sectionId: string, examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (
    sectionId: string,
    codeExamples: {
      good: Array<{ language: string; code: string }>;
      bad: Array<{ language: string; code: string }>;
    }
  ) => void;
  onCodeExampleChange?: (sectionId: string, codeExample: string) => void;
  onExamplesSave?: (sectionId: string) => void;
  onItemExamplesChange?: (itemId: string, examples: { good: string[]; bad: string[] }) => void;
  onItemCodeExamplesChange?: (
    itemId: string,
    codeExamples: {
      good: Array<{ language: string; code: string }>;
      bad: Array<{ language: string; code: string }>;
    }
  ) => void;
  onItemCodeExampleChange?: (itemId: string, codeExample: string) => void;
  onItemExamplesSave?: (itemId: string) => void;
}

export const SectionContent: React.FC<SectionContentProps> = ({
  section,
  checkedItems,
  isAdminMode,
  editingItem,
  showExamples,
  onItemToggle,
  onItemEdit,
  onItemDelete,
  onItemTextChange,
  onItemAdd,
  onExamplesToggle,
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
  return (
    <div className="px-6 py-4 space-y-3 bg-bg-secondary dark:bg-bg-secondary rounded-b-xl">
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

      {isAdminMode && (
        <button onClick={onItemAdd} className="button-primary flex items-center gap-2">
          <Plus size={18} />
          Add Item
        </button>
      )}

      <Examples
        section={section}
        isExpanded={showExamples}
        isAdminMode={isAdminMode}
        onToggle={onExamplesToggle}
        onExamplesChange={
          onExamplesChange ? (examples) => onExamplesChange(section.id, examples) : undefined
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
  );
};
