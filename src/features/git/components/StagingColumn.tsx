import { useState, useEffect } from 'react';
import { StagingHeader } from './StagingHeader';
import { FilesList } from './FilesList';
import { EmptyState } from './EmptyState';
import { FileSearchFilter } from './FileSearchFilter';
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
  isClean?: boolean;
  hasOtherSectionFiles?: boolean;
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
  isClean = false,
  hasOtherSectionFiles = false,
}: StagingColumnProps) {
  const [filteredFiles, setFilteredFiles] = useState<FileStatus[]>(files);
  const hasFiles = files.length > 0;

  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  return (
    <div className="flex flex-col h-full">
      <StagingHeader
        title={title}
        count={files.length}
        isStaged={isStaged}
        isLoading={isLoading}
        hasFiles={hasFiles}
        onStageAll={onStageAll}
        onUnstageAll={onUnstageAll}
      />

      {hasFiles && (
        <FileSearchFilter
          files={files}
          onFilterChange={setFilteredFiles}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {hasFiles ? (
          <FilesList
            files={filteredFiles}
            onStageFile={onStageFile}
            onUnstageFile={onUnstageFile}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
            isStaged={isStaged}
            groupByFolder={filteredFiles.length > 3}
          />
        ) : (
          <EmptyState 
            isStaged={isStaged} 
            isClean={isClean}
            hasOtherSectionFiles={hasOtherSectionFiles}
          />
        )}
      </div>
    </div>
  );
}
