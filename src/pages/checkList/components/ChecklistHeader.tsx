import React from 'react';
import {
  Download,
  RotateCcw,
  Settings,
  Save,
  Copy,
  XCircle,
  FolderOpen,
  ClipboardList,
} from 'lucide-react';

interface ChecklistHeaderProps {
  currentProject: { name: string } | null;
  isAdminMode: boolean;
  hasUnsavedChanges: boolean;
  onAdminClick: () => void;
  onExitAdminMode: () => void;
  onSave: () => void;
  onCopyCode: () => void;
  onResetProgress: () => void;
  onExport: () => void;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  currentProject,
  isAdminMode,
  hasUnsavedChanges,
  onAdminClick,
  onExitAdminMode,
  onSave,
  onCopyCode,
  onResetProgress,
  onExport,
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary dark:bg-primary text-white dark:text-white rounded-lg shadow-md">
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">PRE-COMMIT CHECKLIST</span>
          </div>
          {currentProject && (
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 dark:bg-primary/15 rounded-lg border border-primary/30 dark:border-primary/30 shadow-sm">
              <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary dark:text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-primary dark:text-primary truncate max-w-[150px] sm:max-w-none">
                {currentProject.name}
              </span>
            </div>
          )}
        </div>
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
                onClick={onExitAdminMode}
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
            onClick={onResetProgress}
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
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary dark:text-text-primary mb-2 tracking-tight leading-tight">
          {currentProject
            ? `${currentProject.name} Checklist`
            : 'Frontend Implementation Checklist'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-text-secondary dark:text-text-secondary leading-relaxed font-medium">
          {currentProject
            ? `Project-specific criteria for ${currentProject.name}. Each project has its own checklist.`
            : 'Follow every item before committing your code'}
        </p>
      </div>
    </div>
  );
};
