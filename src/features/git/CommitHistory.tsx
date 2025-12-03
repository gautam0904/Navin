import React, { useEffect, useState } from 'react';
import { GitCommit, Calendar, User, ChevronRight, Hash } from 'lucide-react';
import { useGit } from '../../contexts/GitContext';
import { formatDistanceToNow } from 'date-fns';

interface CommitHistoryProps {
  onSelectCommit: (sha: string) => void;
  selectedSha?: string;
}

export function CommitHistory({ onSelectCommit, selectedSha }: CommitHistoryProps) {
  const { history, refreshHistory, isLoading } = useGit();
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  useEffect(() => {
    refreshHistory(LIMIT, 0);
  }, [refreshHistory]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    refreshHistory(LIMIT, nextPage * LIMIT);
    // Note: Ideally we should append to history, but context currently replaces it.
    // For now, simple pagination or we need to update context to support appending.
    // Let's stick to simple replacement for this iteration or update context later.
  };

  if (!history) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <GitCommit className="w-12 h-12 mb-2 opacity-20" />
        <p>No commit history available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-[#333]">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
          Commit History
        </h2>
        <span className="text-xs text-gray-500">{history.length} commits</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-[#2a2d2e]">
          {history.map((commit) => (
            <div
              key={commit.sha}
              onClick={() => onSelectCommit(commit.sha)}
              className={`group p-3 cursor-pointer hover:bg-[#2a2d2e] transition-colors ${selectedSha === commit.sha
                  ? 'bg-[#2a2d2e] border-l-2 border-[#007fd4]'
                  : 'border-l-2 border-transparent'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <GitCommit
                    className={`w-4 h-4 ${selectedSha === commit.sha ? 'text-[#007fd4]' : 'text-gray-500'}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate pr-2 text-gray-200 group-hover:text-white">
                      {commit.message.split('\n')[0]}
                    </p>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1 bg-[#252526] px-1.5 py-0.5 rounded">
                      <Hash className="w-3 h-3" />
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{commit.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
              </div>
            </div>
          ))}
        </div>

        {/* Load More Trigger */}
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-xs text-[#007fd4] hover:underline disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load older commits'}
          </button>
        </div>
      </div>
    </div>
  );
}
