import React, { useState, useEffect } from 'react';
import { Send, Pencil, Check, User } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

interface AuthorInfoProps {
  authorName: string;
  authorEmail: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onSave: () => void;
}

function AuthorInfo({ authorName, authorEmail, onNameChange, onEmailChange, onSave }: AuthorInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave();
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-start">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <input
            type="text"
            value={authorName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            className="px-3 py-1.5 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4] focus:border-[#007fd4]"
          />
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="px-3 py-1.5 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4] focus:border-[#007fd4]"
          />
        </div>
        <button
          onClick={handleSave}
          className="p-1.5 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white transition-colors"
          title="Save Config"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#2a2d2e] group transition-colors">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <User className="w-3.5 h-3.5 text-gray-500" />
        <span className="font-medium">{authorName || 'Anonymous'}</span>
        <span className="text-gray-500 text-xs">&lt;{authorEmail || 'no email'}&gt;</span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-[#3c3c3c] rounded text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        title="Edit Author"
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
        className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4] focus:border-[#007fd4] resize-none"
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

  // Load git config only once on mount
  useEffect(() => {
    const loadGitConfig = async () => {
      // If we already have values from localStorage, don't overwrite them immediately
      // unless we want to sync with git config. But for now let's respect localStorage
      // or just load if empty.
      if (authorName && authorEmail) return;

      try {
        const { GitService } = await import('../../services/gitService');
        const [name, email] = await GitService.getConfig();
        if (!authorName && name) setAuthorName(name);
        if (!authorEmail && email) setAuthorEmail(email);
      } catch (err) {
        console.error('Failed to load git config:', err);
      }
    };

    loadGitConfig();
  }, []); // Empty dependency array ensures it runs only once

  const handleSaveConfig = async () => {
    try {
      const { GitService } = await import('../../services/gitService');
      // We'll implement setConfig in GitService next
      if (GitService.setConfig) {
        await GitService.setConfig(authorName, authorEmail);
      }
      localStorage.setItem('git.author.name', authorName);
      localStorage.setItem('git.author.email', authorEmail);
    } catch (err) {
      console.error('Failed to save git config:', err);
      setError('Failed to save git config');
    }
  };

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

  // Always show the composer so user can edit author info
  // if (stagedCount === 0) {
  //   return <EmptyCommitState />;
  // }

  return (
    <div className="bg-[#252526] border-b border-[#333] p-4">
      <div className="space-y-3">
        <AuthorInfo
          authorName={authorName}
          authorEmail={authorEmail}
          onNameChange={setAuthorName}
          onEmailChange={setAuthorEmail}
          onSave={handleSaveConfig}
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
