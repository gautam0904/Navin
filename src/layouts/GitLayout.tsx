import React, { useState } from 'react';
import { RepositoryPicker } from '../features/git';
import { MainContent } from './GitLayoutContent';
import { TopBar } from './GitLayoutTopBar';
import { StatusBar } from './GitLayoutStatusBar';
import { useGit } from '../contexts/GitContext';
import { History, Package, Globe, GitCommit, GitBranch } from 'lucide-react';

type GitView = 'changes' | 'history' | 'branches' | 'stash' | 'remotes';

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
                ? 'bg-[--git-panel-item-selected] text-[--color-primary]'
                : 'text-[--color-text-secondary] hover:bg-[--git-panel-item-hover] hover:text-[--color-text-primary]'
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
                  ? 'bg-[--color-primary] text-white'
                  : 'bg-[--color-bg-surface-3] text-[--color-text-secondary]'
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

// Main GitLayout Component
const useGitActions = () => {
  const { remotes, branches, pullFromRemote, pushToRemote, fetchRemote } = useGit();
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

  return { handleFetch, handlePull, handlePush };
};

export function GitLayout() {
  const { repository, status, isLoading } = useGit();
  const [activeView, setActiveView] = useState<GitView>('changes');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { handleFetch, handlePull, handlePush } = useGitActions();

  const changesCount = status
    ? (status.staged?.length || 0) +
      (status.unstaged?.length || 0) +
      (status.untracked?.length || 0)
    : 0;

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex flex-col h-screen bg-[--git-panel-bg]">
      <TopBar onPull={handlePull} onPush={handlePush} onFetch={handleFetch} isLoading={isLoading} />
      <div className="flex flex-1 min-h-0">
        <div className="w-56 border-r border-[--git-panel-border] bg-[--color-bg-secondary]">
          <LeftNav
            activeView={activeView}
            onViewChange={setActiveView}
            changesCount={changesCount}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <MainContent
            activeView={activeView}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
