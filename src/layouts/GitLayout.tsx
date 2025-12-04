/* eslint-disable complexity, max-lines */
import React, { useState } from 'react';
import {
  RepositoryPicker,
  ChangesPanel,
  CommitComposer,
  BranchPanel,
  CommitHistory,
  RemotePanel,
  StashPanel,
} from '../features/git';
import { DiffViewer } from '../features/git/components/DiffViewer';
import { useGit } from '../contexts/GitContext';
import {
  GitBranch,
  FolderGit2,
  History,
  Package,
  Globe,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Download,
  Upload,
  GitCommit,
  Check,
  AlertCircle,
} from 'lucide-react';

type GitView = 'changes' | 'history' | 'branches' | 'stash' | 'remotes';

// Top Action Bar Component
interface TopBarProps {
  onPull: () => void;
  onPush: () => void;
  onFetch: () => void;
  isLoading: boolean;
}

function TopBar({ onPull, onPush, onFetch, isLoading }: TopBarProps) {
  const { repository, branches, remotes } = useGit();

  const currentBranch = branches?.find((b) => b.is_head);
  const ahead = currentBranch?.ahead || 0;
  const behind = currentBranch?.behind || 0;
  const hasRemote = remotes && remotes.length > 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
      {/* Left: Repository info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-semibold text-[var(--color-text-primary)]">
            {repository?.name || 'No Repository'}
          </span>
        </div>

        {/* Branch selector */}
        {currentBranch && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-surface-2)] border border-[var(--git-panel-border)]">
            <GitBranch className="w-4 h-4 text-[var(--git-branch-current)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {currentBranch.name}
            </span>
            {(ahead > 0 || behind > 0) && (
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-[var(--git-panel-border)]">
                {behind > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-[var(--git-behind)]">
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    {behind}
                  </span>
                )}
                {ahead > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-[var(--git-ahead)]">
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    {ahead}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onFetch}
          disabled={isLoading || !hasRemote}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--color-bg-surface-2)] hover:bg-[var(--color-bg-surface-3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Fetch from remote"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Fetch</span>
        </button>

        <button
          onClick={onPull}
          disabled={isLoading || !hasRemote || behind === 0}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--color-bg-surface-2)] hover:bg-[var(--color-bg-surface-3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={behind > 0 ? `Pull ${behind} commits` : 'Pull from remote'}
        >
          <Download className="w-4 h-4" />
          <span>Pull</span>
          {behind > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-[var(--git-behind)] text-white">
              {behind}
            </span>
          )}
        </button>

        <button
          onClick={onPush}
          disabled={isLoading || !hasRemote || ahead === 0}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={ahead > 0 ? `Push ${ahead} commits` : 'Push to remote'}
        >
          <Upload className="w-4 h-4" />
          <span>Push</span>
          {ahead > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-white/20">
              {ahead}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// Left Navigation Component
interface LeftNavProps {
  activeView: GitView;
  onViewChange: (view: GitView) => void;
  changesCount: number;
}

function LeftNav({ activeView, onViewChange, changesCount }: LeftNavProps) {
  const navItems: { id: GitView; icon: React.ReactNode; label: string; badge?: number }[] = [
    {
      id: 'changes',
      icon: <GitCommit className="w-5 h-5" />,
      label: 'Changes',
      badge: changesCount,
    },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'History' },
    { id: 'branches', icon: <GitBranch className="w-5 h-5" />, label: 'Branches' },
    { id: 'stash', icon: <Package className="w-5 h-5" />, label: 'Stash' },
    { id: 'remotes', icon: <Globe className="w-5 h-5" />, label: 'Remotes' },
  ];

  return (
    <nav className="flex flex-col py-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`
            flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors text-left
            ${
              activeView === item.id
                ? 'bg-[var(--git-panel-item-selected)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--git-panel-item-hover)] hover:text-[var(--color-text-primary)]'
            }
          `}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={`
              ml-auto px-2 py-0.5 text-xs font-bold rounded-full
              ${
                activeView === item.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-surface-3)] text-[var(--color-text-secondary)]'
              }
            `}
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

// Status Bar Component
function StatusBar() {
  const { status, repository, isLoading } = useGit();

  const stagedCount = status?.staged?.length || 0;
  const unstagedCount = (status?.unstaged?.length || 0) + (status?.untracked?.length || 0);
  const isClean = status?.is_clean ?? true;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--git-panel-border)] bg-[var(--git-panel-header)] text-xs">
      <div className="flex items-center gap-4">
        {isLoading ? (
          <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Syncing...
          </span>
        ) : isClean ? (
          <span className="flex items-center gap-2 text-[var(--git-ahead)]">
            <Check className="w-3.5 h-3.5" />
            Working tree clean
          </span>
        ) : (
          <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--git-status-modified)]" />
            {stagedCount} staged, {unstagedCount} changed
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-[var(--color-text-tertiary)]">
        {repository?.path && (
          <span className="truncate max-w-[300px]" title={repository.path}>
            {repository.path}
          </span>
        )}
      </div>
    </div>
  );
}

// Main Content Views
interface MainContentProps {
  activeView: GitView;
  selectedFile: string | null;
  onFileSelect: (path: string | null) => void;
}

function MainContent({ activeView }: MainContentProps) {
  const handleSelectCommit = (sha: string) => {
    console.log('Selected commit:', sha);
  };

  switch (activeView) {
    case 'changes':
      return (
        <div className="flex flex-1 min-h-0">
          {/* Changes list */}
          <div className="w-80 border-r border-[var(--git-panel-border)] flex flex-col">
            <CommitComposer />
            <div className="flex-1 overflow-hidden">
              <ChangesPanel />
            </div>
          </div>
          {/* Diff viewer */}
          <div className="flex-1 min-w-0">
            <DiffViewer diff={null} />
          </div>
        </div>
      );

    case 'history':
      return (
        <div className="flex flex-1 min-h-0">
          <div className="w-96 border-r border-[var(--git-panel-border)]">
            <CommitHistory onSelectCommit={handleSelectCommit} />
          </div>
          <div className="flex-1 min-w-0">
            <DiffViewer diff={null} />
          </div>
        </div>
      );

    case 'branches':
      return <BranchPanel />;

    case 'stash':
      return <StashPanel />;

    case 'remotes':
      return <RemotePanel />;

    default:
      return null;
  }
}

// Main GitLayout Component
export function GitLayout() {
  const {
    repository,
    status,
    isLoading,
    remotes,
    branches,
    pullFromRemote,
    pushToRemote,
    fetchRemote,
  } = useGit();
  const [activeView, setActiveView] = useState<GitView>('changes');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const changesCount = status
    ? (status.staged?.length || 0) +
      (status.unstaged?.length || 0) +
      (status.untracked?.length || 0)
    : 0;

  const currentBranch = branches?.find((b) => b.is_head)?.name || 'main';
  const defaultRemote = remotes?.[0]?.name || 'origin';

  const handleFetch = async () => {
    if (defaultRemote) {
      await fetchRemote(defaultRemote);
    }
  };

  const handlePull = async () => {
    if (defaultRemote && currentBranch) {
      await pullFromRemote(defaultRemote, currentBranch);
    }
  };

  const handlePush = async () => {
    if (defaultRemote && currentBranch) {
      await pushToRemote(defaultRemote, currentBranch);
    }
  };

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--git-panel-bg)]">
      {/* Top Bar */}
      <TopBar onPull={handlePull} onPush={handlePush} onFetch={handleFetch} isLoading={isLoading} />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Navigation */}
        <div className="w-56 border-r border-[var(--git-panel-border)] bg-[var(--color-bg-secondary)]">
          <LeftNav
            activeView={activeView}
            onViewChange={setActiveView}
            changesCount={changesCount}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <MainContent
            activeView={activeView}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
