import { Plus, Minus, ExternalLink, Undo2 } from 'lucide-react';
import { FileStatusBadge, parseFileStatus, type FileStatusType } from './FileStatusBadge';
import type { FileStatus } from '@/types/git';
import React from 'react';
import { getIconPath } from '@/utils/iconResolver';
import type { FileEntry } from '@/contexts/FileExplorerContext';

function getFileStatusType(status: FileStatus['status']): FileStatusType {
  return parseFileStatus(status);
}

function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

// Quality score display for file items
interface FileQualityScore {
  score: number;
  issueCount: number;
}

interface FileItemActionsProps {
  isStaged: boolean;
  onActionClick: (e: React.MouseEvent) => void;
  onDiscard?: (e: React.MouseEvent) => void;
  onOpenFile: (e: React.MouseEvent) => void;
}

function FileItemActions({ isStaged, onActionClick, onDiscard, onOpenFile }: FileItemActionsProps) {
  return (
    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onActionClick}
        className={`
          p-1.5 rounded-md transition-all
          ${
            isStaged
              ? 'hover:bg-[rgba(239,68,68,0.15)] text-[--color-error] hover:text-[--color-error]'
              : 'hover:bg-[rgba(16,185,129,0.15)] text-[--color-success] hover:text-[--color-success]'
          }
        `}
        title={isStaged ? 'Unstage file' : 'Stage file'}
      >
        {isStaged ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      {!isStaged && onDiscard && (
        <button
          onClick={onDiscard}
          className="p-1.5 rounded-md transition-all hover:bg-[rgba(239,68,68,0.15)] text-[--color-text-tertiary] hover:text-[--color-error]"
          title="Discard changes"
        >
          <Undo2 className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onOpenFile}
        className="p-1.5 rounded-md transition-all hover:bg-[--color-bg-surface-2] text-[--color-text-tertiary] hover:text-[--color-text-primary]"
        title="Open file"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}

interface FileItemProps {
  file: FileStatus;
  onStage?: () => void;
  onUnstage?: () => void;
  isStaged?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  qualityScore?: FileQualityScore;
}

function useFileInfo(file: FileStatus) {
  const statusType = getFileStatusType(file.status);
  const fileName = file.path.split('/').pop() || file.path;
  const filePath = file.path.substring(0, file.path.lastIndexOf('/'));
  const fileExt = getFileExtension(fileName);
  const entry: FileEntry = { name: fileName, path: file.path, is_dir: false, extension: fileExt };
  const iconPath = getIconPath(entry, false);
  return { statusType, fileName, filePath, iconPath };
}

function useFileHandlers(
  file: FileStatus,
  fileName: string,
  isStaged: boolean,
  onStage?: () => void,
  onUnstage?: () => void
) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStaged) {
      onUnstage?.();
    } else {
      onStage?.();
    }
  };

  const handleOpenFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('view-changes', { detail: { path: file.path } }));
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Discard changes to ${fileName}? This cannot be undone.`)) {
      window.dispatchEvent(new CustomEvent('discard-changes', { detail: { path: file.path } }));
    }
  };

  return { handleActionClick, handleOpenFile, handleDiscard };
}

export function FileItem({
  file,
  onStage,
  onUnstage,
  isStaged = false,
  onSelect,
  isSelected,
}: FileItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { statusType, fileName, filePath, iconPath } = useFileInfo(file);
  const { handleActionClick, handleOpenFile, handleDiscard } = useFileHandlers(
    file,
    fileName,
    isStaged,
    onStage,
    onUnstage
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={`
        group relative flex items-center px-3
        transition-all duration-150 cursor-pointer
        ${
          isSelected
            ? 'bg-[--color-bg-surface-2] border-l-2 border-l-[--color-primary]'
            : 'hover:bg-[--color-bg-surface-1] border-l-2 border-l-transparent'
        }
      `}
    >
      <div className="shrink-0 flex items-center justify-center w-5 h-5">
        <img
          src={iconPath}
          alt={fileName}
          className="w-4 h-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/icons/file.svg';
          }}
        />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2">
          <span
            className="font-medium text-sm truncate"
            style={{ color: getStatusColor(statusType) }}
            title={file.path}
          >
            {fileName}
          </span>

          <div className="ml-auto opacity-100 group-hover:opacity-0 transition-opacity">
            <FileStatusBadge status={statusType} />
          </div>
        </div>

        {/* LINE 2 (file path) - hide on hover */}
        {filePath && (
          <span className="text-[11px] text-[--color-text-tertiary] truncate group-hover:opacity-0 transition-opacity">
            {filePath}
          </span>
        )}
      </div>

      {isHovered && (
        <FileItemActions
          isStaged={isStaged}
          onActionClick={handleActionClick}
          onDiscard={!isStaged ? handleDiscard : undefined}
          onOpenFile={handleOpenFile}
        />
      )}
    </div>
  );
}

function getStatusColor(status: FileStatusType): string {
  switch (status) {
    case 'modified':
      return 'var(--git-status-modified)';
    case 'added':
      return 'var(--git-status-added)';
    case 'deleted':
      return 'var(--git-status-deleted)';
    case 'renamed':
      return 'var(--git-status-renamed)';
    case 'untracked':
      return 'var(--git-status-untracked)';
    default:
      return 'var(--color-text-primary)';
  }
}

// Export types for use in other components
export type { FileQualityScore };
