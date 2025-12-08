import React, { useState } from 'react';
import { FolderOpen, GitBranch, X, CheckSquare, Square } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { GitService } from '@/services/gitService';
import { useGit } from '@/contexts/GitContext';

interface OpenFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepositoryOpened: (path: string) => void;
}

interface DetectedRepo {
  path: string;
  name: string;
  isSelected: boolean;
}

export function OpenFolderModal({ isOpen, onClose, onRepositoryOpened }: OpenFolderModalProps) {
  const { openRepository } = useGit();
  const [detectedRepos, setDetectedRepos] = useState<DetectedRepo[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSelectFolder = async () => {
    try {
      setIsScanning(true);
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Open Folder',
      });

      if (selected && typeof selected === 'string') {
        // Scan for Git repositories
        try {
          const repoInfo = await GitService.discoverRepository(selected);
          
          if (repoInfo) {
            setDetectedRepos([{ path: selected, name: repoInfo.name, isSelected: true }]);
          } else {
            // Check for nested repos
            // TODO: Implement nested repo scanning
            const initRepo = window.confirm(
              `No Git repository found in:\n${selected}\n\nWould you like to initialize a new Git repository here?`
            );
            
            if (initRepo) {
              // TODO: Implement git init
              alert('Git init not yet implemented. Please initialize the repository manually.');
            }
          }
        } catch (error) {
          console.error('Failed to discover repository:', error);
        }
      }
    } catch (err) {
      console.error('Failed to open folder:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleRepo = (path: string) => {
    setDetectedRepos((prev) =>
      prev.map((repo) => (repo.path === path ? { ...repo, isSelected: !repo.isSelected } : repo))
    );
  };

  const handleOpenSelected = async () => {
    const selectedRepo = detectedRepos.find((r) => r.isSelected);
    if (selectedRepo) {
      await openRepository(selectedRepo.path);
      onRepositoryOpened(selectedRepo.path);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[600px] max-h-[500px] bg-[--color-bg-primary] border border-[--git-panel-border] rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--git-panel-border]">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[--color-primary]" />
            <h2 className="text-base font-semibold text-[--color-text-primary]">Open Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[--color-bg-surface-2] transition-colors"
          >
            <X className="w-4 h-4 text-[--color-text-secondary]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {detectedRepos.length === 0 ? (
            <div className="text-center py-8">
              <GitBranch className="w-12 h-12 mx-auto mb-4 text-[--color-text-tertiary] opacity-50" />
              <p className="text-sm text-[--color-text-secondary] mb-4">
                Select a folder to scan for Git repositories
              </p>
              <button
                onClick={handleSelectFolder}
                disabled={isScanning}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-[--color-primary] text-white hover:bg-[--color-primary-dark] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isScanning ? 'Scanning...' : 'Select Folder'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-[--color-text-primary] mb-3">
                Repository detected:
              </p>
              {detectedRepos.map((repo) => (
                <div
                  key={repo.path}
                  className="flex items-center gap-3 p-3 rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] transition-colors cursor-pointer"
                  onClick={() => handleToggleRepo(repo.path)}
                >
                  {repo.isSelected ? (
                    <CheckSquare className="w-5 h-5 text-[--color-primary]" />
                  ) : (
                    <Square className="w-5 h-5 text-[--color-text-tertiary]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <GitBranch className="w-4 h-4 text-[--color-primary]" />
                      <span className="text-sm font-semibold text-[--color-text-primary]">{repo.name}</span>
                    </div>
                    <p className="text-xs text-[--color-text-tertiary] truncate">{repo.path}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {detectedRepos.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[--git-panel-border]">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenSelected}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-[--color-primary] text-white hover:bg-[--color-primary-dark] transition-colors"
            >
              Open Repository
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


