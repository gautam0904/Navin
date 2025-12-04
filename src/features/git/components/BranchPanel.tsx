/* eslint-disable complexity */
import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Trash2,
  ArrowDownCircle,
  GitMerge,
  Search,
  Check,
  ArrowUpCircle,
} from 'lucide-react';
import { useGit } from '@/contexts/GitContext';

export function BranchPanel() {
  const { branches, checkoutBranch, createBranch, deleteBranch, isLoading } = useGit();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!branches) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-sm text-[var(--color-text-tertiary)]">Loading branches...</p>
      </div>
    );
  }

  const currentBranch = branches.find((b) => b.is_head);
  const localBranches = branches.filter((b) => !b.is_remote);
  const remoteBranches = branches.filter((b) => b.is_remote);

  const filteredLocal = localBranches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRemote = remoteBranches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    try {
      await createBranch(newBranchName.trim());
      setNewBranchName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create branch:', err);
    }
  };

  const handleDeleteBranch = async (name: string) => {
    try {
      await deleteBranch(name);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete branch:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Branches</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-1.5 rounded hover:bg-[var(--color-bg-surface-2)] transition-colors"
          title="New Branch"
        >
          <Plus className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        </button>
      </div>

      {/* Current branch info */}
      {currentBranch && (
        <div className="px-4 py-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-item-selected)]">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-[var(--git-branch-current)]" />
            <span className="text-sm font-semibold text-[var(--git-branch-current)]">
              {currentBranch.name}
            </span>
          </div>
          {(currentBranch.ahead > 0 || currentBranch.behind > 0) && (
            <div className="flex items-center gap-3 ml-6 text-xs">
              {currentBranch.behind > 0 && (
                <span className="flex items-center gap-1 text-[var(--git-behind)]">
                  <ArrowDownCircle className="w-3 h-3" />
                  {currentBranch.behind} commits behind
                </span>
              )}
              {currentBranch.ahead > 0 && (
                <span className="flex items-center gap-1 text-[var(--git-ahead)]">
                  <ArrowUpCircle className="w-3 h-3" />
                  {currentBranch.ahead} commits ahead
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create branch form */}
      {showCreateForm && (
        <div className="px-4 py-3 bg-[var(--color-bg-surface-2)] border-b border-[var(--git-panel-border)]">
          <div className="space-y-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBranch()}
              placeholder="New branch name"
              className="w-full px-3 py-2 text-sm rounded border border-[var(--git-panel-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 text-xs rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-3)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                disabled={!newBranchName.trim() || isLoading}
                className="px-3 py-1.5 text-xs rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white disabled:opacity-50"
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="px-4 py-3 bg-[var(--git-status-deleted-bg)] border-b border-[var(--git-status-deleted)]">
          <div className="flex items-start gap-2">
            <Trash2 className="w-4 h-4 text-[var(--git-status-deleted)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[var(--color-text-primary)] mb-2">
                Delete branch <span className="font-mono font-semibold">{deleteConfirm}</span>?
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-2 py-1 text-xs rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-2)]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBranch(deleteConfirm)}
                  className="px-2 py-1 text-xs rounded bg-[var(--git-status-deleted)] text-white hover:brightness-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-2 border-b border-[var(--git-panel-border)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter branches"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[var(--git-panel-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Branch list */}
      <div className="flex-1 overflow-y-auto">
        {/* Local branches */}
        <div>
          <div className="px-4 py-2 flex items-center gap-2 bg-[var(--git-panel-header)] sticky top-0 z-10">
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Local
            </h3>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-bg-surface-3)] text-[var(--color-text-tertiary)]">
              {filteredLocal.length}
            </span>
          </div>

          {filteredLocal.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[var(--color-text-tertiary)] text-center">
              No local branches found
            </div>
          ) : (
            filteredLocal.map((branch) => (
              <div
                key={branch.name}
                onClick={() => !branch.is_head && checkoutBranch(branch.name)}
                className={`
                  group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors
                  ${
                    branch.is_head
                      ? 'bg-[var(--git-panel-item-selected)] border-l-2 border-[var(--git-branch-current)]'
                      : 'hover:bg-[var(--git-panel-item-hover)] border-l-2 border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GitBranch
                    className={`w-3.5 h-3.5 shrink-0 ${branch.is_head ? 'text-[var(--git-branch-current)]' : 'text-[var(--color-text-tertiary)]'}`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm truncate ${branch.is_head ? 'font-semibold text-[var(--git-branch-current)]' : 'text-[var(--color-text-primary)]'}`}
                      >
                        {branch.name}
                      </span>
                      {branch.is_head && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[var(--git-branch-current)] text-white">
                          CURRENT
                        </span>
                      )}
                    </div>
                    {branch.upstream && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-tertiary)]">
                        <GitMerge className="w-3 h-3" />
                        <span className="truncate">{branch.upstream}</span>
                        <div className="flex items-center gap-1">
                          {branch.ahead > 0 && (
                            <span className="text-[var(--git-ahead)]">↑{branch.ahead}</span>
                          )}
                          {branch.behind > 0 && (
                            <span className="text-[var(--git-behind)]">↓{branch.behind}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!branch.is_head && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(branch.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-[var(--git-status-deleted-bg)] transition-all"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[var(--git-status-deleted)]" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Remote branches */}
        {filteredRemote.length > 0 && (
          <div className="mt-2">
            <div className="px-4 py-2 flex items-center gap-2 bg-[var(--git-panel-header)] sticky top-0 z-10">
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Remote
              </h3>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-bg-surface-3)] text-[var(--color-text-tertiary)]">
                {filteredRemote.length}
              </span>
            </div>
            {filteredRemote.map((branch) => (
              <div
                key={branch.name}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--git-panel-item-hover)] cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5 shrink-0 text-[var(--git-branch-remote)]" />
                <span className="text-sm text-[var(--color-text-primary)] truncate">
                  {branch.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
