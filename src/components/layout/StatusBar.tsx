import { Database, Keyboard } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';

export const StatusBar = () => {
  const { currentProject } = useProject();

  return (
    <div className="min-h-8 bg-bg-surface-2 dark:bg-bg-surface-2 border-t-2 border-border-medium dark:border-border-medium flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-0 text-xs text-text-secondary dark:text-text-secondary shrink-0 shadow-sm gap-2 sm:gap-0">
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary dark:text-primary shrink-0" />
          <span className="font-medium whitespace-nowrap">Local Storage</span>
        </div>
        {currentProject && (
          <span className="text-text-secondary dark:text-text-tertiary font-medium">
            Project: <span className="text-text-primary dark:text-text-secondary font-semibold truncate max-w-[200px] sm:max-w-none inline-block">{currentProject.name}</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-text-secondary dark:text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap hidden sm:inline">Ctrl+1: Checklist</span>
          <span className="whitespace-nowrap sm:hidden">C+1</span>
        </div>
        <span className="text-border-medium dark:text-border-light hidden sm:inline">•</span>
        <span className="whitespace-nowrap hidden lg:inline">Ctrl+2: Projects</span>
        <span className="whitespace-nowrap lg:hidden sm:inline hidden">C+2</span>
        <span className="text-border-medium dark:text-border-light hidden sm:inline">•</span>
        <span className="whitespace-nowrap hidden lg:inline">Ctrl+K: Settings</span>
        <span className="whitespace-nowrap lg:hidden sm:inline hidden">C+K</span>
      </div>
    </div>
  );
};

