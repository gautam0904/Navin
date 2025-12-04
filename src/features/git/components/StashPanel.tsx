import React, { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Play, Upload } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';

export function StashPanel() {
  const { stashes, refreshStashes, createStash, applyStash, popStash, dropStash } = useGit();
  const [isAdding, setIsAdding] = useState(false);
  const [stashMessage, setStashMessage] = useState('');

  useEffect(() => {
    refreshStashes();
  }, [refreshStashes]);

  const handleCreateStash = async () => {
    await createStash(stashMessage || undefined);
    setIsAdding(false);
    setStashMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] text-[var(--color-text-primary)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text-secondary)]">
          Stashes
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-[var(--color-bg-surface-2)] rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          title="Stash Changes"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 bg-[var(--color-bg-surface-2)] border-b border-[var(--git-panel-border)] space-y-2">
          <input
            type="text"
            value={stashMessage}
            onChange={(e) => setStashMessage(e.target.value)}
            placeholder="Stash message (optional)"
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
              onClick={handleCreateStash}
              className="px-2 py-1 bg-[var(--color-primary)] text-white text-xs rounded hover:bg-[var(--color-primary-dark)]"
            >
              Stash
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {!stashes || stashes.length === 0 ? (
          <div className="text-center text-[var(--color-text-tertiary)] py-4 text-sm">
            No stashes found
          </div>
        ) : (
          stashes.map((stash, index) => (
            <div
              key={index}
              className="bg-[var(--color-bg-surface-1)] rounded border border-[var(--git-panel-border)] overflow-hidden group"
            >
              <div className="p-2 border-b border-[var(--git-panel-border)] flex items-start gap-2">
                <Archive className="w-4 h-4 text-[var(--color-text-tertiary)] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-[var(--color-text-primary)]">
                    {stash.message || `Stash@{${index}}`}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">{stash.branch}</div>
                </div>
              </div>

              <div className="flex divide-x divide-[var(--git-panel-border)]">
                <button
                  onClick={() => applyStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[var(--git-panel-item-hover)] transition-colors text-xs text-[var(--color-text-secondary)]"
                  title="Apply Stash"
                >
                  <Play className="w-3 h-3" /> Apply
                </button>
                <button
                  onClick={() => popStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[var(--git-panel-item-hover)] transition-colors text-xs text-[var(--color-text-secondary)]"
                  title="Pop Stash"
                >
                  <Upload className="w-3 h-3" /> Pop
                </button>
                <button
                  onClick={() => dropStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[var(--git-panel-item-hover)] transition-colors text-xs hover:text-[var(--git-status-deleted)] text-[var(--color-text-secondary)]"
                  title="Drop Stash"
                >
                  <Trash2 className="w-3 h-3" /> Drop
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
