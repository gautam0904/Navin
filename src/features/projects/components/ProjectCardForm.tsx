import React from 'react';
import { Check, X } from 'lucide-react';

interface ProjectEditingFormProps {
  editName: string;
  editDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProjectEditingForm: React.FC<ProjectEditingFormProps> = ({
  editName,
  editDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-2">
          Description
        </label>
        <textarea
          value={editDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 px-3 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-white dark:text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
        >
          <Check className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-text-secondary dark:text-text-secondary rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
};
