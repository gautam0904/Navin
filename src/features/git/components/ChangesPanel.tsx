import { useState } from 'react';
import { FileIcon, AlertTriangle, Check } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { StagingColumn } from './StagingColumn';

export function ChangesPanel() {
  const { status, stageFile, unstageFile, stageAll, unstageAll, isLoading } = useGit();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FileIcon className="w-16 h-16 mb-4 text-(--color-text-tertiary) opacity-20" />
        <p className="text-sm font-medium text-(--color-text-secondary)">No repository open</p>
        <p className="text-xs text-(--color-text-tertiary) mt-1">
          Open a repository to see changes
        </p>
      </div>
    );
  }

  const unstagedFiles = [...status.unstaged, ...status.untracked];
  const stagedFiles = status.staged;
  const conflictedFiles = status.conflicted;

  return (
    <div className="flex flex-col h-full bg-(--git-panel-bg)">
      {conflictedFiles.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-(--git-status-conflicted-bg) border-b border-(--git-status-conflicted)">
          <AlertTriangle className="w-4 h-4 text-(--git-status-conflicted)" />
          <span className="text-sm font-medium text-(--git-status-conflicted)">
            {conflictedFiles.length} conflicted {conflictedFiles.length === 1 ? 'file' : 'files'}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 border-b border-(--git-panel-border)">
          <StagingColumn
            title="Changes"
            files={unstagedFiles}
            onStageAll={stageAll}
            onStageFile={stageFile}
            isStaged={false}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-1 min-h-0">
          <StagingColumn
            title="Staged"
            files={stagedFiles}
            onUnstageAll={unstageAll}
            onUnstageFile={unstageFile}
            isStaged={true}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            isLoading={isLoading}
          />
        </div>
      </div>

      {status.is_clean && (
        // <div className="absolute inset-0 flex flex-col items-center justify-center bg-(--git-panel-bg) bg-opacity-95">
        <>
          <div className="w-16 h-16 rounded-full bg-(--git-status-added-bg) flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-(--git-ahead)" />
          </div>
          <p className="text-base font-semibold text-(--color-text-primary) mb-1">No changes</p>
          <p className="text-sm text-(--color-text-tertiary)">Your working tree is clean</p>
          {/* </div> */}
        </>
      )}
    </div>
  );
}
