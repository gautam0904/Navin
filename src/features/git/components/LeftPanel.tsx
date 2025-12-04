import { GitBranch, ChevronDown } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { BranchPanel } from './BranchPanel';

export function LeftPanel() {
  const { repository } = useGit();

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] border-r border-[var(--git-panel-border)]">
      {/* Repository Switcher Header */}
      <div className="p-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <button
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-[var(--git-panel-item-hover)] transition-colors text-left"
          onClick={() => {
            // TODO: Implement repository switcher dropdown
            console.log('Switch repository clicked');
          }}
        >
          <div className="p-1.5 rounded bg-[var(--color-bg-surface-2)]">
            <GitBranch className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {repository?.name || 'No Repository'}
            </h2>
            <p className="text-xs text-[var(--color-text-tertiary)] truncate">
              {repository?.path || 'Select a repository'}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        </button>
      </div>

      {/* Navigation / Sections */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <BranchPanel />
      </div>
    </div>
  );
}
