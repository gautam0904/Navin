import {
  Plus,
  Minus,
  FileCode,
  FileEdit,
  FilePlus2,
  FileX2,
  AlertTriangle,
  File,
  Shield,
} from 'lucide-react';
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

// Get color based on file type
function getFileTypeColor(ext: string): string {
  const colors: Record<string, string> = {
    ts: '#3178c6',
    tsx: '#3178c6',
    js: '#f7df1e',
    jsx: '#61dafb',
    css: '#264de4',
    scss: '#cc6699',
    html: '#e34c26',
    json: '#cbcb41',
    md: '#083fa1',
    rs: '#dea584',
    py: '#3776ab',
    go: '#00add8',
  };
  return colors[ext] || 'var(--color-text-tertiary)';
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

interface FileItemProps {
  file: FileStatus;
  onStage?: () => void;
  onUnstage?: () => void;
  isStaged?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  qualityScore?: FileQualityScore;
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
  const statusType = getFileStatusType(file.status);
  const fileName = file.path.split('/').pop() || file.path;
  const filePath = file.path.substring(0, file.path.lastIndexOf('/'));
  const fileExt = getFileExtension(fileName);
  const fileColor = getFileTypeColor(fileExt);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStaged) {
      onUnstage?.();
    } else {
      onStage?.();
    }
  };

  return (
    <div onClick={onSelect} className={`list-item ${isSelected ? 'list-item-active' : ''}`}>
      <div className="shrink-0">
        <FileStatusIcon status={statusType} color={fileColor} />
      </div>

      <div className="list-item-content">
        <div className="flex items-center gap-2">
          <span className="list-item-title">{fileName}</span>
          <FileStatusBadge status={statusType} />
          {qualityScore && <FileQualityBadge quality={qualityScore} />}
        </div>
        {filePath && <span className="list-item-subtitle">{filePath}</span>}
      </div>

      <div className="list-item-actions">
        <button
          onClick={handleActionClick}
          className={`btn-premium btn-premium-icon btn-premium-sm ${
            isStaged
              ? 'hover:bg-[rgba(239,68,68,0.1)] text-[--color-error]'
              : 'hover:bg-[rgba(16,185,129,0.1)] text-[--color-success]'
          }`}
          title={isStaged ? 'Unstage file' : 'Stage file'}
        >
          {isStaged ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function FileStatusIcon({ status, color }: { status: FileStatusType; color: string }) {
  const baseClass = 'w-4 h-4';

  switch (status) {
    case 'added':
    case 'untracked':
      return <FilePlus2 className={baseClass} style={{ color: 'var(--git-status-added)' }} />;
    case 'modified':
      return <FileEdit className={baseClass} style={{ color: 'var(--git-status-modified)' }} />;
    case 'deleted':
      return <FileX2 className={baseClass} style={{ color: 'var(--git-status-deleted)' }} />;
    case 'conflicted':
      return (
        <AlertTriangle className={baseClass} style={{ color: 'var(--git-status-conflicted)' }} />
      );
    case 'renamed':
      return <FileCode className={baseClass} style={{ color: 'var(--git-status-renamed)' }} />;
    default:
      return <File className={baseClass} style={{ color }} />;
  }
}

// Export types for use in other components
export type { FileQualityScore };
