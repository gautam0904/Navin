import React, { useState } from 'react';
import { FolderOpen, GitBranch, Search } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useGit } from '../../contexts/GitContext';

export function RepositoryPicker() {
  const { openRepository, repository, isLoading, error } = useGit();
  const [recentRepos, setRecentRepos] = useState<string[]>([]);

  const handleOpenFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Open Git Repository',
      });

      if (selected && typeof selected === 'string') {
        await openRepository(selected);

        // Add to recent repos
        setRecentRepos((prev) => {
          const updated = [selected, ...prev.filter((p) => p !== selected)].slice(0, 10);
          localStorage.setItem('recentGitRepos', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to open repository:', err);
    }
  };

  // Load recent repos on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('recentGitRepos');
    if (stored) {
      try {
        setRecentRepos(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent repos:', e);
      }
    }
  }, []);

  if (repository) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-800 border-b border-gray-700">
        <GitBranch className="w-5 h-5 text-blue-400" />
        <div>
          <h3 className="text-sm font-semibold text-white">{repository.name}</h3>
          <p className="text-xs text-gray-400">{repository.path}</p>
        </div>
        {repository.current_branch && (
          <div className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
            {repository.current_branch}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <GitBranch className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Open a Git Repository</h1>
          <p className="text-gray-400">Get started by opening a local Git repository</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleOpenFolder}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">
              {isLoading ? 'Opening...' : 'Open Local Repository'}
            </span>
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {recentRepos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Recent Repositories
            </h2>
            <div className="space-y-2">
              {recentRepos.map((path) => (
                <button
                  key={path}
                  onClick={() => openRepository(path)}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <p className="text-sm text-gray-300 truncate">{path}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
