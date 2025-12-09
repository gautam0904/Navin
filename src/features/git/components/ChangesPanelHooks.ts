import React, { useState, useMemo } from 'react';
import type { FileStatus } from '@/types/git';
import { parseFileStatus } from './FileStatusBadge';

export function useFileSelection(
  externalSelectedFile: string | null | undefined,
  externalOnFileSelect: ((path: string | null) => void) | undefined
) {
  const [internalSelectedFile, setInternalSelectedFile] = useState<string | null>(null);
  const selectedFile =
    externalSelectedFile !== undefined ? externalSelectedFile : internalSelectedFile;
  const setSelectedFile =
    externalOnFileSelect || ((path: string | null) => setInternalSelectedFile(path));
  return { selectedFile, setSelectedFile };
}

function matchesQuery(file: FileStatus, query: string): boolean {
  const q = query.toLowerCase();
  const fileName = file.path.split('/').pop()?.toLowerCase() || '';
  return file.path.toLowerCase().includes(q) || fileName.includes(q);
}

function matchesType(file: FileStatus, type: 'modified' | 'added' | 'deleted'): boolean {
  const statusType = parseFileStatus(file.status);
  if (type === 'modified') return statusType === 'modified';
  if (type === 'added') return statusType === 'added' || statusType === 'untracked';
  if (type === 'deleted') return statusType === 'deleted';
  return false;
}

function filterFiles(
  files: FileStatus[],
  query: string | undefined,
  type: 'all' | 'modified' | 'added' | 'deleted' | undefined
): FileStatus[] {
  let list = files;
  if (query && query.trim()) {
    list = list.filter((f) => matchesQuery(f, query));
  }
  if (type && type !== 'all') {
    list = list.filter((file) => matchesType(file, type));
  }
  return list;
}

export function useFilteredFiles(
  status: { unstaged?: FileStatus[]; untracked?: FileStatus[]; staged?: FileStatus[] } | null,
  query: string,
  type: 'all' | 'modified' | 'added' | 'deleted'
) {
  const unstagedFiles = useMemo(() => {
    const rawUnstaged = [...(status?.unstaged || []), ...(status?.untracked || [])];
    return filterFiles(rawUnstaged, query, type);
  }, [status?.unstaged, status?.untracked, query, type]);

  const stagedFiles = useMemo(() => {
    const rawStaged = status?.staged || [];
    return filterFiles(rawStaged, query, type);
  }, [status?.staged, query, type]);

  return { unstagedFiles, stagedFiles };
}

export function calculateStats(
  unstagedFiles: Array<{ additions?: number | null; deletions?: number | null }>,
  stagedFiles: Array<{ additions?: number | null; deletions?: number | null }>
) {
  const allFiles = [...unstagedFiles, ...stagedFiles];
  return {
    totalFiles: allFiles.length,
    totalAdditions: allFiles.reduce((sum, file) => sum + (file.additions ?? 0), 0),
    totalDeletions: allFiles.reduce((sum, file) => sum + (file.deletions ?? 0), 0),
  };
}

export function useFilterHandlers(
  globalQuery: string | undefined,
  globalFilterType: 'all' | 'modified' | 'added' | 'deleted',
  filterBtnRef: React.RefObject<HTMLButtonElement>
) {
  const [gQuery, setGQuery] = React.useState(globalQuery || '');
  const [gType, setGType] = React.useState<typeof globalFilterType>(globalFilterType);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterAnchorRect, setFilterAnchorRect] = React.useState<DOMRect | null>(null);

  const handleFilterClick = React.useCallback(() => {
    setFilterAnchorRect(filterBtnRef.current?.getBoundingClientRect() || null);
    setIsFilterOpen(true);
  }, [filterBtnRef]);

  const handleFilterApply = React.useCallback((q: string, t: typeof gType) => {
    setGQuery(q);
    setGType(t);
  }, []);

  const handleFilterClose = React.useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  return {
    gQuery,
    gType,
    isFilterOpen,
    filterAnchorRect,
    handleFilterClick,
    handleFilterApply,
    handleFilterClose,
  };
}
