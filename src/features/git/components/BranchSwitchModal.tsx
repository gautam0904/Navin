import { useState, useMemo } from 'react';
import { X, GitBranch, Plus, Search, Check } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { GitService } from '@/services/gitService';

interface Branch {
  name: string;
  is_remote: boolean;
  is_head: boolean;
}

interface BranchItemProps {
  branch: Branch;
  onSwitch: (name: string) => void;
  isRemote?: boolean;
}

function BranchItem({ branch, onSwitch, isRemote = false }: BranchItemProps) {
  if (isRemote) {
    return (
      <button
        onClick={() => onSwitch(branch.name)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-[--color-bg-surface-2] transition-colors text-[--color-text-primary]"
      >
        <GitBranch className="w-3.5 h-3.5 text-[--color-text-tertiary]" />
        <span className="text-sm">{branch.name}</span>
      </button>
    );
  }
  return (
    <button
      onClick={() => onSwitch(branch.name)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
        branch.is_head
          ? 'bg-[--color-primary]/10 text-[--color-primary]'
          : 'hover:bg-[--color-bg-surface-2] text-[--color-text-primary]'
      }`}
    >
      <div className="flex items-center gap-2">
        <GitBranch className="w-3.5 h-3.5" />
        <span className="text-sm font-medium">{branch.name}</span>
      </div>
      {branch.is_head && <Check className="w-4 h-4" />}
    </button>
  );
}

function useBranchFilters(branches: Branch[] | null | undefined, searchQuery: string) {
  return useMemo(() => {
    const local = branches?.filter((b) => !b.is_remote) || [];
    const remote = branches?.filter((b) => b.is_remote) || [];
    const query = searchQuery.toLowerCase();
    return {
      localBranches: local,
      remoteBranches: remote,
      recentBranches: local.slice(0, 5),
      filteredLocalBranches: local.filter((b) => b.name.toLowerCase().includes(query)),
      filteredRemoteBranches: remote.filter((b) => b.name.toLowerCase().includes(query)),
    };
  }, [branches, searchQuery]);
}

interface BranchSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BranchSwitchModal({ isOpen, onClose }: BranchSwitchModalProps) {
  const { branches, refreshBranches, refreshStatus } = useGit();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { recentBranches, filteredLocalBranches, filteredRemoteBranches } = useBranchFilters(
    branches,
    searchQuery
  );

  if (!isOpen) return null;

  const handleSwitchBranch = async (branchName: string) => {
    try {
      await GitService.checkoutBranch(branchName);
      await refreshBranches();
      await refreshStatus();
      onClose();
    } catch (error) {
      console.error('Failed to switch branch:', error);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    setIsCreating(true);
    try {
      await GitService.createBranch(newBranchName.trim());
      await refreshBranches();
      setNewBranchName('');
      setShowCreateInput(false);
    } catch (error) {
      console.error('Failed to create branch:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[500px] max-h-[600px] bg-[--color-bg-primary] border border-[--git-panel-border] rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--git-panel-border]">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[--color-primary]" />
            <h2 className="text-sm font-semibold text-[--color-text-primary]">Switch Branch</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[--color-bg-surface-2] transition-colors"
          >
            <X className="w-4 h-4 text-[--color-text-secondary]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-[--git-panel-border]">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-text-tertiary]" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            />
          </div>
        </div>

        {/* Create Branch */}
        <div className="px-4 py-2 border-b border-[--git-panel-border]">
          {showCreateInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Branch name..."
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBranch();
                  if (e.key === 'Escape') {
                    setShowCreateInput(false);
                    setNewBranchName('');
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                autoFocus
              />
              <button
                onClick={handleCreateBranch}
                disabled={isCreating || !newBranchName.trim()}
                className="px-3 py-1.5 text-sm rounded-md bg-[--color-primary] text-white hover:bg-[--color-primary-dark] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateInput(false);
                  setNewBranchName('');
                }}
                className="px-3 py-1.5 text-sm rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateInput(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] transition-colors text-[--color-text-secondary] hover:text-[--color-text-primary]"
            >
              <Plus className="w-4 h-4" />
              <span>Create new branch</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Branches */}
          {recentBranches.length > 0 && searchQuery === '' && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-[--color-text-secondary] uppercase mb-2">
                Recent
              </h3>
              <div className="space-y-1">
                {recentBranches.map((branch) => (
                  <BranchItem key={branch.name} branch={branch} onSwitch={handleSwitchBranch} />
                ))}
              </div>
            </div>
          )}

          {/* Local Branches */}
          {filteredLocalBranches.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-[--color-text-secondary] uppercase mb-2">
                Local Branches
              </h3>
              <div className="space-y-1">
                {filteredLocalBranches.map((branch) => (
                  <BranchItem key={branch.name} branch={branch} onSwitch={handleSwitchBranch} />
                ))}
              </div>
            </div>
          )}

          {/* Remote Branches */}
          {filteredRemoteBranches.length > 0 && (
            <div className="px-4 py-2 border-t border-[--git-panel-border]">
              <h3 className="text-xs font-semibold text-[--color-text-secondary] uppercase mb-2">
                Remote Branches
              </h3>
              <div className="space-y-1">
                {filteredRemoteBranches.map((branch) => (
                  <BranchItem
                    key={branch.name}
                    branch={branch}
                    onSwitch={handleSwitchBranch}
                    isRemote
                  />
                ))}
              </div>
            </div>
          )}

          {filteredLocalBranches.length === 0 && filteredRemoteBranches.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[--color-text-tertiary]">No branches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
