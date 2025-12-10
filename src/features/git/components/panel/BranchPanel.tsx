import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  FolderGit2,
  Check,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { CreateBranchForm } from '../CreateBranchForm';
import { DeleteConfirm } from '../DeleteConfirmDialog';
import { BranchItem } from '../BranchPanelHelpers';

interface Branch {
  name: string;
  is_head: boolean;
  is_remote: boolean;
  upstream: string | null;
  ahead: number;
  behind: number;
}

interface BranchSectionProps {
  title: string;
  icon: React.ReactNode;
  branches: Branch[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectBranch: (name: string) => void;
  onDeleteBranch?: (name: string) => void;
}

function BranchSection({
  title,
  icon,
  branches,
  isExpanded,
  onToggle,
  onSelectBranch,
  onDeleteBranch,
}: BranchSectionProps) {
  if (branches.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 bg-(--color-bg-surface-2) hover:bg-(--color-bg-surface-3) transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-(--color-text-tertiary)" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-(--color-text-tertiary)" />
        )}
        {icon}
        <span className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
          {title}
        </span>
        <span className="section-header-count ml-auto">{branches.length}</span>
      </button>

      {isExpanded && (
        <div className="animate-slide-in">
          {branches.map((branch) => (
            <BranchItem
              key={branch.name}
              branch={branch}
              onSelect={() => !branch.is_head && onSelectBranch(branch.name)}
              onDelete={onDeleteBranch ? () => onDeleteBranch(branch.name) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function useBranchFiltering(branches: Branch[], searchTerm: string) {
  const currentBranch = branches?.find((b) => b.is_head);
  const localBranches = branches?.filter((b) => !b.is_remote) || [];
  const remoteBranches = branches?.filter((b) => b.is_remote) || [];

  const filteredLocal = localBranches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRemote = remoteBranches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { currentBranch, filteredLocal, filteredRemote };
}

function BranchLoadingState() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-full" />
        <div className="skeleton w-24 h-4 rounded" />
      </div>
    </div>
  );
}

function CurrentBranchBanner({ currentBranch }: { currentBranch: Branch }) {
  return (
    <div className="px-4 py-3 bg-linear-to-r from-[rgba(59,130,246,0.1)] to-transparent border-b border-(--color-border-light)">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-primary-dark) flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-(--color-primary)">{currentBranch.name}</div>
          {(currentBranch.ahead > 0 || currentBranch.behind > 0) && (
            <div className="flex items-center gap-2 text-xs">
              {currentBranch.behind > 0 && (
                <span className="flex items-center gap-1 text-(--color-error)">
                  <ArrowDownCircle className="w-3 h-3" />
                  {currentBranch.behind} behind
                </span>
              )}
              {currentBranch.ahead > 0 && (
                <span className="flex items-center gap-1 text-(--color-success)">
                  <ArrowUpCircle className="w-3 h-3" />
                  {currentBranch.ahead} ahead
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BranchPanel() {
  const { branches, checkoutBranch, createBranch, deleteBranch, isLoading } = useGit();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localExpanded, setLocalExpanded] = useState(true);
  const [remoteExpanded, setRemoteExpanded] = useState(true);

  const { currentBranch, filteredLocal, filteredRemote } = useBranchFiltering(
    branches || [],
    searchTerm
  );

  if (!branches) {
    return <BranchLoadingState />;
  }

  const handleCreateBranch = async (name: string) => {
    try {
      await createBranch(name);
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
    <div className="flex flex-col h-full bg-(--color-bg-primary)">
      {/* Header */}
      <div className="section-header">
        <div className="section-header-title">
          <GitBranch className="w-4 h-4 text-(--color-primary)" />
          <span>Branches</span>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-premium btn-premium-ghost btn-premium-icon"
          title="New Branch"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Current Branch Banner */}
      {currentBranch && <CurrentBranchBanner currentBranch={currentBranch} />}

      {/* Create Branch Form */}
      <CreateBranchForm
        isOpen={showCreateForm}
        isLoading={isLoading}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateBranch}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirm
          branchName={deleteConfirm}
          onConfirm={() => handleDeleteBranch(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Search */}
      <div className="px-3 py-2 border-b border-(--color-border-light)">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-tertiary)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter branches..."
            className="input-premium pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Branch List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <BranchSection
          title="Local"
          icon={<GitBranch className="w-3.5 h-3.5 text-(--color-text-tertiary)" />}
          branches={filteredLocal}
          isExpanded={localExpanded}
          onToggle={() => setLocalExpanded(!localExpanded)}
          onSelectBranch={checkoutBranch}
          onDeleteBranch={setDeleteConfirm}
        />

        <BranchSection
          title="Remote"
          icon={<FolderGit2 className="w-3.5 h-3.5 text-(--color-text-tertiary)" />}
          branches={filteredRemote}
          isExpanded={remoteExpanded}
          onToggle={() => setRemoteExpanded(!remoteExpanded)}
          onSelectBranch={checkoutBranch}
        />

        {filteredLocal.length === 0 && filteredRemote.length === 0 && searchTerm && (
          <div className="p-8 text-center">
            <p className="text-sm text-(--color-text-tertiary)">
              No branches match &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
