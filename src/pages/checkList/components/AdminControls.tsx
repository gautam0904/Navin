import React from 'react';
import { Plus, AlertTriangle } from 'lucide-react';

interface AdminControlsProps {
  hasUnsavedChanges: boolean;
  onAddNewSection: () => void;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  hasUnsavedChanges,
  onAddNewSection,
}) => {
  return (
    <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border-light dark:border-border-medium">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onAddNewSection}
          className="button-primary flex items-center justify-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">Add New Section</span>
          <span className="sm:hidden">Add Section</span>
        </button>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-xs sm:text-sm shadow-sm w-full sm:w-auto justify-center sm:justify-start">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-700 dark:text-yellow-400 shrink-0" />
            <span className="text-yellow-700 dark:text-yellow-400 font-medium text-center sm:text-left">
              <span className="hidden sm:inline">
                Click &quot;Copy Code&quot; to save permanently
              </span>
              <span className="sm:hidden">Click &quot;Copy Code&quot; to save</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
