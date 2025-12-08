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
    <div className="flex items-center justify-between px-3 py-2 border-b border-[--git-panel-border] bg-[--git-panel-header] min-h-[40px]">
      <div className="section-header-title">
        <span>{title}</span>
        {hasFiles && <span className="section-header-count">{count}</span>}
      </div>

      {hasFiles && (
        <button
          onClick={isStaged ? onUnstageAll : onStageAll}
          disabled={isLoading}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
            transition-all duration-200
            border border-[--git-panel-border]
            ${
              isStaged
                ? 'bg-transparent hover:bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:text-[--color-text-primary]'
                : 'bg-[--color-bg-surface-2] hover:bg-[--color-bg-surface-3] text-[--color-text-secondary] hover:text-[--color-text-primary]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isStaged ? (
            <>
              <Minus className="w-3.5 h-3.5" />
              <span>Unstage All</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Stage All</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
