import React from 'react';
import {
  GitBranch,
  FolderGit2,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Download,
  Upload,
} from 'lucide-react';
import { useGit } from '../contexts/GitContext';

interface TopBarProps {
  onPull: () => void;
  onPush: () => void;
  onFetch: () => void;
  isLoading: boolean;
}

const BranchInfo: React.FC<{ branch: { name: string; ahead: number; behind: number } | null }> = ({
  branch,
}) => {
  if (!branch) return null;
  const { name, ahead, behind } = branch;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--color-bg-surface-2] border border-[--git-panel-border] hover:bg-[--color-bg-surface-3] transition-colors cursor-pointer group">
      <GitBranch className="w-4 h-4 text-[--git-branch-current] group-hover:text-[--color-primary] transition-colors" />
      <span className="text-sm font-semibold text-[--color-text-primary]">{name}</span>
      {(ahead > 0 || behind > 0) && (
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[--git-panel-border]">
          {behind > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-[--git-behind] bg-[rgba(239,68,68,0.1)] px-1.5 py-0.5 rounded">
              <ArrowDownCircle className="w-3.5 h-3.5" />
              {behind}
            </span>
          )}
          {ahead > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-[--git-ahead] bg-[rgba(16,185,129,0.1)] px-1.5 py-0.5 rounded">
              <ArrowUpCircle className="w-3.5 h-3.5" />
              {ahead}
            </span>
          )}
        </div>
      )}
      {ahead === 0 && behind === 0 && (
        <span className="text-[10px] text-[--color-text-tertiary] ml-1">synced</span>
      )}
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  variant?: 'primary' | 'secondary';
  title?: string;
}> = ({ onClick, disabled, icon, label, badge, variant = 'secondary', title }) => {
  const baseClasses =
    variant === 'primary'
      ? 'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white'
      : 'bg-[--color-bg-surface-2] hover:bg-[--color-bg-surface-3]';
  const badgeClasses = variant === 'primary' ? 'bg-white/20' : 'bg-[--git-behind] text-white';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${baseClasses} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      title={title}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${badgeClasses}`}>
          {badge}
        </span>
      )}
    </button>
  );
};

const RepositoryName: React.FC<{ name: string | undefined }> = ({ name }) => (
  <div className="flex items-center gap-2">
    <FolderGit2 className="w-5 h-5 text-[--color-primary]" />
    <span className="font-semibold text-[--color-text-primary]">{name || 'No Repository'}</span>
  </div>
);

const FetchButton: React.FC<{ onClick: () => void; disabled: boolean; isLoading: boolean }> = ({
  onClick,
  disabled,
  isLoading,
}) => (
  <ActionButton
    onClick={onClick}
    disabled={disabled}
    icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
    label="Fetch"
    title="Fetch from remote"
  />
);

const PullButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  behind: number;
}> = ({ onClick, disabled, behind }) => (
  <ActionButton
    onClick={onClick}
    disabled={disabled}
    icon={<Download className="w-4 h-4" />}
    label="Pull"
    badge={behind > 0 ? behind : undefined}
    title={behind > 0 ? `Pull ${behind} commits` : 'Pull from remote'}
  />
);

const PushButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  ahead: number;
}> = ({ onClick, disabled, ahead }) => (
  <ActionButton
    onClick={onClick}
    disabled={disabled}
    icon={<Upload className="w-4 h-4" />}
    label="Push"
    badge={ahead > 0 ? ahead : undefined}
    variant="primary"
    title={ahead > 0 ? `Push ${ahead} commits` : 'Push to remote'}
  />
);

const ActionButtons: React.FC<{
  onFetch: () => void;
  onPull: () => void;
  onPush: () => void;
  isLoading: boolean;
  hasRemote: boolean | null;
  ahead: number;
  behind: number;
}> = ({ onFetch, onPull, onPush, isLoading, hasRemote, ahead, behind }) => (
  <div className="flex items-center gap-2">
    <FetchButton onClick={onFetch} disabled={isLoading || !hasRemote} isLoading={isLoading} />
    <PullButton
      onClick={onPull}
      disabled={isLoading || !hasRemote || behind === 0}
      behind={behind}
    />
    <PushButton onClick={onPush} disabled={isLoading || !hasRemote || ahead === 0} ahead={ahead} />
  </div>
);

export function TopBar({ onPull, onPush, onFetch, isLoading }: TopBarProps) {
  const { repository, branches, remotes } = useGit();

  const currentBranch = branches?.find((b) => b.is_head);
  const ahead = currentBranch?.ahead || 0;
  const behind = currentBranch?.behind || 0;
  const hasRemote = remotes && remotes.length > 0;

  const branchInfo = currentBranch ? { name: currentBranch.name, ahead, behind } : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[--git-panel-border] bg-[--git-panel-header]">
      <div className="flex items-center gap-4">
        <RepositoryName name={repository?.name} />
        <BranchInfo branch={branchInfo} />
      </div>
      <div className="flex items-center">
        <ActionButtons
          onFetch={onFetch}
          onPull={onPull}
          onPush={onPush}
          isLoading={isLoading}
          hasRemote={hasRemote}
          ahead={ahead}
          behind={behind}
        />
      </div>
    </div>
  );
}
