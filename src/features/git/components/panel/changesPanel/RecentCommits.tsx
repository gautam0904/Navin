import { useState, useEffect } from 'react';
import { GitCommit, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { formatDistanceToNow } from 'date-fns';

export function RecentCommits() {
  const { history, refreshHistory, repository } = useGit();
  const [isExpanded, setIsExpanded] = useState(true);

  // Load history when component mounts or repository changes
  useEffect(() => {
    if (repository) {
      refreshHistory(10); // Load last 10 commits
    }
  }, [repository, refreshHistory]);

  if (!history || history.length === 0) {
    return null;
  }

  const recentCommits = history.slice(0, 5);

  return (
    <div className="border-t border-[--git-panel-border] bg-[--git-panel-header] mt-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-[--color-text-primary] hover:bg-[--color-bg-surface-1] transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[--color-text-secondary]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[--color-text-secondary]" />
          )}
          <GitCommit className="w-3.5 h-3.5 text-[--color-primary]" />
          <span>Recent Commits</span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[--color-bg-surface-2] text-[--color-text-secondary]">
            {recentCommits.length}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[--color-bg-surface-3] scrollbar-track-transparent">
          {recentCommits.map((commit) => {
            const timeAgo = formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true });
            const firstLine = commit.message.split('\n')[0];

            return (
              <div
                key={commit.sha}
                className="p-2 rounded-md bg-[--color-bg-surface-1] hover:bg-[--color-bg-surface-2] border border-transparent hover:border-[--git-panel-border] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[--color-text-primary] line-clamp-1 group-hover:text-[--color-primary] transition-colors">
                      {firstLine}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-mono text-[--color-text-tertiary] bg-[--color-bg-surface-3] px-1.5 py-0.5 rounded">
                        {commit.short_sha || commit.sha.substring(0, 7)}
                      </span>
                      <span className="text-[10px] text-[--color-text-tertiary]">•</span>
                      <span className="text-[10px] text-[--color-text-tertiary] truncate max-w-[80px]">
                        {commit.author_name}
                      </span>
                      <span className="text-[10px] text-[--color-text-tertiary]">•</span>
                      <div className="flex items-center gap-0.5 text-[10px] text-[--color-text-tertiary]">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
