import React from 'react';
import { FileItem } from './FileItem';
import type { FileStatus } from '@/types/git';

interface FilesListProps {
  files: FileStatus[];
  isStaged: boolean;
  selectedFile?: string | null;
  onStageFile?: (path: string) => void;
  onUnstageFile?: (path: string) => void;
  onSelectFile?: (path: string) => void;
}

export function FilesList({
  files,
  isStaged,
  selectedFile,
  onStageFile,
  onUnstageFile,
  onSelectFile,
}: FilesListProps) {
  return (
    <div>
      {files.map((file) => (
        <FileItem
          key={file.path}
          file={file}
          onStage={() => onStageFile?.(file.path)}
          onUnstage={() => onUnstageFile?.(file.path)}
          isStaged={isStaged}
          onSelect={() => onSelectFile?.(file.path)}
          isSelected={selectedFile === file.path}
        />
      ))}
    </div>
  );
}
