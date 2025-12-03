import React, { useState, useEffect } from 'react';
import { Send, Pencil, Check, User, Globe, Laptop } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

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
      <div className="flex flex-col gap-2 bg-[#2a2d2e] p-2 rounded border border-[#3c3c3c]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Edit Identity
          </span>
          <div className="flex bg-[#3c3c3c] rounded p-0.5 ml-auto">
            <button
              onClick={() => onScopeChange(false)}
              className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${!isGlobal ? 'bg-[#007fd4] text-white' : 'text-gray-400 hover:text-white'
                }`}
              title="Local Repository Config"
            >
              <Laptop className="w-3 h-3" /> Local
            </button>
            <button
              onClick={() => onScopeChange(true)}
              className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${isGlobal ? 'bg-[#007fd4] text-white' : 'text-gray-400 hover:text-white'
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
        <div className="flex justify-end mt-1">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-[#007fd4] hover:bg-[#006bb3] text-white text-xs rounded transition-colors"
          >
            <Check className="w-3 h-3" /> Save {isGlobal ? 'Global' : 'Local'} Config
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#2a2d2e] group transition-colors border border-transparent hover:border-[#3c3c3c]">
      <div className="flex items-center gap-2 text-sm text-gray-300 overflow-hidden">
        <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{authorName || 'Anonymous'}</span>
          <span className="text-gray-500 text-xs truncate">&lt;{authorEmail || 'no email'}&gt;</span>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-[#3c3c3c] rounded text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
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
        className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4] focus:border-[#007fd4] resize-none custom-scrollbar"
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

  // State for config values
  const [globalName, setGlobalName] = useState('');
  const [globalEmail, setGlobalEmail] = useState('');
  const [localName, setLocalName] = useState('');
  const [localEmail, setLocalEmail] = useState('');

  // Editing state
  const [isGlobalMode, setIsGlobalMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [error, setError] = useState('');

  // Load git config on mount
  useEffect(() => {
    loadGitConfig();
  }, []);

  // Update edit fields when mode changes or data loads
  useEffect(() => {
    if (isGlobalMode) {
      setEditName(globalName);
      setEditEmail(globalEmail);
    } else {
      // For local mode, default to global if local is empty (inheritance)
      setEditName(localName || globalName);
      setEditEmail(localEmail || globalEmail);
    }
  }, [isGlobalMode, globalName, globalEmail, localName, localEmail]);

  const loadGitConfig = async () => {
    try {
      const { GitService } = await import('../../services/gitService');
      const [gName, gEmail, lName, lEmail] = await GitService.getConfigDetailed();

      setGlobalName(gName);
      setGlobalEmail(gEmail);
      setLocalName(lName);
      setLocalEmail(lEmail);

      // Default to local values for display, falling back to global
      setEditName(lName || gName);
      setEditEmail(lEmail || gEmail);
    } catch (err) {
      console.error('Failed to load git config:', err);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const { GitService } = await import('../../services/gitService');

      await GitService.setConfig(editName, editEmail, isGlobalMode);

      // Reload config to confirm changes
      await loadGitConfig();

      // Clear localStorage legacy keys to avoid confusion
      localStorage.removeItem('git.author.name');
      localStorage.removeItem('git.author.email');
    } catch (err) {
      console.error('Failed to save git config:', err);
      setError('Failed to save git config');
    }
  };

  const stagedCount = status?.staged.length || 0;

  // Effective author is what will be used for the commit
  const effectiveName = localName || globalName;
  const effectiveEmail = localEmail || globalEmail;

  const canCommit = Boolean(
    stagedCount > 0 && message.trim().length > 0 && effectiveName && effectiveEmail
  );

  const handleCommit = async () => {
    if (!canCommit) return;

    setError('');
    try {
      await commit(message, effectiveName, effectiveEmail);
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

  return (
    <div className="bg-[#252526] border-b border-[#333] p-4">
      <div className="space-y-3">
        <AuthorInfo
          authorName={isGlobalMode ? editName : (localName || globalName)}
          authorEmail={isGlobalMode ? editEmail : (localEmail || globalEmail)}
          isGlobal={isGlobalMode}
          onNameChange={setEditName}
          onEmailChange={setEditEmail}
          onScopeChange={setIsGlobalMode}
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
