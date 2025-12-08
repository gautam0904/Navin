import { useState } from 'react';
import { GitCommit, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { formatDistanceToNow } from 'date-fns';

export function RecentCommits() {
  const { history } = useGit();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!history || history.length === 0) {
    return null;
  }

  const recentCommits = history.slice(0, 5);

  return (
    <div className="border-t border-[--git-panel-border] bg-[--git-panel-header]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-surface-2] transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <GitCommit className="w-3.5 h-3.5" />
          <span>Recent Commits</span>
          <span className="text-[10px] font-normal text-[--color-text-tertiary]">
            ({recentCommits.length})
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 max-h-64 overflow-y-auto">
          {recentCommits.map((commit) => {
            const timeAgo = formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true });
            const firstLine = commit.message.split('\n')[0];

            return (
              <div
                key={commit.sha}
                className="p-2 rounded-md bg-[--color-bg-surface-2] hover:bg-[--color-bg-surface-3] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[--color-text-primary] line-clamp-1 group-hover:text-[--color-primary] transition-colors">
                      {firstLine}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-[--color-text-tertiary]">
                        {commit.short_sha}
                      </span>
                      <span className="text-[10px] text-[--color-text-tertiary]">•</span>
                      <span className="text-[10px] text-[--color-text-tertiary]">
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
