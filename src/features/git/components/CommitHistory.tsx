import React, { useEffect, useState, useMemo } from 'react';
import { GitCommit, Calendar, User, ChevronRight, Hash, Circle } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface CommitHistoryProps {
  onSelectCommit: (sha: string) => void;
  selectedSha?: string;
}

interface CommitSummary {
  sha: string;
  message: string;
  author_name: string;
  author_email?: string; // Optional - may not be provided by backend
  timestamp: string;
}

// Group commits by date
function groupCommitsByDate(commits: CommitSummary[]) {
  const groups: { label: string; commits: CommitSummary[] }[] = [];
  let currentGroup: { label: string; commits: CommitSummary[] } | null = null;

  commits.forEach((commit) => {
    const date = new Date(commit.timestamp);
    let label: string;

    if (isToday(date)) {
      label = 'Today';
    } else if (isYesterday(date)) {
      label = 'Yesterday';
    } else if (isThisWeek(date)) {
      label = format(date, 'EEEE'); // Day name
    } else {
      label = format(date, 'MMMM d, yyyy');
    }

    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, commits: [] };
      groups.push(currentGroup);
    }
    currentGroup.commits.push(commit);
  });

  return groups;
}

// Get initials from name for avatar
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color from string
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

interface CommitAvatarProps {
  name: string;
  email: string;
  size?: 'sm' | 'md';
}

function CommitAvatar({ name, email, size = 'md' }: CommitAvatarProps) {
  const initials = getInitials(name);
  const color = stringToColor(email);
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: color }}
      title={`${name} <${email}>`}
    >
      {initials}
    </div>
  );
}

interface CommitItemProps {
  commit: CommitSummary;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
}

function CommitItem({ commit, isSelected, isFirst, isLast, onSelect }: CommitItemProps) {
  const firstLine = commit.message.split('\n')[0];
  const hasMoreLines = commit.message.includes('\n');

  return (
    <div
      onClick={onSelect}
      className={`
        git-commit-item group cursor-pointer relative
        ${isSelected ? 'git-commit-item--selected' : ''}
      `}
    >
      {/* Timeline connector */}
      <div className="absolute left-[26px] top-0 bottom-0 flex flex-col items-center pointer-events-none">
        {!isFirst && <div className="w-0.5 flex-1 bg-[var(--git-panel-border)]" />}
        <Circle
          className={`w-2.5 h-2.5 shrink-0 ${isSelected ? 'text-[var(--color-primary)] fill-current' : 'text-[var(--git-commit-sha)]'}`}
        />
        {!isLast && <div className="w-0.5 flex-1 bg-[var(--git-panel-border)]" />}
      </div>

      {/* Commit content */}
      <div className="flex items-start gap-3 pl-10">
        <CommitAvatar name={commit.author_name} email={commit.author_email || commit.author_name} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className={`text-sm font-medium leading-tight ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'} line-clamp-2`}
            >
              {firstLine}
              {hasMoreLines && <span className="text-[var(--color-text-tertiary)]"> ...</span>}
            </p>
            <span className="shrink-0 text-[10px] font-mono text-[var(--git-commit-sha)] bg-[var(--color-bg-surface-2)] px-1.5 py-0.5 rounded flex items-center gap-1">
              <Hash className="w-2.5 h-2.5" />
              {commit.sha.substring(0, 7)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--git-commit-date)]">
            <span className="flex items-center gap-1 truncate">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{commit.author_name}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true })}</span>
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" />
      </div>
    </div>
  );
}

interface DateGroupProps {
  label: string;
  commits: CommitSummary[];
  selectedSha?: string;
  onSelectCommit: (sha: string) => void;
  isFirstGroup: boolean;
}

function DateGroup({ label, commits, selectedSha, onSelectCommit, isFirstGroup }: DateGroupProps) {
  return (
    <div className="relative">
      {/* Date header */}
      <div
        className={`sticky top-0 z-10 px-4 py-2 bg-[var(--git-panel-header)] border-b border-[var(--git-panel-border)] ${!isFirstGroup ? 'border-t' : ''}`}
      >
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Commits */}
      <div>
        {commits.map((commit, idx) => (
          <CommitItem
            key={commit.sha}
            commit={commit}
            isSelected={selectedSha === commit.sha}
            isFirst={idx === 0}
            isLast={idx === commits.length - 1}
            onSelect={() => onSelectCommit(commit.sha)}
          />
        ))}
      </div>
    </div>
  );
}

export function CommitHistory({ onSelectCommit, selectedSha }: CommitHistoryProps) {
  const { history, refreshHistory, isLoading } = useGit();
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  useEffect(() => {
    refreshHistory(LIMIT, 0);
  }, [refreshHistory]);

  const groupedCommits = useMemo(() => {
    if (!history) return [];
    return groupCommitsByDate(history);
  }, [history]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    refreshHistory(LIMIT, nextPage * LIMIT);
  };

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-tertiary)] p-8">
        <GitCommit className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium mb-1">No commits yet</p>
        <p className="text-xs text-center">Make your first commit to see the history</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Commit History</h2>
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-surface-2)] px-2 py-0.5 rounded-full">
          {history.length} commits
        </span>
      </div>

      {/* Commit list */}
      <div className="flex-1 overflow-y-auto">
        {groupedCommits.map((group, idx) => (
          <DateGroup
            key={group.label}
            label={group.label}
            commits={group.commits}
            selectedSha={selectedSha}
            onSelectCommit={onSelectCommit}
            isFirstGroup={idx === 0}
          />
        ))}

        {/* Load More */}
        <div className="p-4 text-center border-t border-[var(--git-panel-border)]">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {isLoading ? 'Loading...' : 'Load older commits'}
          </button>
        </div>
      </div>
    </div>
  );
}
