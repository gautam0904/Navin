import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Download, Upload, RefreshCw } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';

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
  const [newRemoteName, setNewRemoteName] = useState('');
  const [newRemoteUrl, setNewRemoteUrl] = useState('');
  const [loadingRemote, setLoadingRemote] = useState<string | null>(null);

  useEffect(() => {
    refreshRemotes();
  }, [refreshRemotes]);

  const handleAddRemote = async () => {
    if (!newRemoteName || !newRemoteUrl) return;
    await addRemote(newRemoteName, newRemoteUrl);
    setIsAdding(false);
    setNewRemoteName('');
    setNewRemoteUrl('');
  };

  const handleFetch = async (remote: string) => {
    setLoadingRemote(remote);
    await fetchRemote(remote);
    setLoadingRemote(null);
  };

  const currentBranch = branches?.find((b) => b.is_head)?.name || 'main';

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] text-[var(--color-text-primary)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text-secondary)]">
          Remotes
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-[var(--color-bg-surface-2)] rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          title="Add Remote"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 bg-[var(--color-bg-surface-2)] border-b border-[var(--git-panel-border)] space-y-2">
          <input
            type="text"
            value={newRemoteName}
            onChange={(e) => setNewRemoteName(e.target.value)}
            placeholder="Remote name (e.g. origin)"
            className="w-full px-2 py-1 bg-[var(--color-bg-primary)] border border-[var(--git-panel-border)] rounded text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <input
            type="text"
            value={newRemoteUrl}
            onChange={(e) => setNewRemoteUrl(e.target.value)}
            placeholder="Remote URL"
            className="w-full px-2 py-1 bg-[var(--color-bg-primary)] border border-[var(--git-panel-border)] rounded text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRemote}
              className="px-2 py-1 bg-[var(--color-primary)] text-white text-xs rounded hover:bg-[var(--color-primary-dark)]"
            >
              Add Remote
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {!remotes || remotes.length === 0 ? (
          <div className="text-center text-[var(--color-text-tertiary)] py-4 text-sm">
            No remotes configured
          </div>
        ) : (
          remotes.map((remote) => (
            <div
              key={remote.name}
              className="bg-[var(--color-bg-surface-1)] rounded border border-[var(--git-panel-border)] overflow-hidden"
            >
              <div className="flex items-center justify-between p-2 bg-[var(--git-panel-header)]">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                  <span className="font-medium text-sm text-[var(--color-text-primary)]">
                    {remote.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFetch(remote.name)}
                    disabled={loadingRemote === remote.name}
                    className={`p-1 hover:bg-[var(--color-bg-surface-3)] rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] ${loadingRemote === remote.name ? 'animate-spin' : ''}`}
                    title="Fetch"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeRemote(remote.name)}
                    className="p-1 hover:bg-[var(--color-bg-surface-3)] rounded text-[var(--color-text-tertiary)] hover:text-[var(--git-status-deleted)]"
                    title="Remove Remote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2 text-xs text-[var(--color-text-tertiary)] border-b border-[var(--git-panel-border)] break-all">
                {remote.url}
              </div>

              <div className="flex divide-x divide-[var(--git-panel-border)]">
                <button
                  onClick={() => pullFromRemote(remote.name, currentBranch)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[var(--git-panel-item-hover)] transition-colors text-xs text-[var(--color-text-secondary)]"
                  title={`Pull ${currentBranch} from ${remote.name}`}
                >
                  <Download className="w-3 h-3" /> Pull
                </button>
                <button
                  onClick={() => pushToRemote(remote.name, currentBranch)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[var(--git-panel-item-hover)] transition-colors text-xs text-[var(--color-text-secondary)]"
                  title={`Push ${currentBranch} to ${remote.name}`}
                >
                  <Upload className="w-3 h-3" /> Push
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
