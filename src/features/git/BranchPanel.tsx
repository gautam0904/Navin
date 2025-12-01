import React from 'react';
import { GitBranch, Check, GitMerge, Plus } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

export function BranchPanel() {
  const { branches, checkoutBranch, createBranch, isLoading } = useGit();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newBranchName, setNewBranchName] = React.useState('');

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

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Branches
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Create branch form */}
      {showCreateForm && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBranch()}
              placeholder="New branch name"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleCreateBranch}
              disabled={!newBranchName.trim() || isLoading}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Branch list */}
      <div className="flex-1 overflow-y-auto">
        {/* Local branches */}
        <div className="border-b border-gray-800">
          <div className="p-3 bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300">Local ({localBranches.length})</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {localBranches.map((branch) => (
              <div
                key={branch.name}
                className={`p-3 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                  branch.is_head ? 'bg-blue-900/20' : ''
                }`}
                onClick={() => !branch.is_head && checkoutBranch(branch.name)}
              >
                <div className="flex items-center gap-2">
                  {branch.is_head && <Check className="w-4 h-4 text-green-500" />}
                  <GitBranch className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${branch.is_head ? 'font-semibold' : ''}`}>
                    {branch.name}
                  </span>
                </div>

                {branch.upstream && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <GitMerge className="w-3 h-3" />
                    <span>{branch.upstream}</span>
                    {branch.ahead > 0 && <span className="text-green-400">↑{branch.ahead}</span>}
                    {branch.behind > 0 && <span className="text-red-400">↓{branch.behind}</span>}
                  </div>
                )}

                {branch.last_commit && (
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {branch.last_commit.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Remote branches */}
        {remoteBranches.length > 0 && (
          <div>
            <div className="p-3 bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-300">
                Remote ({remoteBranches.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-800">
              {remoteBranches.map((branch) => (
                <div key={branch.name} className="p-3 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{branch.name}</span>
                  </div>
                  {branch.last_commit && (
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {branch.last_commit.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
