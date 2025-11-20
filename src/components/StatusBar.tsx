import { Database, Keyboard } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

export const StatusBar = () => {
  const { currentProject } = useProject();

  return (
    <div className="h-8 bg-bg-surface-2 dark:bg-bg-surface-2 border-t-2 border-border-medium dark:border-border-medium flex items-center justify-between px-6 text-xs text-text-secondary dark:text-text-secondary shrink-0 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary dark:text-primary" />
          <span className="font-medium">SQLite Storage Active</span>
        </div>
        {currentProject && (
          <span className="text-text-secondary dark:text-text-tertiary font-medium">
            Project: <span className="text-text-primary dark:text-text-secondary font-semibold">{currentProject.name}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-text-secondary dark:text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Ctrl+1: Checklist</span>
        </div>
        <span className="text-border-medium dark:text-border-light">•</span>
        <span>Ctrl+2: Projects</span>
        <span className="text-border-medium dark:text-border-light">•</span>
        <span>Ctrl+K: Settings</span>
      </div>
    </div>
  );
};

