import React from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useGit } from '../contexts/GitContext';
import type { RepositoryStatus } from '../types/git';

const StatusIndicator: React.FC<{
  isLoading: boolean;
  isClean: boolean;
  stagedCount: number;
  unstagedCount: number;
}> = ({ isLoading, isClean, stagedCount, unstagedCount }) => {
  if (isLoading) {
    return (
      <span className="flex items-center gap-2 text-[--color-text-secondary]">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        Syncing...
      </span>
    );
  }

  if (isClean) {
    return (
      <span className="flex items-center gap-2 text-[--git-ahead]">
        <Check className="w-3.5 h-3.5" />
        Working tree clean
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 text-[--color-text-secondary]">
      <AlertCircle className="w-3.5 h-3.5 text-[--git-status-modified]" />
      {stagedCount} staged, {unstagedCount} changed
    </span>
  );
};

const RepositoryPath: React.FC<{ path: string | undefined }> = ({ path }) => {
  if (!path) return null;
  return (
    <div className="flex items-center gap-4 text-[--color-text-tertiary]">
      <span className="truncate max-w-[300px]" title={path}>
        {path}
      </span>
    </div>
  );
};

const getStagedCount = (status: RepositoryStatus | null) => status?.staged?.length || 0;
const getUnstagedCount = (status: RepositoryStatus | null) =>
  (status?.unstaged?.length || 0) + (status?.untracked?.length || 0);
const getIsClean = (status: RepositoryStatus | null) => status?.is_clean ?? true;

export function StatusBar() {
  const { repository, status, isLoading } = useGit();
  const stagedCount = getStagedCount(status);
  const unstagedCount = getUnstagedCount(status);
  const isClean = getIsClean(status);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-[--git-panel-border] bg-[--git-panel-header] text-xs">
      <div className="flex items-center gap-4">
        <StatusIndicator
          isLoading={isLoading}
          isClean={isClean}
          stagedCount={stagedCount}
          unstagedCount={unstagedCount}
        />
      </div>
      <RepositoryPath path={repository?.path} />
    </div>
  );
}
