import React from 'react';
import { File, AlertTriangle, Filter as FilterIcon } from 'lucide-react';
import { CommitComposer } from './CommitComposer';
import { StagingColumn } from './StagingColumn';
import type { FileStatus } from '@/types/git';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <File className="w-16 h-16 mb-4 text-(--color-text-tertiary) opacity-20" />
      <p className="text-sm font-medium text-(--color-text-secondary)">No repository open</p>
      <p className="text-xs text-(--color-text-tertiary) mt-1">Open a repository to see changes</p>
    </div>
  );
}

export function ConflictedFilesBanner({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-[rgba(239,68,68,0.1)] border-b border-[rgba(239,68,68,0.3)]">
      <AlertTriangle className="w-4 h-4 text-[--color-error] shrink-0" />
      <span className="text-sm font-medium text-[--color-error]">
        {count} conflicted {count === 1 ? 'file' : 'files'}
      </span>
    </div>
  );
}

export function StatsHeader({
  totalFiles,
  totalAdditions,
  totalDeletions,
  gQuery,
  gType,
  onFilterClick,
  filterBtnRef,
}: {
  totalFiles: number;
  totalAdditions: number;
  totalDeletions: number;
  gQuery: string;
  gType: 'all' | 'modified' | 'added' | 'deleted';
  onFilterClick: () => void;
  filterBtnRef: React.RefObject<HTMLButtonElement>;
}) {
  if (totalFiles === 0) return null;
  return (
    <div className="px-3 py-2 bg-[--git-panel-header] border-b border-[--git-panel-border] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[--color-text-primary]">
          {totalFiles} {totalFiles === 1 ? 'file' : 'files'} changed
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[--git-status-added] font-medium">+{totalAdditions}</span>
          <span className="text-[--git-status-deleted] font-medium">-{totalDeletions}</span>
        </div>
      </div>
      <button
        ref={filterBtnRef}
        onClick={onFilterClick}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-[--git-panel-border] text-[--color-text-secondary] hover:bg-[--color-bg-surface-2]"
        title="Filter files"
      >
        <FilterIcon className="w-3.5 h-3.5" />
        Filter
        {(gQuery || gType !== 'all') && (
          <span className="ml-1 text-[10px] text-[--color-primary]">•</span>
        )}
      </button>
    </div>
  );
}

export function CommitSection() {
  return (
    <div className="border-b-2 border-[--color-primary] bg-gradient-to-b from-[--git-panel-header] to-[--color-bg-surface-1] shadow-sm sticky top-0 z-10">
      <div className="px-3 pt-2.5 pb-1">
        <h3 className="text-xs font-semibold text-[--color-text-primary] mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[--color-primary] animate-pulse"></span>
          Commit Changes
        </h3>
      </div>
      <CommitComposer />
    </div>
  );
}

export function StagingColumns({
  unstagedFiles,
  stagedFiles,
  hasStaged,
  selectedFile,
  setSelectedFile,
  stageAll,
  stageFile,
  unstageAll,
  unstageFile,
  isLoading,
  isClean,
  hideColumnFilters,
}: {
  unstagedFiles: FileStatus[];
  stagedFiles: FileStatus[];
  hasStaged: boolean;
  selectedFile: string | null;
  setSelectedFile: (path: string | null) => void;
  stageAll: () => void;
  stageFile: (path: string) => void;
  unstageAll: () => void;
  unstageFile: (path: string) => void;
  isLoading: boolean;
  isClean: boolean;
  hideColumnFilters: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 border-b border-[--git-panel-border] overflow-hidden">
        <StagingColumn
          title="Changes"
          files={unstagedFiles}
          onStageAll={stageAll}
          onStageFile={stageFile}
          isStaged={false}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          isLoading={isLoading}
          isClean={isClean}
          hasOtherSectionFiles={hasStaged}
          showFilter={!hideColumnFilters}
        />
      </div>

      {hasStaged && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <StagingColumn
            title="Staged"
            files={stagedFiles}
            onUnstageAll={unstageAll}
            onUnstageFile={unstageFile}
            isStaged={true}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            isLoading={isLoading}
            isClean={isClean}
            hasOtherSectionFiles={unstagedFiles.length > 0}
            showFilter={!hideColumnFilters}
          />
        </div>
      )}
      {!hasStaged && (
        <div className="px-3 py-4 border-b border-dashed border-[--git-panel-border] bg-[--git-panel-header] flex items-center justify-center">
          <p className="text-xs text-[--color-text-tertiary] italic">
            No files staged • Drag here or select above
          </p>
        </div>
      )}
    </div>
  );
}
