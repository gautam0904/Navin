import React from 'react';
import { ClipboardList, FolderOpen } from 'lucide-react';
import { Project } from '@services';

interface ChecklistHeaderProps {
  currentProject: Project | null;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ currentProject }) => {
  return (
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
  );
};
