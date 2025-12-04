/* eslint-disable complexity */
import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  FolderGit2,
  History,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
} from 'lucide-react';
import { ChangesPanel } from './ChangesPanel';
import { BranchPanel } from './BranchPanel';
import { CommitHistory } from './CommitHistory';
import { StashPanel } from './StashPanel';
import { RemotePanel } from './RemotePanel';
import { useGit } from '@/contexts/GitContext';

type GitTab = 'changes' | 'branches' | 'history' | 'stash' | 'remotes';

interface TabButtonProps {
  tab: GitTab;
  activeTab: GitTab;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}

function TabButton({ tab, activeTab, icon, label, badge, onClick }: TabButtonProps) {
  const isActive = tab === activeTab;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all
        border-b-2 whitespace-nowrap
        ${
          isActive
            ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
            : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-2)]'
        }
      `}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`
          ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full
          ${
            isActive
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg-surface-3)] text-[var(--color-text-secondary)]'
          }
        `}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

function RepositoryHeader() {
  const { repository, branches, refreshStatus, isLoading } = useGit();

  if (!repository) return null;

  const currentBranch = branches?.find((b) => b.is_head);
  const ahead = currentBranch?.ahead || 0;
  const behind = currentBranch?.behind || 0;

  return (
    <div className="px-3 py-2 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FolderGit2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {repository.name}
              </span>
              {currentBranch && (
                <span className="flex items-center gap-1 text-xs font-medium text-[var(--git-branch-current)] bg-[var(--git-panel-item-selected)] px-2 py-0.5 rounded-full">
                  <GitBranch className="w-3 h-3" />
                  {currentBranch.name}
                </span>
              )}
            </div>
            {(ahead > 0 || behind > 0) && (
              <div className="flex items-center gap-3 mt-1 text-xs">
                {ahead > 0 && (
                  <span className="git-sync-badge git-sync-badge--ahead flex items-center gap-1">
                    <ArrowUpCircle className="w-3 h-3" />
                    {ahead} ahead
                  </span>
                )}
                {behind > 0 && (
                  <span className="git-sync-badge git-sync-badge--behind flex items-center gap-1">
                    <ArrowDownCircle className="w-3 h-3" />
                    {behind} behind
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => refreshStatus()}
          disabled={isLoading}
          className={`p-1.5 rounded hover:bg-[var(--color-bg-surface-2)] transition-colors ${isLoading ? 'animate-spin' : ''}`}
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        </button>
      </div>
    </div>
  );
}

export function GitSidebarPanel() {
  const [activeTab, setActiveTab] = useState<GitTab>('changes');
  const { status, repository } = useGit();

  const changesCount = status
    ? (status.staged?.length || 0) +
      (status.unstaged?.length || 0) +
      (status.untracked?.length || 0)
    : 0;

  const handleSelectCommit = (sha: string) => {
    console.log('Selected commit:', sha);
  };

  if (!repository) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FolderGit2 className="w-12 h-12 mb-3 text-[var(--color-text-tertiary)] opacity-50" />
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">No repository open</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Open a folder with a git repository to see changes
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)]">
      {/* Repository Header */}
      <RepositoryHeader />

      {/* Tab Navigation */}
      <div className="flex border-b border-[var(--git-panel-border)] overflow-x-auto scrollbar-hide">
        <TabButton
          tab="changes"
          activeTab={activeTab}
          icon={<GitCommit className="w-3.5 h-3.5" />}
          label="Changes"
          badge={changesCount}
          onClick={() => setActiveTab('changes')}
        />
        <TabButton
          tab="branches"
          activeTab={activeTab}
          icon={<GitBranch className="w-3.5 h-3.5" />}
          label="Branches"
          onClick={() => setActiveTab('branches')}
        />
        <TabButton
          tab="history"
          activeTab={activeTab}
          icon={<History className="w-3.5 h-3.5" />}
          label="History"
          onClick={() => setActiveTab('history')}
        />
        <TabButton
          tab="stash"
          activeTab={activeTab}
          icon={<Package className="w-3.5 h-3.5" />}
          label="Stash"
          onClick={() => setActiveTab('stash')}
        />
        <TabButton
          tab="remotes"
          activeTab={activeTab}
          icon={<FolderGit2 className="w-3.5 h-3.5" />}
          label="Remotes"
          onClick={() => setActiveTab('remotes')}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'changes' && <ChangesPanel />}
        {activeTab === 'branches' && <BranchPanel />}
        {activeTab === 'history' && (
          <div className="h-full">
            <CommitHistory onSelectCommit={handleSelectCommit} />
          </div>
        )}
        {activeTab === 'stash' && <StashPanel />}
        {activeTab === 'remotes' && <RemotePanel />}
      </div>
    </div>
  );
}
