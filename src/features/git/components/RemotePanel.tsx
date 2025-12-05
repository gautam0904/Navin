import { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check,
  Link2,
  CloudOff,
} from 'lucide-react';
import { useGit } from '@/contexts/GitContext';

interface Remote {
  name: string;
  url: string;
}

function EmptyRemotesState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <CloudOff className="w-10 h-10" />
      </div>
      <h3 className="empty-state-title">No remotes configured</h3>
      <p className="empty-state-description">Add a remote repository to push and pull changes</p>
    </div>
  );
}

interface RemoteCardProps {
  remote: Remote;
  currentBranch: string;
  isLoading: boolean;
  onFetch: () => void;
  onPull: () => void;
  onPush: () => void;
  onRemove: () => void;
}

function RemoteCard({
  remote,
  currentBranch,
  isLoading,
  onFetch,
  onPull,
  onPush,
  onRemove,
}: RemoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(remote.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="premium-card animate-fade-in">
      {/* Header */}
      <div className="premium-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {remote.name}
              </h3>
              <span className="text-xs text-[var(--color-text-tertiary)]">Remote repository</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onFetch}
              disabled={isLoading}
              className={`btn-premium btn-premium-ghost btn-premium-icon ${isLoading ? 'animate-spin' : ''}`}
              title="Fetch from remote"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="btn-premium btn-premium-ghost btn-premium-icon text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]"
              title="Remove remote"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* URL */}
      <div className="premium-card-body py-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-bg-surface-2)] group">
          <Link2 className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] shrink-0" />
          <span className="text-xs text-[var(--color-text-secondary)] font-mono truncate flex-1">
            {remote.url}
          </span>
          <button
            onClick={handleCopyUrl}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--color-bg-surface-3)] rounded"
            title="Copy URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="premium-card-footer p-0">
        <div className="flex divide-x divide-[var(--color-border-light)]">
          <button
            onClick={onPull}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-2)] transition-colors"
            title={`Pull ${currentBranch} from ${remote.name}`}
          >
            <Download className="w-3.5 h-3.5" />
            Pull
          </button>
          <button
            onClick={onPush}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-2)] transition-colors"
            title={`Push ${currentBranch} to ${remote.name}`}
          >
            <Upload className="w-3.5 h-3.5" />
            Push
          </button>
        </div>
      </div>
    </div>
  );
}

interface AddRemoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, url: string) => Promise<void>;
}

function AddRemoteForm({ isOpen, onClose, onSubmit }: AddRemoteFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim()) return;
    setIsSubmitting(true);
    await onSubmit(name.trim(), url.trim());
    setName('');
    setUrl('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="p-4 bg-[var(--color-bg-surface-2)] border-b border-[var(--color-border-light)] animate-slide-in">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
          Add Remote Repository
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Remote name (e.g., origin)"
          className="input-premium"
          autoFocus
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Remote URL (https://... or git@...)"
          className="input-premium"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-premium btn-premium-ghost btn-premium-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !url.trim() || isSubmitting}
            className="btn-premium btn-premium-primary btn-premium-sm"
          >
            {isSubmitting ? 'Adding...' : 'Add Remote'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RemotePanel() {
  const {
    remotes,
    refreshRemotes,
    addRemote,
    removeRemote,
    fetchRemote,
    pushToRemote,
    pullFromRemote,
    branches,
  } = useGit();
  const [isAdding, setIsAdding] = useState(false);
  const [loadingRemote, setLoadingRemote] = useState<string | null>(null);

  useEffect(() => {
    refreshRemotes();
  }, [refreshRemotes]);

  const handleAddRemote = async (name: string, url: string) => {
    await addRemote(name, url);
  };

  const handleFetch = async (remoteName: string) => {
    setLoadingRemote(remoteName);
    await fetchRemote(remoteName);
    setLoadingRemote(null);
  };

  const currentBranch = branches?.find((b) => b.is_head)?.name || 'main';

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="section-header">
        <div className="section-header-title">
          <Globe className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Remotes</span>
          {remotes && remotes.length > 0 && (
            <span className="section-header-count">{remotes.length}</span>
          )}
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-premium btn-premium-ghost btn-premium-icon"
          title="Add remote"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Form */}
      <AddRemoteForm
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSubmit={handleAddRemote}
      />

      {/* Remote List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {!remotes || remotes.length === 0 ? (
          <EmptyRemotesState />
        ) : (
          remotes.map((remote) => (
            <RemoteCard
              key={remote.name}
              remote={remote}
              currentBranch={currentBranch}
              isLoading={loadingRemote === remote.name}
              onFetch={() => handleFetch(remote.name)}
              onPull={() => pullFromRemote(remote.name, currentBranch)}
              onPush={() => pushToRemote(remote.name, currentBranch)}
              onRemove={() => removeRemote(remote.name)}
            />
          ))
        )}
      </div>
    </div>
  );
}
