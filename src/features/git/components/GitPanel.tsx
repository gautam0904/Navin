import { useGit } from '@/contexts/GitContext';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { RepositoryPicker } from './RepositoryPicker';

export function GitPanel() {
  const { repository } = useGit();

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex h-full bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Left Panel: Navigation & Branches */}
      <div className="w-64 shrink-0 flex flex-col border-r border-[var(--git-panel-border)]">
        <LeftPanel />
      </div>

      {/* Center Panel: Graph & Main View */}
      <div className="flex-1 min-w-0 flex flex-col">
        <CenterPanel />
      </div>

      {/* Right Panel: Context & Details */}
      <div className="w-80 shrink-0 flex flex-col border-l border-[var(--git-panel-border)]">
        <RightPanel />
      </div>
    </div>
  );
}
