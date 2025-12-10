import React, { useRef } from 'react';
import { useGit } from '@/contexts/GitContext';
import { RecentCommits } from './RecentCommits';
import { GitFilterModal } from '../../GitFilterModal';
import {
  EmptyState,
  ConflictedFilesBanner,
  StatsHeader,
  CommitSection,
  StagingColumns,
} from './ChangesPanelHelpers';
import {
  useFileSelection,
  useFilteredFiles,
  calculateStats,
  useFilterHandlers,
} from './ChangesPanelHooks';

interface ChangesPanelProps {
  selectedFile?: string | null;
  onFileSelect?: (path: string | null) => void;
  globalQuery?: string;
  globalFilterType?: 'all' | 'modified' | 'added' | 'deleted';
  hideColumnFilters?: boolean;
}

export function ChangesPanel({
  selectedFile: externalSelectedFile,
  onFileSelect: externalOnFileSelect,
  globalQuery,
  globalFilterType = 'all',
  hideColumnFilters = true,
}: ChangesPanelProps = {}) {
  const { status, stageFile, unstageFile, stageAll, unstageAll, isLoading } = useGit();
  const { selectedFile, setSelectedFile } = useFileSelection(
    externalSelectedFile,
    externalOnFileSelect
  );
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const {
    gQuery,
    gType,
    isFilterOpen,
    filterAnchorRect,
    handleFilterClick,
    handleFilterApply,
    handleFilterClose,
  } = useFilterHandlers(
    globalQuery,
    globalFilterType,
    filterBtnRef as React.RefObject<HTMLButtonElement>
  );

  const { unstagedFiles, stagedFiles } = useFilteredFiles(status, gQuery, gType);
  const conflictedFiles = status?.conflicted || [];
  const isClean = status?.is_clean || false;
  const hasStaged = stagedFiles.length > 0;
  const { totalFiles, totalAdditions, totalDeletions } = calculateStats(unstagedFiles, stagedFiles);

  if (!status) {
    return (
      <div className="flex flex-col h-full bg-[--git-panel-bg]">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[--git-panel-bg]">
      <ConflictedFilesBanner count={conflictedFiles.length} />
      <StatsHeader
        totalFiles={totalFiles}
        totalAdditions={totalAdditions}
        totalDeletions={totalDeletions}
        gQuery={gQuery}
        gType={gType}
        onFilterClick={handleFilterClick}
        filterBtnRef={filterBtnRef as React.RefObject<HTMLButtonElement>}
      />
      {hasStaged && <CommitSection />}
      <StagingColumns
        unstagedFiles={unstagedFiles}
        stagedFiles={stagedFiles}
        hasStaged={hasStaged}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        stageAll={stageAll}
        stageFile={stageFile}
        unstageAll={unstageAll}
        unstageFile={unstageFile}
        isLoading={isLoading}
        isClean={isClean}
        hideColumnFilters={hideColumnFilters}
      />
      <div className="mt-auto">
        <RecentCommits />
      </div>
      <GitFilterModal
        isOpen={isFilterOpen}
        query={gQuery}
        type={gType}
        onApply={handleFilterApply}
        onClose={handleFilterClose}
        anchorRect={filterAnchorRect}
        placement="bottom-end"
      />
    </div>
  );
}
