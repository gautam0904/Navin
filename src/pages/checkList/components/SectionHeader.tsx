import React from 'react';
import { ChevronDown, ChevronRight, Check, Edit2, Trash2 } from 'lucide-react';

interface SectionHeaderProps {
  sectionTitle: string;
  isExpanded: boolean;
  isEditing: boolean;
  sectionPercent: number;
  sectionCompleted: number;
  sectionTotal: number;
  isAdminMode: boolean;
  onSectionEdit: () => void;
  onSectionDelete: () => void;
  onSectionTitleChange: (title: string) => void;
  onEditingSectionBlur: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionTitle,
  isExpanded,
  isEditing,
  sectionPercent,
  sectionCompleted,
  sectionTotal,
  isAdminMode,
  onSectionEdit,
  onSectionDelete,
  onSectionTitleChange,
  onEditingSectionBlur,
}) => {
  return (
    <div
      className="w-full px-6 py-5 bg-bg-surface-2/50 dark:bg-bg-surface-2/40 hover:bg-bg-surface-2 dark:hover:bg-bg-surface-2/80 transition-all duration-150 rounded-t-xl flex items-center justify-between gap-4"
      style={{ minHeight: '64px' }}
    >
      <div className="flex items-center gap-4 flex-1 text-left">
        {isExpanded ? (
          <ChevronDown
            className="text-xl font-semibold text-text-primary dark:text-text-primary transition-transform duration-150"
            size={20}
          />
        ) : (
          <ChevronRight
            className="text-xl font-semibold text-text-primary dark:text-text-primary transition-transform duration-150"
            size={20}
          />
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={sectionTitle}
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
              {sectionTitle}
            </h2>
          )}
          <div className="mt-2 progress-container" style={{ height: '6px', maxWidth: '300px' }}>
            <div className="progress-fill" style={{ width: `${sectionPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
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
            <Check
              className="text-primary dark:text-primary-light shrink-0"
              size={14}
              strokeWidth={3}
            />
          )}
        </div>
      </div>
    </div>
  );
};
