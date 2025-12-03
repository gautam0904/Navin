import React from 'react';
import { GitBranch, GitMerge, Plus, Trash2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

export function BranchPanel() {
  const { branches, checkoutBranch, createBranch, deleteBranch, closeRepository, isLoading } =
    useGit();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newBranchName, setNewBranchName] = React.useState('');
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  if (!branches) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-4">
        <p>Loading branches...</p>
      </div>
    );
  }

  const localBranches = branches.filter((b) => !b.is_remote);
  const remoteBranches = branches.filter((b) => b.is_remote);

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
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 select-none">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between bg-[#252526]">
        <div className="flex items-center gap-2">
          <button
            onClick={closeRepository}
            className="p-1 -ml-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white transition-colors"
            title="Close Repository"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Branches</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white transition-colors"
          title="Create Branch"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Create branch form */}
      {showCreateForm && (
        <div className="p-3 bg-[#252526] border-b border-[#333]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBranch()}
              placeholder="New branch name"
              className="flex-1 px-2 py-1 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4] focus:border-[#007fd4]"
              autoFocus
            />
            <button
              onClick={handleCreateBranch}
              disabled={!newBranchName.trim() || isLoading}
              className="px-3 py-1 bg-[#007fd4] hover:bg-[#0069b4] disabled:bg-[#3c3c3c] disabled:text-gray-500 rounded text-sm text-white transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="p-3 bg-[#3c3c3c] border-b border-[#333] animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-white mb-2">
                Delete branch{' '}
                <span className="font-mono text-xs bg-[#2d2d2d] px-1 rounded">{deleteConfirm}</span>
                ?
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-2 py-1 hover:bg-[#4d4d4d] rounded text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBranch(deleteConfirm)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branch list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Local branches */}
        <div>
          <div className="px-4 py-2 flex items-center gap-2 group">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
              Local
            </h3>
            <span className="text-xs text-gray-600 bg-[#2d2d2d] px-1.5 rounded-full">
              {localBranches.length}
            </span>
          </div>

          <div className="flex flex-col">
            {localBranches.map((branch) => (
              <div
                key={branch.name}
                className={`group flex items-center justify-between px-4 py-1.5 hover:bg-[#2a2d2e] cursor-pointer transition-colors ${
                  branch.is_head ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => !branch.is_head && checkoutBranch(branch.name)}
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                  <GitBranch
                    className={`w-3.5 h-3.5 shrink-0 ${branch.is_head ? 'text-white' : 'text-gray-500'}`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm truncate ${branch.is_head ? 'font-medium' : ''}`}>
                      {branch.name}
                    </span>
                    {branch.upstream && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <GitMerge className="w-3 h-3" />
                        <span className="truncate">{branch.upstream}</span>
                        {branch.ahead > 0 && (
                          <span className="text-green-400 ml-1">↑{branch.ahead}</span>
                        )}
                        {branch.behind > 0 && (
                          <span className="text-red-400 ml-1">↓{branch.behind}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {branch.is_head && (
                    <span className="text-[10px] text-gray-500 italic mr-1">Current</span>
                  )}
                  {!branch.is_head && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(branch.name);
                      }}
                      className="p-1 hover:bg-[#3c3c3c] rounded text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote branches */}
        {remoteBranches.length > 0 && (
          <div className="mt-2">
            <div className="px-4 py-2 flex items-center gap-2 group">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                Remote
              </h3>
              <span className="text-xs text-gray-600 bg-[#2d2d2d] px-1.5 rounded-full">
                {remoteBranches.length}
              </span>
            </div>
            <div className="flex flex-col">
              {remoteBranches.map((branch) => (
                <div
                  key={branch.name}
                  className="flex items-center gap-2 px-4 py-1.5 hover:bg-[#2a2d2e] text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5 shrink-0 text-gray-600" />
                  <span className="text-sm truncate">{branch.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
