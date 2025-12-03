import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Download, Upload, RefreshCw } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

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
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="flex items-center justify-between p-3 border-b border-[#333]">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Remotes</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors"
          title="Add Remote"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 bg-[#252526] border-b border-[#333] space-y-2">
          <input
            type="text"
            value={newRemoteName}
            onChange={(e) => setNewRemoteName(e.target.value)}
            placeholder="Remote name (e.g. origin)"
            className="w-full px-2 py-1 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white focus:outline-none focus:border-[#007fd4]"
          />
          <input
            type="text"
            value={newRemoteUrl}
            onChange={(e) => setNewRemoteUrl(e.target.value)}
            placeholder="Remote URL"
            className="w-full px-2 py-1 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-sm text-white focus:outline-none focus:border-[#007fd4]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRemote}
              className="px-2 py-1 bg-[#007fd4] text-white text-xs rounded hover:bg-[#006bb3]"
            >
              Add Remote
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {!remotes || remotes.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">No remotes configured</div>
        ) : (
          remotes.map((remote) => (
            <div
              key={remote.name}
              className="bg-[#2a2d2e] rounded border border-[#3c3c3c] overflow-hidden"
            >
              <div className="flex items-center justify-between p-2 bg-[#333]">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-sm">{remote.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFetch(remote.name)}
                    disabled={loadingRemote === remote.name}
                    className={`p-1 hover:bg-[#444] rounded text-gray-400 hover:text-white ${loadingRemote === remote.name ? 'animate-spin' : ''}`}
                    title="Fetch"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeRemote(remote.name)}
                    className="p-1 hover:bg-[#444] rounded text-gray-400 hover:text-red-400"
                    title="Remove Remote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2 text-xs text-gray-400 border-b border-[#3c3c3c] break-all">
                {remote.url}
              </div>

              <div className="flex divide-x divide-[#3c3c3c]">
                <button
                  onClick={() => pullFromRemote(remote.name, currentBranch)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3c3c3c] transition-colors text-xs"
                  title={`Pull ${currentBranch} from ${remote.name}`}
                >
                  <Download className="w-3 h-3" /> Pull
                </button>
                <button
                  onClick={() => pushToRemote(remote.name, currentBranch)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3c3c3c] transition-colors text-xs"
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
