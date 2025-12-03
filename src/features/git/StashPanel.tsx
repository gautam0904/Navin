import React, { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Play, Upload } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';

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
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="flex items-center justify-between p-3 border-b border-[#333]">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Stashes</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors"
          title="Stash Changes"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 bg-[#252526] border-b border-[#333] space-y-2">
          <input
            type="text"
            value={stashMessage}
            onChange={(e) => setStashMessage(e.target.value)}
            placeholder="Stash message (optional)"
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
              onClick={handleCreateStash}
              className="px-2 py-1 bg-[#007fd4] text-white text-xs rounded hover:bg-[#006bb3]"
            >
              Stash
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {!stashes || stashes.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">No stashes found</div>
        ) : (
          stashes.map((stash, index) => (
            <div
              key={index}
              className="bg-[#2a2d2e] rounded border border-[#3c3c3c] overflow-hidden group"
            >
              <div className="p-2 border-b border-[#3c3c3c] flex items-start gap-2">
                <Archive className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-gray-200">
                    {stash.message || `Stash@{${index}}`}
                  </div>
                  <div className="text-xs text-gray-500">{stash.branch}</div>
                </div>
              </div>

              <div className="flex divide-x divide-[#3c3c3c]">
                <button
                  onClick={() => applyStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3c3c3c] transition-colors text-xs"
                  title="Apply Stash"
                >
                  <Play className="w-3 h-3" /> Apply
                </button>
                <button
                  onClick={() => popStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3c3c3c] transition-colors text-xs"
                  title="Pop Stash"
                >
                  <Upload className="w-3 h-3" /> Pop
                </button>
                <button
                  onClick={() => dropStash(index)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 hover:bg-[#3c3c3c] transition-colors text-xs hover:text-red-400"
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
