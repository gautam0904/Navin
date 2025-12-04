import React from 'react';
import { Check, FileIcon } from 'lucide-react';

interface EmptyStateProps {
  isStaged: boolean;
}

export function EmptyState({ isStaged }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-bg-surface-2)] flex items-center justify-center mb-3">
        {isStaged ? (
          <Check className="w-6 h-6 text-[var(--color-text-tertiary)] opacity-40" />
        ) : (
          <FileIcon className="w-6 h-6 text-[var(--color-text-tertiary)] opacity-40" />
        )}
      </div>
      <p className="text-sm text-[var(--color-text-tertiary)]">
        {isStaged ? 'No staged changes' : 'No changes'}
      </p>
      {!isStaged && (
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Make changes to see them here
        </p>
      )}
    </div>
  );
}
