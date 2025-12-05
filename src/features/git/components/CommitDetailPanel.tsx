import { GitCommit, Clock, User, X } from 'lucide-react';
import { format } from 'date-fns';

interface CommitDetailPanelProps {
  commitSha: string;
  commitMessage: string;
  authorName: string;
  authorEmail: string;
  timestamp: string;
  onClose?: () => void;
}

export function CommitDetailPanel({
  commitSha,
  commitMessage,
  authorName,
  timestamp,
  onClose,
}: CommitDetailPanelProps) {
  const firstLine = commitMessage.split('\n')[0];
  const body = commitMessage.split('\n').slice(1).join('\n').trim();

  return (
    <div className="flex flex-col h-full bg-(--color-bg-primary)">
      {/* Header */}
      <div className="px-4 py-3 border-b border-(--color-border-light) bg-(--color-bg-surface-1)">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-(--color-primary-light)">
              <GitCommit className="w-5 h-5 text-(--color-primary)" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-(--color-text-primary) line-clamp-1">
                {firstLine}
              </h2>
              <span className="text-[10px] font-mono text-[(--color-text-tertiary)]">
                {commitSha.substring(0, 7)}
              </span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="btn-premium btn-premium-ghost btn-premium-icon">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-[(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {format(new Date(timestamp), 'MMM d, yyyy HH:mm')}
          </span>
        </div>

        {/* Commit body */}
        {body && (
          <div className="p-3 rounded-lg bg-[(--color-bg-surface-2)] text-xs text-[(--color-text-secondary)] whitespace-pre-wrap">
            {body}
          </div>
        )}
      </div>
    </div>
  );
}
