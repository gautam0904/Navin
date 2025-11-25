import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyChecklistStateProps {
  isAdminMode: boolean;
}

export const EmptyChecklistState: React.FC<EmptyChecklistStateProps> = ({ isAdminMode }) => {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-primary dark:text-primary" />
      </div>
      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">
        No Checklist Items Yet
      </h3>
      <p className="text-text-secondary dark:text-text-secondary mb-6">
        {isAdminMode
          ? 'Click "Add New Section" to create your first checklist section.'
          : 'Enable Admin Mode to add checklist items.'}
      </p>
    </div>
  );
};
