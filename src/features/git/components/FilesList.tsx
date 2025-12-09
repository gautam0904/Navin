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
  return (
    <div className="mb-0.5">
      <div className="ml-2 border-l border-[--git-panel-border]">
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
  const handleSelect = (path: string) => {
    onSelectFile?.(path);
    window.dispatchEvent(new CustomEvent('view-changes', { detail: { path } }));
  };
  if (groupByFolder && files.length > 3) {
    const groups = groupFilesByFolder(files);

    return (
      <div className="py-1">
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
    <div className="py-1">
      {files.map((file) => (
        <FileItem
          key={file.path}
          file={file}
          onStage={() => onStageFile?.(file.path)}
          onUnstage={() => onUnstageFile?.(file.path)}
          isStaged={isStaged}
          onSelect={() => handleSelect(file.path)}
          isSelected={selectedFile === file.path}
        />
      ))}
    </div>
  );
}
