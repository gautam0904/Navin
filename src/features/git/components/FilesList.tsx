import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { FileItem } from './FileItem';
import type { FileStatus } from '@/types/git';

interface FilesListProps {
  files: FileStatus[];
  isStaged: boolean;
  selectedFile?: string | null;
  onStageFile?: (path: string) => void;
  onUnstageFile?: (path: string) => void;
  onSelectFile?: (path: string) => void;
  groupByFolder?: boolean;
}

interface FileGroup {
  folder: string;
  files: FileStatus[];
}

function groupFilesByFolder(files: FileStatus[]): FileGroup[] {
  const groups = new Map<string, FileStatus[]>();

  files.forEach((file) => {
    const pathParts = file.path.split('/');
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '/';

    if (!groups.has(folder)) {
      groups.set(folder, []);
    }
    groups.get(folder)!.push(file);
  });

  return Array.from(groups.entries())
    .map(([folder, files]) => ({ folder, files }))
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

function FolderGroup({
  folder,
  files,
  isStaged,
  selectedFile,
  onStageFile,
  onUnstageFile,
  onSelectFile,
}: {
  folder: string;
  files: FileStatus[];
  isStaged: boolean;
  selectedFile?: string | null;
  onStageFile?: (path: string) => void;
  onUnstageFile?: (path: string) => void;
  onSelectFile?: (path: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const displayFolder = folder === '/' ? 'Root' : folder;

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-surface-2] transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        <Folder className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">{displayFolder}</span>
        <span className="text-[10px] font-normal text-[--color-text-tertiary]">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </button>
      {isExpanded && (
        <div className="ml-4">
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
      )}
    </div>
  );
}

export function FilesList({
  files,
  isStaged,
  selectedFile,
  onStageFile,
  onUnstageFile,
  onSelectFile,
  groupByFolder = true,
}: FilesListProps) {
  if (groupByFolder && files.length > 3) {
    const groups = groupFilesByFolder(files);

    return (
      <div>
        {groups.map((group) => (
          <FolderGroup
            key={group.folder}
            folder={group.folder}
            files={group.files}
            isStaged={isStaged}
            selectedFile={selectedFile}
            onStageFile={onStageFile}
            onUnstageFile={onUnstageFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    );
  }

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
