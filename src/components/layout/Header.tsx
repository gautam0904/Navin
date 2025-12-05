import React from 'react';
import {
  Download,
  RotateCcw,
  Settings,
  Save,
  Copy,
  XCircle,
  Plus,
  FolderOpen,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { useProject } from '../../app/providers/ProjectProvider';

interface HeaderProps {
  progressPercent: number;
  completedItems: number;
  totalItems: number;
  isAdminMode: boolean;
  hasUnsavedChanges: boolean;
  onAdminClick: () => void;
  onReset: () => void;
  onExport: () => void;
  onSave: () => void;
  onCopyCode: () => void;
  onExitAdmin: () => void;
  onAddSection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  completedItems,
  totalItems,
  isAdminMode,
  hasUnsavedChanges,
  onAdminClick,
  onReset,
  onExport,
  onSave,
  onCopyCode,
  onExitAdmin,
  onAddSection,
}) => {
  const { currentProject } = useProject();

  return (
    <div
      className="mb-8 rounded-xl bg-bg-secondary dark:bg-bg-secondary shadow-sm"
      style={{ padding: 'var(--space-xl)' }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Block: Title, Subtitle, Progress */}
        <div className="flex-1" style={{ paddingLeft: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-linear-to-r from-primary to-primary-dark dark:from-primary dark:to-primary-dark text-text-inverse dark:text-text-inverse rounded-lg shadow-sm">
              <ClipboardList className="w-5 h-5" />
              <span className="text-sm font-bold text-text-inverse dark:text-text-inverse tracking-wide">
                PRE-COMMIT CHECKLIST
              </span>
            </div>
            {currentProject && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/15 rounded-lg shadow-sm">
                <FolderOpen className="w-4 h-4 text-primary dark:text-primary" />
                <span className="text-sm font-semibold text-primary dark:text-primary">
                  {currentProject.name}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary mb-3 tracking-tight leading-tight">
            {currentProject
              ? `${currentProject.name} Checklist`
              : 'Frontend Implementation Checklist'}
          </h1>
          <p className="text-base text-text-secondary dark:text-text-secondary leading-relaxed max-w-2xl mb-1">
            {currentProject
              ? `Project-specific criteria for ${currentProject.name}. Each project has its own checklist.`
              : 'Follow every item before committing your code'}
          </p>
        </div>

        {/* Right Block: Admin, Reset, Export */}
        <div className="flex flex-wrap gap-2 items-start">
          {isAdminMode ? (
            <>
              <button
                onClick={onSave}
                disabled={!hasUnsavedChanges}
                className={`h-10 px-4 rounded-lg bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-text-secondary dark:text-text-secondary font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md ${!hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save size={16} />
                {hasUnsavedChanges ? 'Save' : 'No Changes'}
              </button>
              <button
                onClick={onCopyCode}
                className="h-10 px-4 rounded-lg bg-primary dark:bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark text-white dark:text-white font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Copy size={16} />
                Copy Code
              </button>
              <button
                onClick={onExitAdmin}
                className="h-10 px-4 rounded-lg bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <XCircle size={16} />
                Exit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAdminClick}
                className="h-10 px-4 rounded-lg bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-primary dark:text-primary font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Settings size={16} />
                Admin
              </button>
              <button
                onClick={onReset}
                className="h-10 px-4 rounded-lg bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-text-secondary dark:text-text-secondary font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={onExport}
                className="h-10 px-4 rounded-lg bg-primary dark:bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark text-white dark:text-white font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Download size={16} />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar - Aligned with left margin */}
      <div className="mt-6 pt-6 border-t border-border-light dark:border-border-medium">
        <ProgressBar
          progressPercent={progressPercent}
          completedItems={completedItems}
          totalItems={totalItems}
        />
      </div>

      {isAdminMode && (
        <div className="mt-6 pt-6 border-t border-border-light dark:border-border-medium">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={onAddSection}
              className="h-10 px-4 rounded-lg bg-primary dark:bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark text-white dark:text-white font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus size={16} />
              Add New Section
            </button>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-sm shadow-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-400 shrink-0" />
                <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                  Click &quot;Copy Code&quot; to save permanently
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
