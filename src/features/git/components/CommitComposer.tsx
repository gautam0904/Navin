import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { AuthorInfo } from './AuthorInfo';
import { CommitMessage } from './CommitMessageInput';

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
      className={`w-full btn-premium ${canCommit ? 'btn-premium-success' : 'btn-premium-secondary'} py-2.5`}
    >
      <Send className="w-4 h-4" />
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
  setError: (error: string) => void
) {
  const [message, setMessage] = useState('');

  const handleCommit = useCallback(async () => {
    setError('');
    try {
      await commit(message, effectiveName, effectiveEmail);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to commit');
    }
  }, [commit, message, effectiveName, effectiveEmail, setError]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleCommit();
      }
    },
    [handleCommit]
  );

  return { message, setMessage, handleCommit, handleKeyDown };
}

// Helper to get display author info
function getDisplayAuthorInfo(config: ReturnType<typeof useGitConfig>) {
  const displayName = config.isGlobalMode ? config.editName : config.localName || config.globalName;
  const displayEmail = config.isGlobalMode
    ? config.editEmail
    : config.localEmail || config.globalEmail;
  return { displayName, displayEmail };
}

// Helper to calculate effective author info
function getEffectiveAuthor(config: ReturnType<typeof useGitConfig>) {
  return {
    effectiveName: config.localName || config.globalName,
    effectiveEmail: config.localEmail || config.globalEmail,
  };
}

export function CommitComposer() {
  const { commit, status, isLoading } = useGit();
  const config = useGitConfig();

  const { effectiveName, effectiveEmail } = getEffectiveAuthor(config);
  const commitHandler = useCommitHandler(commit, effectiveName, effectiveEmail, config.setError);
  const { displayName, displayEmail } = getDisplayAuthorInfo(config);

  const stagedCount = status?.staged.length || 0;
  const canCommit = Boolean(
    stagedCount > 0 && commitHandler.message.trim().length > 0 && effectiveName && effectiveEmail
  );

  return (
    <div className="commit-composer">
      <div className="space-y-4">
        <AuthorInfo
          authorName={displayName}
          authorEmail={displayEmail}
          isGlobal={config.isGlobalMode}
          onNameChange={config.setEditName}
          onEmailChange={config.setEditEmail}
          onScopeChange={config.setIsGlobalMode}
          onSave={config.saveConfig}
        />

        <CommitMessage
          message={commitHandler.message}
          onMessageChange={commitHandler.setMessage}
          onKeyDown={commitHandler.handleKeyDown}
        />

        {config.error && (
          <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[var(--color-error)] text-[var(--color-error)] text-sm animate-scale-in">
            {config.error}
          </div>
        )}

        <CommitButton
          stagedCount={stagedCount}
          canCommit={canCommit}
          isLoading={isLoading}
          onClick={commitHandler.handleCommit}
        />
      </div>
    </div>
  );
}
