import { useState } from 'react';
import { File, AlertTriangle } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { StagingColumn } from './StagingColumn';

interface ChangesPanelProps {
  selectedFile?: string | null;
  onFileSelect?: (path: string | null) => void;
}

function useFileSelection(
  externalSelectedFile: string | null | undefined,
  externalOnFileSelect: ((path: string | null) => void) | undefined
) {
  const [internalSelectedFile, setInternalSelectedFile] = useState<string | null>(null);
  const selectedFile =
    externalSelectedFile !== undefined ? externalSelectedFile : internalSelectedFile;
  const setSelectedFile =
    externalOnFileSelect || ((path: string | null) => setInternalSelectedFile(path));
  return { selectedFile, setSelectedFile };
}

function calculateStats(
  unstagedFiles: Array<{ additions?: number | null; deletions?: number | null }>,
  stagedFiles: Array<{ additions?: number | null; deletions?: number | null }>
) {
  const allFiles = [...unstagedFiles, ...stagedFiles];
  return {
    totalFiles: allFiles.length,
    totalAdditions: allFiles.reduce((sum, file) => sum + (file.additions ?? 0), 0),
    totalDeletions: allFiles.reduce((sum, file) => sum + (file.deletions ?? 0), 0),
  };
}

export function ChangesPanel({
  selectedFile: externalSelectedFile,
  onFileSelect: externalOnFileSelect,
}: ChangesPanelProps = {}) {
  const { status, stageFile, unstageFile, stageAll, unstageAll, isLoading } = useGit();
  const { selectedFile, setSelectedFile } = useFileSelection(
    externalSelectedFile,
    externalOnFileSelect
  );

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <File className="w-16 h-16 mb-4 text-(--color-text-tertiary) opacity-20" />
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
  const isClean = status.is_clean;
  const hasStaged = stagedFiles.length > 0;
  const { totalFiles, totalAdditions, totalDeletions } = calculateStats(unstagedFiles, stagedFiles);

  return (
    <div className="flex flex-col h-full bg-[--git-panel-bg]">
      {conflictedFiles.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[--git-status-conflicted-bg] border-b border-[--git-status-conflicted]">
          <AlertTriangle className="w-4 h-4 text-[--git-status-conflicted] shrink-0" />
          <span className="text-sm font-medium text-[--git-status-conflicted]">
            {conflictedFiles.length} conflicted {conflictedFiles.length === 1 ? 'file' : 'files'}
          </span>
        </div>
      )}

      {totalFiles > 0 && (
        <div className="flex items-center gap-4 px-3 py-2.5 bg-[--git-panel-header] border-b border-[--git-panel-border] text-xs">
          <span className="font-semibold text-[--color-text-primary]">
            {totalFiles} {totalFiles === 1 ? 'file' : 'files'} changed
          </span>
          <span className="text-[--git-status-added] font-medium">+{totalAdditions}</span>
          <span className="text-[--git-status-deleted] font-medium">-{totalDeletions}</span>
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`${hasStaged ? 'flex-1' : 'flex-2'} min-h-0 border-b border-[--git-panel-border]`}
        >
          <StagingColumn
            title="Changes"
            files={unstagedFiles}
            onStageAll={stageAll}
            onStageFile={stageFile}
            isStaged={false}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            isLoading={isLoading}
            isClean={isClean}
            hasOtherSectionFiles={hasStaged}
          />
        </div>

        {hasStaged && (
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
              isClean={isClean}
              hasOtherSectionFiles={unstagedFiles.length > 0}
            />
          </div>
        )}
        {!hasStaged && (
          <div className="px-3 py-1 border-b border-dashed border-[--git-panel-border] bg-[--git-panel-header] min-h-[20px] flex items-center justify-center">
            <p className="text-[10px] text-[--color-text-tertiary] italic">
              No files staged • Drag here or select above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
