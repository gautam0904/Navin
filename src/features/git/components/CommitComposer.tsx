import React, { useState, useEffect, useCallback } from 'react';
import { Send, Pencil, Check, User, Globe, Laptop } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';

interface AuthorInfoProps {
  authorName: string;
  authorEmail: string;
  isGlobal: boolean;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onScopeChange: (global: boolean) => void;
  onSave: () => void;
}

function AuthorInfo({
  authorName,
  authorEmail,
  isGlobal,
  onNameChange,
  onEmailChange,
  onScopeChange,
  onSave,
}: AuthorInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave();
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 bg-[var(--color-bg-surface-2)] p-2 rounded border border-[var(--git-panel-border)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">
            Edit Identity
          </span>
          <div className="flex bg-[var(--color-bg-primary)] rounded p-0.5 ml-auto">
            <button
              onClick={() => onScopeChange(false)}
              className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${
                !isGlobal
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Local Repository Config"
            >
              <Laptop className="w-3 h-3" /> Local
            </button>
            <button
              onClick={() => onScopeChange(true)}
              className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${
                isGlobal
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Global User Config"
            >
              <Globe className="w-3 h-3" /> Global
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            className="px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--git-panel-border)] rounded text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--git-panel-border)] rounded text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
        </div>
        <div className="flex justify-end mt-1">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs rounded transition-colors"
          >
            <Check className="w-3 h-3" /> Save {isGlobal ? 'Global' : 'Local'} Config
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[var(--color-bg-surface-2)] group transition-colors border border-transparent hover:border-[var(--git-panel-border)]">
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] overflow-hidden">
        <User className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] shrink-0" />
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{authorName || 'Anonymous'}</span>
          <span className="text-[var(--color-text-tertiary)] text-xs truncate">
            &lt;{authorEmail || 'no email'}&gt;
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-[var(--color-bg-surface-3)] rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-all"
        title="Edit Author Configuration"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface CommitMessageProps {
  message: string;
  onMessageChange: (message: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function CommitMessage({ message, onMessageChange, onKeyDown }: CommitMessageProps) {
  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Commit message (Ctrl+Enter to commit)"
        rows={3}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--git-panel-border)] rounded text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] resize-none custom-scrollbar"
      />
      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
        {message.length}/72 characters (first line)
      </p>
    </div>
  );
}

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
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:bg-[var(--color-bg-surface-3)] disabled:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed text-white rounded transition-colors"
    >
      <Send className="w-4 h-4" />
      <span>
        Commit {stagedCount} {stagedCount === 1 ? 'file' : 'files'}
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
    <div className="bg-[var(--git-panel-header)] border-b border-[var(--git-panel-border)] p-4">
      <div className="space-y-3">
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
          <div className="p-2 bg-[var(--git-status-deleted-bg)] border border-[var(--git-status-deleted)] rounded text-[var(--git-status-deleted)] text-sm">
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
