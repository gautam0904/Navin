import { Plus, Minus, FileCode, File, Shield, ExternalLink, X, FileText } from 'lucide-react';
import { FileStatusBadge, parseFileStatus, type FileStatusType } from './FileStatusBadge';
import type { FileStatus } from '@/types/git';
import React from 'react';

function getFileStatusType(status: FileStatus['status']): FileStatusType {
  return parseFileStatus(status);
}

// Get file extension for icon coloring
function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

// Get color and icon based on file type
function getFileTypeInfo(ext: string): { color: string; icon: React.ReactNode } {
  const baseClass = 'w-4 h-4';
  const icons: Record<string, { color: string; icon: React.ReactNode }> = {
    ts: { color: '#3178c6', icon: <FileCode className={baseClass} style={{ color: '#3178c6' }} /> },
    tsx: {
      color: '#3178c6',
      icon: <FileCode className={baseClass} style={{ color: '#3178c6' }} />,
    },
    js: { color: '#f7df1e', icon: <FileCode className={baseClass} style={{ color: '#f7df1e' }} /> },
    jsx: {
      color: '#61dafb',
      icon: <FileCode className={baseClass} style={{ color: '#61dafb' }} />,
    },
    css: {
      color: '#264de4',
      icon: <FileCode className={baseClass} style={{ color: '#264de4' }} />,
    },
    scss: {
      color: '#cc6699',
      icon: <FileCode className={baseClass} style={{ color: '#cc6699' }} />,
    },
    html: {
      color: '#e34c26',
      icon: <FileCode className={baseClass} style={{ color: '#e34c26' }} />,
    },
    json: {
      color: '#cbcb41',
      icon: <FileText className={baseClass} style={{ color: '#cbcb41' }} />,
    },
    md: { color: '#083fa1', icon: <FileText className={baseClass} style={{ color: '#083fa1' }} /> },
    rs: { color: '#dea584', icon: <FileCode className={baseClass} style={{ color: '#dea584' }} /> },
    py: { color: '#3776ab', icon: <FileCode className={baseClass} style={{ color: '#3776ab' }} /> },
    go: { color: '#00add8', icon: <FileCode className={baseClass} style={{ color: '#00add8' }} /> },
  };
  return (
    icons[ext] || { color: 'var(--color-text-tertiary)', icon: <File className={baseClass} /> }
  );
}

// Quality score display for file items
interface FileQualityScore {
  score: number;
  issueCount: number;
}

function getQualityLevel(score: number): { color: string; bgColor: string } {
  if (score >= 90) return { color: '#10b981', bgColor: 'rgba(16,185,129,0.15)' };
  if (score >= 75) return { color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)' };
  if (score >= 60) return { color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)' };
  return { color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)' };
}

function FileQualityBadge({ quality }: { quality: FileQualityScore }) {
  const { color, bgColor } = getQualityLevel(quality.score);

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0"
      style={{ backgroundColor: bgColor, color }}
      title={`Quality: ${quality.score}% • ${quality.issueCount} issue${quality.issueCount !== 1 ? 's' : ''}`}
    >
      <Shield className="w-3 h-3" />
      {quality.score}
    </div>
  );
}

interface FileItemActionsProps {
  isStaged: boolean;
  onActionClick: (e: React.MouseEvent) => void;
  onDiscard?: (e: React.MouseEvent) => void;
  onOpenFile: (e: React.MouseEvent) => void;
}

function FileItemActions({ isStaged, onActionClick, onDiscard, onOpenFile }: FileItemActionsProps) {
  return (
    <div className="list-item-actions flex items-center gap-1">
      <button
        onClick={onActionClick}
        className={`
          p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100
          ${isStaged
            ? 'hover:bg-[rgba(239,68,68,0.15)] text-[--color-error]'
            : 'hover:bg-[rgba(16,185,129,0.15)] text-[--color-success]'
          }
        `}
        title={isStaged ? 'Unstage file' : 'Stage file'}
      >
        {isStaged ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      {!isStaged && onDiscard && (
        <button
          onClick={onDiscard}
          className="p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 hover:bg-[rgba(239,68,68,0.15)] text-[--color-error]"
          title="Discard changes"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onOpenFile}
        className="p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 hover:bg-[--color-bg-surface-2] text-[--color-text-secondary]"
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
  const fileTypeInfo = getFileTypeInfo(fileExt);
  const additions = file.additions ?? 0;
  const deletions = file.deletions ?? 0;
  return { statusType, fileName, filePath, fileTypeInfo, additions, deletions };
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
    window.dispatchEvent(new CustomEvent('open-file', { detail: { path: file.path } }));
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
  qualityScore,
}: FileItemProps) {
  const { statusType, fileName, filePath, fileTypeInfo, additions, deletions } = useFileInfo(file);
  const { handleActionClick, handleOpenFile, handleDiscard } = useFileHandlers(
    file,
    fileName,
    isStaged,
    onStage,
    onUnstage
  );

  return (
    <div
      onClick={onSelect}
      className={`list-item group ${isSelected ? 'list-item-active' : ''} min-h-[40px]`}
    >
      <div className="shrink-0 w-4 h-4 flex items-center justify-center">{fileTypeInfo.icon}</div>

      <div className="list-item-content flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="list-item-title font-semibold text-white text-[13px] leading-tight">
            {fileName}
          </span>
          <FileStatusBadge status={statusType} />
          <span className="flex items-center gap-1 text-xs font-medium text-[--color-text-secondary]">
            <span className="text-[--git-status-added]">+{additions}</span>
            <span className="text-[--git-status-deleted]">-{deletions}</span>
          </span>
          {qualityScore && <FileQualityBadge quality={qualityScore} />}
        </div>
        {filePath && (
          <span className="list-item-subtitle text-[--color-text-secondary] text-[11px] opacity-70 leading-tight mt-0.5 block truncate">
            {filePath}
          </span>
        )}
      </div>

      <FileItemActions
        isStaged={isStaged}
        onActionClick={handleActionClick}
        onDiscard={!isStaged ? handleDiscard : undefined}
        onOpenFile={handleOpenFile}
      />
    </div>
  );
}

// Export types for use in other components
export type { FileQualityScore };
