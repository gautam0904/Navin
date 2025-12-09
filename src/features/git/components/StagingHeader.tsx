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
    <div className="flex items-center justify-between px-3 py-0.5 border-b border-[--git-panel-border] bg-[--git-panel-header]">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[--color-text-primary]">{title}</span>
        {hasFiles && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[--color-bg-surface-2] text-[--color-text-secondary]">
            {count}
          </span>
        )}
      </div>

      {hasFiles && (
        <button
          onClick={isStaged ? onUnstageAll : onStageAll}
          disabled={isLoading}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md
            transition-all duration-200
            ${
              isStaged
                ? 'bg-transparent hover:bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:text-[--color-text-primary] border border-[--git-panel-border]'
                : 'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white shadow-sm hover:shadow'
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
