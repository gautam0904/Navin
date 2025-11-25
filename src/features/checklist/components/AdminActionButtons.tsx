import React from 'react';
import { Settings, RotateCcw, Download, Save, Copy, XCircle } from 'lucide-react';

interface AdminActionButtonsProps {
  isAdminMode: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onCopyCode: () => void;
  onExitAdmin: () => void;
  onAdminClick: () => void;
  onReset: () => void;
  onExport: () => void;
}

export const AdminActionButtons: React.FC<AdminActionButtonsProps> = ({
  isAdminMode,
  hasUnsavedChanges,
  onSave,
  onCopyCode,
  onExitAdmin,
  onAdminClick,
  onReset,
  onExport,
}) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
      {isAdminMode ? (
        <>
          <button
            onClick={onSave}
            className={`button-primary flex items-center gap-2 text-xs sm:text-sm ${hasUnsavedChanges ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">
              {hasUnsavedChanges ? 'Ready to Save' : 'No Changes'}
            </span>
            <span className="sm:hidden">{hasUnsavedChanges ? 'Save' : 'None'}</span>
          </button>
          <button
            onClick={onCopyCode}
            className="button-primary flex items-center gap-2 text-xs sm:text-sm"
          >
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Copy Code</span>
            <span className="sm:hidden">Copy</span>
          </button>
          <button
            onClick={onExitAdmin}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-800 transition-all duration-150 text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-md active:scale-95"
          >
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            Exit
          </button>
        </>
      ) : (
        <button
          onClick={onAdminClick}
          className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 border border-border-medium dark:border-border-medium text-primary dark:text-primary font-medium text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          Admin
        </button>
      )}
      <button
        onClick={onReset}
        className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 border border-border-medium dark:border-border-medium text-text-secondary dark:text-text-secondary font-medium text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        Reset
      </button>
      <button
        onClick={onExport}
        className="button-primary flex items-center gap-2 text-xs sm:text-sm"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="hidden sm:inline">Export</span>
        <span className="sm:hidden">Export</span>
      </button>
    </div>
  );
};
