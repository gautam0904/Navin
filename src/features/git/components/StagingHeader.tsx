import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface StagingHeaderProps {
  title: string;
  count: number;
  isStaged: boolean;
  isLoading: boolean;
  hasFiles: boolean;
  onStageAll?: () => void;
  onUnstageAll?: () => void;
}

export function StagingHeader({
  title,
  count,
  isStaged,
  isLoading,
  hasFiles,
  onStageAll,
  onUnstageAll,
}: StagingHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {title}
        </h3>
        {hasFiles && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-bg-surface-3)] text-[var(--color-text-secondary)]">
            {count}
          </span>
        )}
      </div>

      {hasFiles && (
        <button
          onClick={isStaged ? onUnstageAll : onStageAll}
          disabled={isLoading}
          className={`
            flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded transition-colors
            ${
              isStaged
                ? 'bg-[var(--color-bg-surface-2)] hover:bg-[var(--color-bg-surface-3)] text-[var(--color-text-secondary)]'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
            }
          `}
        >
          {isStaged ? (
            <>
              <Minus className="w-3 h-3" />
              <span>Unstage All</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Stage All</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
