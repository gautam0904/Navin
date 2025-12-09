import { useState, useCallback } from 'react';
import { RepositoryPicker, GitWorkspace } from '../features/git';
import { MainContent } from './GitLayoutContent';
import { TopBar } from './GitLayoutTopBar';
import { StatusBar } from './GitLayoutStatusBar';
import { GitAppHeader } from './GitAppHeader';
import { CommitDrawer } from '../features/git/components/CommitDrawer';
import { ReviewModeToggle } from '../features/git/components/ReviewModeToggle';
import { useGit } from '../contexts/GitContext';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ToastContainer, type Toast } from '../features/git/components/Toast';

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
  const { repository, isLoading, activeView, selectedFile, setSelectedFile } = useGit();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommitDrawerOpen, setIsCommitDrawerOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const { handleFetch, handlePull, handlePush } = useGitActions();

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
            (() => {
              const allowed = ['history', 'branches', 'stash', 'remotes'] as const;
              const view = (allowed as readonly string[]).includes(activeView)
                ? (activeView as 'history' | 'branches' | 'stash' | 'remotes')
                : 'history';
              return (
                <MainContent
                  activeView={view}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onToast={handleToast}
                  isReviewMode={isReviewMode}
                />
              );
            })()
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
