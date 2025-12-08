import React, { useState, useMemo, useCallback } from 'react';
import { RepositoryPicker, GitWorkspace } from '../features/git';
import { MainContent } from './GitLayoutContent';
import { TopBar } from './GitLayoutTopBar';
import { StatusBar } from './GitLayoutStatusBar';
import { GitAppHeader } from './GitAppHeader';
import { CommitDrawer } from '../features/git/components/CommitDrawer';
import { RecentReposList } from '../features/git/components/RecentReposList';
import { ReviewModeToggle } from '../features/git/components/ReviewModeToggle';
import { useGit } from '../contexts/GitContext';
import { History, Package, Globe, GitCommit, GitBranch, Maximize2, Minimize2 } from 'lucide-react';
import { ToastContainer, type Toast } from '../features/git/components/Toast';

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
    <nav className="flex flex-col py-3 px-2 gap-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
            ${
              activeView === item.id
                ? 'bg-[--git-panel-item-selected] text-[--color-primary] font-semibold'
                : 'text-[--color-text-secondary] hover:bg-[--git-panel-item-hover] hover:text-[--color-text-primary]'
            }
          `}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="font-medium flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={`
              ml-auto px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] text-center
              ${
                activeView === item.id
                  ? 'bg-[--color-primary] text-white'
                  : 'bg-[--color-bg-surface-3] text-[--color-text-primary]'
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

// Distraction-free mode toolbar component to reduce complexity
interface DistractionFreeToggleProps {
  isDistractionFree: boolean;
  isReviewMode: boolean;
  onToggleDistractionFree: (value: boolean) => void;
  onToggleReviewMode: (value: boolean) => void;
}

function DistractionFreeToolbar({
  isDistractionFree,
  isReviewMode,
  onToggleDistractionFree,
  onToggleReviewMode,
}: DistractionFreeToggleProps) {
  if (isDistractionFree) {
    return (
      <div className="px-3 py-2 border-b border-[--git-panel-border] bg-[--git-panel-header] flex items-center justify-end">
        <button
          onClick={() => onToggleDistractionFree(false)}
          className="p-1.5 rounded hover:bg-[--color-bg-surface-2] transition-colors"
          title="Exit distraction-free mode"
        >
          <Minimize2 className="w-4 h-4 text-[--color-text-secondary]" />
        </button>
      </div>
    );
  }
  return (
    <div className="px-3 py-2 border-b border-[--git-panel-border] bg-[--git-panel-header] flex items-center justify-between">
      <ReviewModeToggle isReviewMode={isReviewMode} onToggle={onToggleReviewMode} />
      <button
        onClick={() => onToggleDistractionFree(true)}
        className="p-1.5 rounded hover:bg-[--color-bg-surface-2] transition-colors"
        title="Distraction-free mode"
      >
        <Maximize2 className="w-4 h-4 text-[--color-text-secondary]" />
      </button>
    </div>
  );
}

export function GitLayout() {
  const { repository, status, isLoading } = useGit();
  const [activeView, setActiveView] = useState<GitView>('changes');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommitDrawerOpen, setIsCommitDrawerOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const { handleFetch, handlePull, handlePush } = useGitActions();

  const changesCount = useMemo(() => {
    if (!status) return 0;
    return (
      (status.staged?.length || 0) +
      (status.unstaged?.length || 0) +
      (status.untracked?.length || 0)
    );
  }, [status]);

  const handleToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  const handleCloseToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex flex-col h-screen bg-[--git-panel-bg]">
      <GitAppHeader currentFilePath={selectedFile} />
      <TopBar onPull={handlePull} onPush={handlePush} onFetch={handleFetch} isLoading={isLoading} />
      <div className="flex flex-1 min-h-0">
        {!isDistractionFree && (
          <div className="w-56 border-r border-[--git-panel-border] bg-[--color-bg-secondary] flex flex-col">
            <LeftNav
              activeView={activeView}
              onViewChange={setActiveView}
              changesCount={changesCount}
            />
            <div className="mt-auto">
              <RecentReposList />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <DistractionFreeToolbar
            isDistractionFree={isDistractionFree}
            isReviewMode={isReviewMode}
            onToggleDistractionFree={setIsDistractionFree}
            onToggleReviewMode={setIsReviewMode}
          />
          {activeView === 'changes' ? (
            <GitWorkspace onToast={handleToast} />
          ) : (
            <MainContent
              activeView={activeView}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onToast={handleToast}
              isReviewMode={isReviewMode}
            />
          )}
        </div>
      </div>
      <StatusBar />
      <CommitDrawer
        isOpen={isCommitDrawerOpen}
        onClose={() => setIsCommitDrawerOpen(false)}
        onToast={handleToast}
      />
      <ToastContainer toasts={toasts} onClose={handleCloseToast} />
    </div>
  );
}
