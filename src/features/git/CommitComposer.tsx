import React, { useState, useEffect, useCallback } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

function EmptyCommitState() {
  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 text-gray-500 text-center">
      <AlertCircle className="w-5 h-5 mx-auto mb-2" />
      <p className="text-sm">Stage some changes to commit</p>
    </div>
  );
}

interface AuthorInfoProps {
  authorName: string;
  authorEmail: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

function AuthorInfo({ authorName, authorEmail, onNameChange, onEmailChange }: AuthorInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="text"
        value={authorName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Your name"
        className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        value={authorEmail}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="your@email.com"
        className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <p className="text-xs text-gray-500 mt-1">{message.length}/72 characters (first line)</p>
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
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
    >
      <Send className="w-4 h-4" />
      <span>
        Commit {stagedCount} {stagedCount === 1 ? 'file' : 'files'}
      </span>
    </button>
  );
}

export function CommitComposer() {
  const { commit, status, isLoading } = useGit();
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState(localStorage.getItem('git.author.name') || '');
  const [authorEmail, setAuthorEmail] = useState(localStorage.getItem('git.author.email') || '');
  const [error, setError] = useState('');

  const loadGitConfig = useCallback(async () => {
    if (authorName && authorEmail) return;

    try {
      const { GitService } = await import('../../services/gitService');
      const [name, email] = await GitService.getConfig();
      if (!authorName && name) setAuthorName(name);
      if (!authorEmail && email) setAuthorEmail(email);
    } catch (err) {
      console.error('Failed to load git config:', err);
    }
  }, [authorName, authorEmail]);

  useEffect(() => {
    loadGitConfig();
  }, [loadGitConfig]);

  const stagedCount = status?.staged.length || 0;
  const canCommit = Boolean(
    stagedCount > 0 && message.trim().length > 0 && authorName && authorEmail
  );

  const handleCommit = async () => {
    if (!canCommit) return;

    setError('');
    try {
      localStorage.setItem('git.author.name', authorName);
      localStorage.setItem('git.author.email', authorEmail);
      await commit(message, authorName, authorEmail);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to commit');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleCommit();
    }
  };

  if (stagedCount === 0) {
    return <EmptyCommitState />;
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="space-y-3">
        <AuthorInfo
          authorName={authorName}
          authorEmail={authorEmail}
          onNameChange={setAuthorName}
          onEmailChange={setAuthorEmail}
        />
        <CommitMessage message={message} onMessageChange={setMessage} onKeyDown={handleKeyDown} />
        {error && (
          <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        <CommitButton
          stagedCount={stagedCount}
          canCommit={canCommit}
          isLoading={isLoading}
          onClick={handleCommit}
        />
      </div>
    </div>
  );
}
