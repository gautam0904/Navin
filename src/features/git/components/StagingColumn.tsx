import React from 'react';
import { StagingHeader } from './StagingHeader';
import { FilesList } from './FilesList';
import { EmptyState } from './EmptyState';
import type { FileStatus } from '@/types/git';

interface StagingColumnProps {
  title: string;
  files: FileStatus[];
  onStageAll?: () => void;
  onUnstageAll?: () => void;
  onStageFile?: (path: string) => void;
  onUnstageFile?: (path: string) => void;
  isStaged?: boolean;
  selectedFile?: string | null;
  onSelectFile?: (path: string) => void;
  isLoading?: boolean;
}

export function StagingColumn({
  title,
  files,
  onStageAll,
  onUnstageAll,
  onStageFile,
  onUnstageFile,
  isStaged = false,
  selectedFile,
  onSelectFile,
  isLoading = false,
}: StagingColumnProps) {
  const hasFiles = files.length > 0;

  return (
    <div className="flex flex-col h-full border-r border-[var(--git-panel-border)] last:border-r-0">
      <StagingHeader
        title={title}
        count={files.length}
        isStaged={isStaged}
        isLoading={isLoading}
        hasFiles={hasFiles}
        onStageAll={onStageAll}
        onUnstageAll={onUnstageAll}
      />

      <div className="flex-1 overflow-y-auto">
        {hasFiles ? (
          <FilesList
            files={files}
            onStageFile={onStageFile}
            onUnstageFile={onUnstageFile}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
            isStaged={isStaged}
          />
        ) : (
          <EmptyState isStaged={isStaged} />
        )}
      </div>
    </div>
  );
}
