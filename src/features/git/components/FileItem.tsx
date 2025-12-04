import React from 'react';
import { Plus, Minus, FileIcon, FileEdit, FilePlus, FileX, AlertTriangle } from 'lucide-react';
import { FileStatusBadge, parseFileStatus, type FileStatusType } from './FileStatusBadge';
import type { FileStatus } from '@/types/git';

function getFileStatusType(status: FileStatus['status']): FileStatusType {
  return parseFileStatus(status);
}

interface FileItemProps {
  file: FileStatus;
  onStage?: () => void;
  onUnstage?: () => void;
  isStaged?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function FileItem({
  file,
  onStage,
  onUnstage,
  isStaged = false,
  onSelect,
  isSelected,
}: FileItemProps) {
  const statusType = getFileStatusType(file.status);
  const fileName = file.path.split('/').pop() || file.path;
  const filePath = file.path.substring(0, file.path.lastIndexOf('/'));

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStaged) {
      onUnstage?.();
    } else {
      onStage?.();
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`
        group flex items-center gap-3 px-3 py-2 cursor-pointer transition-all
        border-l-2 hover:bg-[var(--git-panel-item-hover)]
        ${
          isSelected
            ? 'bg-[var(--git-panel-item-selected)] border-[var(--color-primary)]'
            : 'border-transparent'
        }
      `}
    >
      <div className="shrink-0">
        <FileStatusIconDisplay status={statusType} size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {fileName}
          </span>
          <FileStatusBadge status={statusType} />
        </div>
        {filePath && (
          <div className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">
            {filePath}
          </div>
        )}
      </div>

      <button
        onClick={handleActionClick}
        className={`
          opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all
          ${
            isStaged
              ? 'hover:bg-[var(--git-status-deleted-bg)] text-[var(--git-status-deleted)]'
              : 'hover:bg-[var(--git-status-added-bg)] text-[var(--git-status-added)]'
          }
        `}
        title={isStaged ? 'Unstage' : 'Stage'}
      >
        {isStaged ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}

function FileStatusIconDisplay({ status, size = 16 }: { status: FileStatusType; size?: number }) {
  const iconClass = `w-${Math.floor(size / 4)} h-${Math.floor(size / 4)}`;

  switch (status) {
    case 'added':
    case 'untracked':
      return <FilePlus className={`${iconClass} text-[var(--git-status-added)]`} />;
    case 'modified':
      return <FileEdit className={`${iconClass} text-[var(--git-status-modified)]`} />;
    case 'deleted':
      return <FileX className={`${iconClass} text-[var(--git-status-deleted)]`} />;
    case 'conflicted':
      return <AlertTriangle className={`${iconClass} text-[var(--git-status-conflicted)]`} />;
    default:
      return <FileIcon className={`${iconClass} text-[var(--color-text-tertiary)]`} />;
  }
}
