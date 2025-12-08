import React from 'react';
import {
  SplitSquareHorizontal,
  AlignLeft,
  FileEdit,
  Plus,
  Minus,
  FilePlus,
  FileX,
  FileSymlink,
} from 'lucide-react';

interface EditorToolbarProps {
  fileName: string;
  filePath: string;
  fileStatus?: string;
  additions: number;
  deletions: number;
  viewMode: 'split' | 'unified';
  onViewModeChange: (mode: 'split' | 'unified') => void;
}
// Status info lookup table - reduces cyclomatic complexity
const STATUS_INFO_MAP: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  modified: {
    icon: <FileEdit className="w-4 h-4" />,
    color: 'text-[--git-status-modified]',
    label: 'Modified',
  },
  Modified: {
    icon: <FileEdit className="w-4 h-4" />,
    color: 'text-[--git-status-modified]',
    label: 'Modified',
  },
  added: {
    icon: <FilePlus className="w-4 h-4" />,
    color: 'text-[--git-status-added]',
    label: 'Added',
  },
  Added: {
    icon: <FilePlus className="w-4 h-4" />,
    color: 'text-[--git-status-added]',
    label: 'Added',
  },
  new: {
    icon: <FilePlus className="w-4 h-4" />,
    color: 'text-[--git-status-added]',
    label: 'Added',
  },
  New: {
    icon: <FilePlus className="w-4 h-4" />,
    color: 'text-[--git-status-added]',
    label: 'Added',
  },
  deleted: {
    icon: <FileX className="w-4 h-4" />,
    color: 'text-[--git-status-deleted]',
    label: 'Deleted',
  },
  Deleted: {
    icon: <FileX className="w-4 h-4" />,
    color: 'text-[--git-status-deleted]',
    label: 'Deleted',
  },
  renamed: {
    icon: <FileSymlink className="w-4 h-4" />,
    color: 'text-[--git-status-renamed]',
    label: 'Renamed',
  },
  Renamed: {
    icon: <FileSymlink className="w-4 h-4" />,
    color: 'text-[--git-status-renamed]',
    label: 'Renamed',
  },
};

const DEFAULT_STATUS_INFO = {
  icon: <FileEdit className="w-4 h-4" />,
  color: 'text-[--color-text-secondary]',
  label: 'Changed',
};

function getStatusInfo(status?: string): { icon: React.ReactNode; color: string; label: string } {
  return status ? STATUS_INFO_MAP[status] || DEFAULT_STATUS_INFO : DEFAULT_STATUS_INFO;
}

export function EditorToolbar({
  fileName,
  filePath,
  fileStatus,
  additions,
  deletions,
  viewMode,
  onViewModeChange,
}: EditorToolbarProps) {
  const statusInfo = getStatusInfo(fileStatus);
  const total = additions + deletions;
  const addPercent = total > 0 ? (additions / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[--git-panel-border] bg-[--git-panel-header]">
      {/* Left: File info */}
      <div className="flex items-center gap-3 min-w-0">
        <span className={statusInfo.color}>{statusInfo.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[--color-text-primary] truncate">
              {fileName}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusInfo.color} bg-current/10`}
            >
              {statusInfo.label}
            </span>
          </div>
          {filePath !== fileName && (
            <span className="text-xs text-[--color-text-tertiary] truncate block">{filePath}</span>
          )}
        </div>
      </div>

      {/* Right: Stats & View Toggle */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Stats */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-[--git-status-added]">
            <Plus className="w-3 h-3" />
            {additions}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-[--git-status-deleted]">
            <Minus className="w-3 h-3" />
            {deletions}
          </span>
          {total > 0 && (
            <div className="flex w-16 h-1.5 rounded-full overflow-hidden bg-[--color-bg-surface-3]">
              <div className="h-full bg-[--git-status-added]" style={{ width: `${addPercent}%` }} />
              <div
                className="h-full bg-[--git-status-deleted]"
                style={{ width: `${100 - addPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-md overflow-hidden border border-[--git-panel-border]">
          <button
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:bg-[--color-bg-surface-3]'
            }`}
            title="Side-by-side view"
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            Split
          </button>
          <button
            onClick={() => onViewModeChange('unified')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'unified'
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:bg-[--color-bg-surface-3]'
            }`}
            title="Unified view"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Unified
          </button>
        </div>
      </div>
    </div>
  );
}
