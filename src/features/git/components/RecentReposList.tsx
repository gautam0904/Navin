import { useState, useCallback } from 'react';
import { Pin, PinOff, X, GitBranch } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { GitService } from '@/services/gitService';
import { formatDistanceToNow } from 'date-fns';

interface RecentRepo {
  path: string;
  name: string;
  branch?: string;
  lastOpened: number;
  isPinned: boolean;
}

const STORAGE_KEY = 'navin_recent_repos';

// Helper function to load and sort repos from localStorage
function loadReposFromStorage(): RecentRepo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RecentRepo[];
      return parsed.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.lastOpened - a.lastOpened;
      });
    }
  } catch (error) {
    console.error('Failed to load recent repos:', error);
  }
  return [];
}

export function RecentReposList() {
  const { repository, openRepository } = useGit();
  const [repos, setRepos] = useState<RecentRepo[]>(loadReposFromStorage);
  const [isExpanded, setIsExpanded] = useState(true);

  const saveRecentRepos = useCallback((newRepos: RecentRepo[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRepos));
      setRepos(newRepos);
    } catch (error) {
      console.error('Failed to save recent repos:', error);
    }
  }, []);

  const addRecentRepo = useCallback(async (path: string) => {
    try {
      const repoInfo = await GitService.discoverRepository(path);
      const timestamp = Date.now();
      setRepos((currentRepos) => {
        const existing = currentRepos.find((r) => r.path === path);
        const updated = existing
          ? currentRepos.map((r) => (r.path === path ? { ...r, lastOpened: timestamp } : r))
          : [
              ...currentRepos,
              {
                path,
                name: repoInfo.name,
                lastOpened: timestamp,
                isPinned: false,
              },
            ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to add recent repo:', error);
    }
  }, []);

  const handleOpenRepo = async (repo: RecentRepo) => {
    try {
      await openRepository(repo.path);
      await addRecentRepo(repo.path);
    } catch (error) {
      console.error('Failed to open repo:', error);
    }
  };

  const handlePin = (path: string) => {
    const updated = repos.map((r) => (r.path === path ? { ...r, isPinned: !r.isPinned } : r));
    saveRecentRepos(updated);
  };

  const handleRemove = (path: string) => {
    const updated = repos.filter((r) => r.path !== path);
    saveRecentRepos(updated);
  };

  if (repos.length === 0) return null;

  return (
    <div className="border-t border-[--git-panel-border]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-surface-2] transition-colors"
      >
        <span>Recent Repositories</span>
        <span className="text-[10px] font-normal text-[--color-text-tertiary]">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-2 py-1 space-y-1 max-h-64 overflow-y-auto">
          {repos.map((repo) => (
            <div
              key={repo.path}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                repository?.path === repo.path
                  ? 'bg-[--color-primary]/10 text-[--color-primary]'
                  : 'hover:bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:text-[--color-text-primary]'
              }`}
              onClick={() => handleOpenRepo(repo)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {repo.isPinned && <Pin className="w-3 h-3 text-[--color-primary] shrink-0" />}
                  <span className="font-medium truncate">{repo.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {repo.branch && (
                    <div className="flex items-center gap-0.5 text-[10px] text-[--color-text-tertiary]">
                      <GitBranch className="w-2.5 h-2.5" />
                      <span>{repo.branch}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-[--color-text-tertiary]">
                    {formatDistanceToNow(new Date(repo.lastOpened), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePin(repo.path);
                  }}
                  className="p-1 rounded hover:bg-[--color-bg-surface-3] transition-colors"
                  title={repo.isPinned ? 'Unpin' : 'Pin'}
                >
                  {repo.isPinned ? (
                    <PinOff className="w-3 h-3 text-[--color-text-tertiary]" />
                  ) : (
                    <Pin className="w-3 h-3 text-[--color-text-tertiary]" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(repo.path);
                  }}
                  className="p-1 rounded hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3 text-[--color-text-tertiary] hover:text-[--color-error]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
