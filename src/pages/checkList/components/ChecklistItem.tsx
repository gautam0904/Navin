import React, { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronRight, FileCode } from 'lucide-react';
import { ChecklistItem as ChecklistItemType, CodeExamples } from '../../../types/checklist';
import { EditableExamples } from './EditableExamples';
import { ItemExamplesDisplay } from './ItemExamplesDisplay';

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

interface ItemTextProps {
  item: ChecklistItemType;
  isChecked: boolean;
  isEditing: boolean;
  onTextChange: (text: string) => void;
  onBlur: () => void;
}

const ItemText = ({ item, isChecked, isEditing, onTextChange, onBlur }: ItemTextProps) => {
  if (isEditing) {
    return (
      <input
        type="text"
        value={item.text}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') onBlur();
        }}
        className="flex-1 text-base border-b-2 border-primary dark:border-primary focus:outline-none bg-transparent font-semibold text-text-primary dark:text-text-primary px-2 py-1"
        autoFocus
      />
    );
  }

  return (
    <span
      className={`flex-1 text-base leading-relaxed transition-all ${
        isChecked
          ? 'line-through text-text-tertiary dark:text-text-tertiary opacity-70'
          : 'text-text-primary dark:text-text-primary font-medium'
      }`}
    >
      {item.text}
    </span>
  );
};

interface AdminControlsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AdminControls = ({ onEdit, onDelete }: AdminControlsProps) => (
  <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      className="p-2 hover:bg-primary/15 dark:hover:bg-primary/25 rounded-lg transition-all border border-transparent hover:border-primary/40 dark:hover:border-primary/50 hover:scale-105 active:scale-95 shadow-sm"
      title="Edit Item"
    >
      <Edit2 size={16} className="text-primary dark:text-primary" />
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md transition-all duration-150 border border-transparent hover:border-red-200 dark:hover:border-red-800 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
      title="Delete Item"
    >
      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
    </button>
  </div>
);

interface ExamplesToggleProps {
  showExamples: boolean;
  hasExamples: boolean;
  isAdminMode: boolean;
  onToggle: () => void;
}

const ExamplesToggle = ({
  showExamples,
  hasExamples,
  isAdminMode,
  onToggle,
}: ExamplesToggleProps) => {
  if (!hasExamples && !isAdminMode) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-md transition-all border border-primary/30 dark:border-primary/40 hover:border-primary/50 dark:hover:border-primary/60 hover:scale-105 shadow-sm hover:shadow-md"
      title={showExamples ? 'Hide examples' : 'Show examples'}
    >
      <FileCode size={16} className="text-primary dark:text-primary" />
      {showExamples ? (
        <ChevronDown size={14} className="text-primary dark:text-primary" />
      ) : (
        <ChevronRight size={14} className="text-primary dark:text-primary" />
      )}
    </button>
  );
};

interface ItemExamplesProps {
  item: ChecklistItemType;
  isAdminMode: boolean;
  onExamplesChange?: (itemId: string, examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (itemId: string, codeExamples: CodeExamples) => void;
  onCodeExampleChange?: (itemId: string, codeExample: string) => void;
  onExamplesSave?: (itemId: string) => void;
}

const ItemExamples = ({
  item,
  isAdminMode,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onExamplesSave,
}: ItemExamplesProps) => {
  if (isAdminMode && onExamplesChange && onExamplesSave) {
    return (
      <EditableExamples
        examples={item.examples}
        codeExamples={item.codeExamples}
        codeExample={item.codeExample}
        onExamplesChange={(examples) => onExamplesChange(item.id, examples)}
        onCodeExamplesChange={
          onCodeExamplesChange
            ? (codeExamples) => onCodeExamplesChange(item.id, codeExamples)
            : () => {}
        }
        onCodeExampleChange={
          onCodeExampleChange
            ? (codeExample) => onCodeExampleChange(item.id, codeExample)
            : undefined
        }
        onSave={() => onExamplesSave(item.id)}
      />
    );
  }

  return <ItemExamplesDisplay item={item} />;
};

const getContainerClassName = (isChecked: boolean) => {
  const base = 'rounded-lg transition-all duration-200 group/item cursor-pointer';
  const checked =
    'bg-primary/10 dark:bg-primary/20 shadow-sm hover:bg-primary/15 dark:hover:bg-primary/25';
  const unchecked =
    'bg-bg-surface-2/50 dark:bg-bg-surface-2/40 hover:bg-bg-surface-2 dark:hover:bg-bg-surface-2/70 shadow-sm';
  return `${base} ${isChecked ? checked : unchecked}`;
};

const getBoxShadow = (isChecked: boolean) => {
  return isChecked
    ? '0 1px 3px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(59, 130, 246, 0.1)'
    : '0 1px 2px rgba(0, 0, 0, 0.05)';
};

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
  const hasTextExamples =
    item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0);
  const hasCodeExamples =
    item.codeExamples && (item.codeExamples.good.length > 0 || item.codeExamples.bad.length > 0);
  const hasLegacyCode = item.codeExample;
  const hasExamples = hasTextExamples || hasCodeExamples || hasLegacyCode;

  return (
    <div
      className={getContainerClassName(isChecked)}
      style={{
        padding: 'var(--space-md)',
        boxShadow: getBoxShadow(isChecked),
      }}
    >
      <div className="flex items-start gap-4 transition-all duration-200 group">
        <div className="pt-1.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="w-6 h-6 rounded-md border-2 border-primary dark:border-primary bg-transparent text-primary dark:text-primary focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/50 cursor-pointer transition-all duration-200 checked:bg-gradient-to-br checked:from-primary checked:to-primary-dark dark:checked:from-primary dark:checked:to-primary-dark checked:border-primary dark:checked:border-primary hover:border-primary-light dark:hover:border-primary-light hover:scale-110 active:scale-95 shadow-sm checked:shadow-md"
            style={{
              accentColor: 'var(--color-primary)',
            }}
            disabled={isAdminMode}
          />
        </div>
        <ItemText
          item={item}
          isChecked={isChecked}
          isEditing={isEditing}
          onTextChange={onTextChange}
          onBlur={onBlur}
        />
        <div className="flex gap-2 items-center">
          <ExamplesToggle
            showExamples={!!showExamples}
            hasExamples={!!hasExamples}
            isAdminMode={!!isAdminMode}
            onToggle={() => setShowExamples(!showExamples)}
          />
          {isAdminMode === true && <AdminControls onEdit={onEdit} onDelete={onDelete} />}
        </div>
      </div>

      {showExamples && (
        <div
          className="px-6 pb-6 border-t border-primary/20 dark:border-primary/30 pt-6 bg-bg-surface-2 dark:bg-bg-surface-2"
          style={{ padding: 'var(--space-lg)' }}
        >
          <ItemExamples
            item={item}
            isAdminMode={isAdminMode}
            onExamplesChange={onExamplesChange}
            onCodeExamplesChange={onCodeExamplesChange}
            onCodeExampleChange={onCodeExampleChange}
            onExamplesSave={onExamplesSave}
          />
        </div>
      )}
    </div>
  );
};
