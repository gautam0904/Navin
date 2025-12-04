/* eslint-disable complexity */
import React from 'react';
import { Plus, FileEdit, Trash2, ArrowRight, AlertTriangle, FileQuestion } from 'lucide-react';

export type FileStatusType =
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed'
  | 'conflicted'
  | 'untracked';

interface FileStatusBadgeProps {
  status: FileStatusType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  FileStatusType,
  {
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    className: string;
  }
> = {
  added: {
    label: 'Added',
    shortLabel: 'A',
    icon: <Plus className="w-3 h-3" />,
    className: 'git-status-badge--added',
  },
  modified: {
    label: 'Modified',
    shortLabel: 'M',
    icon: <FileEdit className="w-3 h-3" />,
    className: 'git-status-badge--modified',
  },
  deleted: {
    label: 'Deleted',
    shortLabel: 'D',
    icon: <Trash2 className="w-3 h-3" />,
    className: 'git-status-badge--deleted',
  },
  renamed: {
    label: 'Renamed',
    shortLabel: 'R',
    icon: <ArrowRight className="w-3 h-3" />,
    className: 'git-status-badge--renamed',
  },
  conflicted: {
    label: 'Conflict',
    shortLabel: '!',
    icon: <AlertTriangle className="w-3 h-3" />,
    className: 'git-status-badge--conflicted',
  },
  untracked: {
    label: 'Untracked',
    shortLabel: 'U',
    icon: <FileQuestion className="w-3 h-3" />,
    className: 'git-status-badge--untracked',
  },
};

export function FileStatusBadge({ status, showLabel = false, size = 'sm' }: FileStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`git-status-badge ${config.className} ${sizeClasses} inline-flex items-center gap-1`}
      title={config.label}
    >
      {config.icon}
      {showLabel ? config.label : config.shortLabel}
    </span>
  );
}

export function FileStatusIcon({
  status,
  className = '',
}: {
  status: FileStatusType;
  className?: string;
}) {
  const config = statusConfig[status];
  if (!config) return null;

  const colorClasses: Record<FileStatusType, string> = {
    added: 'text-[var(--git-status-added)]',
    modified: 'text-[var(--git-status-modified)]',
    deleted: 'text-[var(--git-status-deleted)]',
    renamed: 'text-[var(--git-status-renamed)]',
    conflicted: 'text-[var(--git-status-conflicted)]',
    untracked: 'text-[var(--git-status-untracked)]',
  };

  return (
    <span className={`${colorClasses[status]} ${className}`} title={config.label}>
      {config.icon}
    </span>
  );
}

// Helper to convert backend status to our type
export function parseFileStatus(backendStatus: string | object): FileStatusType {
  const tag = typeof backendStatus === 'string' ? backendStatus : Object.keys(backendStatus)[0];

  switch (tag?.toLowerCase()) {
    case 'added':
    case 'new':
      return 'added';
    case 'modified':
    case 'changed':
      return 'modified';
    case 'deleted':
    case 'removed':
      return 'deleted';
    case 'renamed':
      return 'renamed';
    case 'conflicted':
    case 'conflict':
      return 'conflicted';
    case 'untracked':
    default:
      return 'untracked';
  }
}
