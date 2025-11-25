import React from 'react';
import { ChecklistSection as ChecklistSectionType } from '../../../types/checklist';
import { SectionHeader } from './SectionHeader';
import { SectionContent } from './SectionContent';

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
  const sectionCompleted = section.items.filter((item) => checkedItems[item.id]).length;
  const sectionTotal = section.items.length;
  const sectionPercent = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
  const isEditingSection = editingSection === section.id;

  return (
    <div
      className="rounded-xl bg-bg-secondary dark:bg-bg-secondary transition-all duration-200 group/section shadow-sm hover:shadow-md mb-4 cursor-pointer"
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
      }}
      onClick={onToggle}
    >
      <SectionHeader
        sectionTitle={section.title}
        isExpanded={isExpanded}
        isEditing={isEditingSection}
        sectionPercent={sectionPercent}
        sectionCompleted={sectionCompleted}
        sectionTotal={sectionTotal}
        isAdminMode={isAdminMode}
        onSectionEdit={onSectionEdit}
        onSectionDelete={onSectionDelete}
        onSectionTitleChange={onSectionTitleChange}
        onEditingSectionBlur={onEditingSectionBlur}
      />

      {isExpanded && (
        <SectionContent
          section={section}
          checkedItems={checkedItems}
          isAdminMode={isAdminMode}
          editingItem={editingItem}
          showExamples={showExamples}
          onItemToggle={onItemToggle}
          onItemEdit={onItemEdit}
          onItemDelete={onItemDelete}
          onItemTextChange={onItemTextChange}
          onItemAdd={onItemAdd}
          onExamplesToggle={onExamplesToggle}
          onEditingItemBlur={onEditingItemBlur}
          onExamplesChange={onExamplesChange}
          onCodeExamplesChange={onCodeExamplesChange}
          onCodeExampleChange={onCodeExampleChange}
          onExamplesSave={onExamplesSave}
          onItemExamplesChange={onItemExamplesChange}
          onItemCodeExamplesChange={onItemCodeExamplesChange}
          onItemCodeExampleChange={onItemCodeExampleChange}
          onItemExamplesSave={onItemExamplesSave}
        />
      )}
    </div>
  );
};
