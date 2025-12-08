import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { CommitMessage } from './CommitMessageInput';
import { CommitTemplates } from './CommitTemplates';
import { createToast, type Toast } from './Toast';

interface CommitButtonProps {
  stagedCount: number;
  canCommit: boolean;
  isLoading: boolean;
  onClick: () => void;
}

function CommitButton({ stagedCount, canCommit, isLoading, onClick }: CommitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canCommit || isLoading}
      className={`
        w-full py-2 px-3 rounded-md font-semibold text-xs
        flex items-center justify-center gap-2
        transition-all duration-200
        ${canCommit
          ? 'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white shadow-sm hover:shadow'
          : 'bg-[--color-bg-surface-3] text-[--color-text-tertiary] cursor-not-allowed'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Send className="w-3.5 h-3.5" />
      <span>
        {stagedCount === 0
          ? 'No files staged'
          : `Commit ${stagedCount} ${stagedCount === 1 ? 'file' : 'files'}`}
      </span>
    </button>
  );
}

// Custom hook to manage git config state
function useGitConfig() {
  const [globalName, setGlobalName] = useState('');
  const [globalEmail, setGlobalEmail] = useState('');
  const [localName, setLocalName] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [isGlobalMode, setIsGlobalMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [error, setError] = useState('');

  const loadConfig = useCallback(async () => {
    try {
      const { GitService } = await import('@/services/gitService');
      const [gName, gEmail, lName, lEmail] = await GitService.getConfigDetailed();
      setGlobalName(gName);
      setGlobalEmail(gEmail);
      setLocalName(lName);
      setLocalEmail(lEmail);
      setEditName(lName || gName);
      setEditEmail(lEmail || gEmail);
    } catch (err) {
      console.error('Failed to load git config:', err);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    const name = isGlobalMode ? globalName : localName || globalName;
    const email = isGlobalMode ? globalEmail : localEmail || globalEmail;
    setEditName(name);
    setEditEmail(email);
  }, [isGlobalMode, globalName, globalEmail, localName, localEmail]);

  const saveConfig = useCallback(async () => {
    try {
      const { GitService } = await import('@/services/gitService');
      await GitService.setConfig(editName, editEmail, isGlobalMode);
      await loadConfig();
      localStorage.removeItem('git.author.name');
      localStorage.removeItem('git.author.email');
    } catch (err) {
      console.error('Failed to save git config:', err);
      setError('Failed to save git config');
    }
  }, [editName, editEmail, isGlobalMode, loadConfig]);

  return {
    globalName,
    globalEmail,
    localName,
    localEmail,
    isGlobalMode,
    setIsGlobalMode,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    error,
    setError,
    saveConfig,
  };
}

// Hook to manage commit logic
function useCommitHandler(
  commit: (message: string, author: string, email: string) => Promise<void>,
  effectiveName: string,
  effectiveEmail: string,
  setError: (error: string) => void,
  onToast?: (toast: Toast) => void
) {
  const [message, setMessage] = useState('');

  const handleCommit = useCallback(async () => {
    setError('');
    try {
      await commit(message, effectiveName, effectiveEmail);
      setMessage('');
      onToast?.(createToast('Changes committed successfully', 'success'));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to commit';
      setError(errorMsg);
      onToast?.(createToast(`Commit failed: ${errorMsg}`, 'error'));
    }
  }, [commit, message, effectiveName, effectiveEmail, setError, onToast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleCommit();
      }
    },
    [handleCommit]
  );

  const handleTemplateSelect = useCallback((template: string) => {
    setMessage(template);
  }, []);

  return { message, setMessage, handleCommit, handleKeyDown, handleTemplateSelect };
}

// Helper to calculate effective author info
function getEffectiveAuthor(config: ReturnType<typeof useGitConfig>) {
  return {
    effectiveName: config.localName || config.globalName,
    effectiveEmail: config.localEmail || config.globalEmail,
  };
}

interface CommitComposerProps {
  onToast?: (toast: Toast) => void;
}

function useCommitStats(status: ReturnType<typeof useGit>['status']) {
  if (!status) return { totalFiles: 0, totalAdditions: 0, totalDeletions: 0, stagedCount: 0 };

  const allFiles = [...(status.staged || []), ...(status.unstaged || []), ...(status.untracked || [])];
  const totalFiles = allFiles.length;
  const totalAdditions = allFiles.reduce((sum, f) => sum + (f.additions ?? 0), 0);
  const totalDeletions = allFiles.reduce((sum, f) => sum + (f.deletions ?? 0), 0);
  const stagedCount = status.staged?.length || 0;

  return { totalFiles, totalAdditions, totalDeletions, stagedCount };
}

export function CommitComposer({ onToast }: CommitComposerProps = {}) {
  const { commit, status, isLoading } = useGit();
  const config = useGitConfig();
  const { effectiveName, effectiveEmail } = getEffectiveAuthor(config);
  const commitHandler = useCommitHandler(commit, effectiveName, effectiveEmail, config.setError, onToast);
  const { totalFiles, totalAdditions, totalDeletions, stagedCount } = useCommitStats(status);

  const canCommit = Boolean(
    stagedCount > 0 && commitHandler.message.trim().length > 0 && effectiveName && effectiveEmail
  );

  return (
    <div className="commit-composer p-2 border-b border-[--git-panel-border] bg-[--git-panel-header]">
      <div className="space-y-1.5">
        <CommitMessage
          message={commitHandler.message}
          onMessageChange={commitHandler.setMessage}
          onKeyDown={commitHandler.handleKeyDown}
        />

        <div className="flex items-center gap-2">
          <CommitTemplates onSelectTemplate={commitHandler.handleTemplateSelect} />
          <div className="flex items-center gap-1.5 text-[10px]">
            <button
              onClick={() => { }}
              className="flex items-center gap-1 px-1.5 py-0.5 text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors"
              title="Conventional commit format"
            >
              <span>🔒</span>
              <span>Conventional</span>
            </button>
          </div>
        </div>

        {totalFiles > 0 && (
          <div className="flex items-center gap-2 text-[10px] text-[--color-text-tertiary]">
            <span>
              {totalFiles} {totalFiles === 1 ? 'file' : 'files'} changed
            </span>
            <span className="text-[--git-status-added]">+{totalAdditions}</span>
            <span className="text-[--git-status-deleted]">-{totalDeletions}</span>
            {stagedCount > 0 && (
              <>
                <span>•</span>
                <span>{stagedCount} staged</span>
              </>
            )}
          </div>
        )}

        {config.error && (
          <div className="p-1.5 rounded bg-[rgba(239,68,68,0.1)] border border-[--color-error] text-[--color-error] text-[10px]">
            {config.error}
          </div>
        )}

        <div className="flex items-center gap-2">
          <CommitButton
            stagedCount={stagedCount}
            canCommit={canCommit}
            isLoading={isLoading}
            onClick={commitHandler.handleCommit}
          />
          <button
            onClick={() => {
              // Open commit drawer - this will be handled by parent
              window.dispatchEvent(new CustomEvent('open-commit-drawer'));
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] transition-colors text-[--color-text-secondary] hover:text-[--color-text-primary]"
            title="Open commit drawer"
          >
            Open Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
