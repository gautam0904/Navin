import { GitBranch, ChevronDown } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { BranchPanel } from './panel/BranchPanel';

export function LeftPanel() {
  const { repository } = useGit();

  return (
    <div className="flex flex-col h-full bg-[--git-panel-bg] border-r border-[--git-panel-border]">
      {/* Repository Switcher Header */}
      <div className="p-3 border-b border-[--git-panel-border] bg-[--git-panel-header]">
        <button
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-[--git-panel-item-hover] transition-colors text-left"
          onClick={() => {
            // TODO: Implement repository switcher dropdown
            console.log('Switch repository clicked');
          }}
        >
          <div className="p-1.5 rounded bg-[--color-bg-surface-2]">
            <GitBranch className="w-4 h-4 text-[--color-primary]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[--color-text-primary] truncate">
              {repository?.name || 'No Repository'}
            </h2>
            <p className="text-xs text-[--color-text-tertiary] truncate">
              {repository?.path || 'Select a repository'}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-[--color-text-tertiary]" />
        </button>
      </div>

      {/* Navigation / Sections */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <BranchPanel />
      </div>
    </div>
  );
}
