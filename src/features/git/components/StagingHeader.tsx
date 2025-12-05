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
          className={`btn-premium btn-premium-sm ${
            isStaged ? 'btn-premium-ghost' : 'btn-premium-primary'
          }`}
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
