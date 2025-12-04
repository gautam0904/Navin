import { CommitHistory } from './CommitHistory';
import { GitCommit } from 'lucide-react';

export function RightPanel() {
  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] border-l border-[var(--git-panel-border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Commit Details</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Placeholder for selected commit details */}
        <div className="p-4 text-center text-[var(--color-text-tertiary)] text-sm border-b border-[var(--git-panel-border)]">
          Select a commit to view details
        </div>

        {/* Using CommitHistory as a list of recent commits for now */}
        <div className="flex-1">
          <div className="px-4 py-2 bg-[var(--color-bg-surface-2)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            History
          </div>
          <CommitHistory onSelectCommit={(sha) => console.log('Selected commit:', sha)} />
        </div>
      </div>
    </div>
  );
}
