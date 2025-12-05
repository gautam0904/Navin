import type { FileStatusType as GitStatusType } from '@/types/git';

export type FileStatusType =
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed'
  | 'untracked'
  | 'conflicted'
  | 'unknown';

// Parse the Git status type from backend - handles both string and object formats
// Exact matches / Short codes
function getShortCodeStatus(normalized: string): FileStatusType | null {
  const shortCodes: Record<string, FileStatusType> = {
    a: 'added',
    m: 'modified',
    d: 'deleted',
    r: 'renamed',
    '?': 'untracked',
    u: 'conflicted',
  };
  return shortCodes[normalized] || null;
}

// Substring matches
function getSubstringStatus(normalized: string): FileStatusType | null {
  if (normalized.includes('add') || normalized.includes('cop')) return 'added';
  if (normalized.includes('modif')) return 'modified';
  if (normalized.includes('delet')) return 'deleted';
  if (normalized.includes('renam')) return 'renamed';
  if (normalized.includes('untrack')) return 'untracked';
  if (normalized.includes('conflict')) return 'conflicted';
  return null;
}

function parseStringStatus(status: string): FileStatusType {
  const normalized = status.toLowerCase().trim();

  const shortCode = getShortCodeStatus(normalized);
  if (shortCode) return shortCode;

  const substringMatch = getSubstringStatus(normalized);
  if (substringMatch) return substringMatch;

  return 'unknown';
}

function parseObjectStatus(status: object): FileStatusType {
  const map: Record<string, FileStatusType> = {
    Added: 'added',
    Modified: 'modified',
    Deleted: 'deleted',
    Renamed: 'renamed',
    Copied: 'added',
    Untracked: 'untracked',
    Ignored: 'unknown',
    Conflicted: 'conflicted',
  };

  for (const key in map) {
    if (key in status) return map[key];
  }
  return 'unknown';
}

// Parse the Git status type from backend - handles both string and object formats
export function parseFileStatus(status: GitStatusType | string): FileStatusType {
  if (typeof status === 'string') {
    return parseStringStatus(status);
  }

  if (typeof status === 'object' && status !== null) {
    return parseObjectStatus(status);
  }

  return 'unknown';
}

interface FileStatusBadgeProps {
  status: FileStatusType;
  showLabel?: boolean;
}

const statusConfig: Record<FileStatusType, { label: string; className: string }> = {
  added: { label: 'A', className: 'status-badge-added' },
  modified: { label: 'M', className: 'status-badge-modified' },
  deleted: { label: 'D', className: 'status-badge-deleted' },
  renamed: { label: 'R', className: 'status-badge-renamed' },
  untracked: { label: 'U', className: 'status-badge-untracked' },
  conflicted: { label: '!', className: 'status-badge-conflicted' },
  unknown: { label: '?', className: 'status-badge-untracked' },
};

export function FileStatusBadge({ status, showLabel = false }: FileStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown;

  const fullLabels: Record<FileStatusType, string> = {
    added: 'Added',
    modified: 'Modified',
    deleted: 'Deleted',
    renamed: 'Renamed',
    untracked: 'Untracked',
    conflicted: 'Conflicted',
    unknown: 'Unknown',
  };

  return (
    <span className={`status-badge ${config.className}`} title={fullLabels[status]}>
      {showLabel ? fullLabels[status] : config.label}
    </span>
  );
}
