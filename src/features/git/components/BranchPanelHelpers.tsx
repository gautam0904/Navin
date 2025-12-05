import { GitBranch, Check, ArrowUpCircle, ArrowDownCircle, Trash2, GitMerge } from 'lucide-react';

interface Branch {
  name: string;
  is_head: boolean;
  is_remote: boolean;
  upstream: string | null;
  ahead: number;
  behind: number;
}

interface BranchItemProps {
  branch: Branch;
  onSelect: () => void;
  onDelete?: () => void;
}

export function BranchItem({ branch, onSelect, onDelete }: BranchItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`branch-item group ${branch.is_head ? 'branch-item-current' : ''}`}
    >
      <GitBranch className="branch-item-icon w-4 h-4" />
      <div className="branch-item-content">
        <div className="branch-item-name">
          <span className="truncate max-w-[180px]" title={branch.name}>
            {branch.name}
          </span>
          {branch.is_head && (
            <span className="badge badge-primary">
              <Check className="w-2.5 h-2.5" />
              Current
            </span>
          )}
        </div>
        {branch.upstream && (
          <div className="branch-item-tracking">
            <GitMerge className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{branch.upstream}</span>
            {(branch.ahead > 0 || branch.behind > 0) && (
              <div className="flex items-center gap-1.5">
                {branch.ahead > 0 && (
                  <span className="branch-item-sync branch-item-sync-ahead">
                    <ArrowUpCircle className="w-3 h-3" />
                    {branch.ahead}
                  </span>
                )}
                {branch.behind > 0 && (
                  <span className="branch-item-sync branch-item-sync-behind">
                    <ArrowDownCircle className="w-3 h-3" />
                    {branch.behind}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {!branch.is_head && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-[rgba(239,68,68,0.1)] transition-all"
          title="Delete Branch"
        >
          <Trash2 className="w-3.5 h-3.5 text-(--color-error)" />
        </button>
      )}
    </div>
  );
}
