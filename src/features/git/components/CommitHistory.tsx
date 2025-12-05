import { useEffect, useState, useMemo } from 'react';
import { GitCommit, User, ChevronRight, Hash, Clock, History, Filter } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';
import type { CommitSummary } from '@/types/git';

interface CommitHistoryProps {
  onSelectCommit: (sha: string) => void;
  selectedSha?: string;
}

// Extend CommitSummary with optional email

// Quality filter options
type QualityFilter = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

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
      label = format(date, 'EEEE');
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
  return `hsl(${hue}, 60%, 50%)`;
}

// Parse commit type from message
function parseCommitType(message: string): { type: string; color: string } | null {
  const match = message.match(
    /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.*?\))?:/i
  );
  if (!match) return null;

  const typeColors: Record<string, string> = {
    feat: '#10b981',
    fix: '#ef4444',
    docs: '#3b82f6',
    style: '#8b5cf6',
    refactor: '#f59e0b',
    test: '#06b6d4',
    chore: '#6b7280',
    build: '#ec4899',
    ci: '#14b8a6',
    perf: '#f97316',
    revert: '#dc2626',
  };

  const type = match[1].toLowerCase();
  return { type, color: typeColors[type] || '#6b7280' };
}

interface CommitAvatarProps {
  name: string;
  email: string;
  size?: 'sm' | 'md';
}

function CommitAvatar({ name, email, size = 'md' }: CommitAvatarProps) {
  const initials = getInitials(name);
  const color = stringToColor(email);
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs';

  return (
    <div
      className={`${sizeClasses} rounded-lg flex items-center justify-center font-bold text-white shrink-0 shadow-sm`}
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
      title={`${name} <${email}>`}
    >
      {initials}
    </div>
  );
}

interface CommitItemProps {
  commit: CommitSummary;
  isSelected: boolean;
  index: number;
  totalInGroup: number;
  onSelect: () => void;
}

function CommitItem({ commit, isSelected, index, totalInGroup, onSelect }: CommitItemProps) {
  const firstLine = commit.message.split('\n')[0];
  const hasMoreLines = commit.message.includes('\n');
  const commitType = parseCommitType(firstLine);
  const isFirst = index === 0;
  const isLast = index === totalInGroup - 1;

  return (
    <div
      onClick={onSelect}
      className={`timeline-item group ${isSelected ? 'timeline-item-selected' : ''}`}
    >
      {/* Timeline connector */}
      {!isFirst && (
        <div className="absolute left-[19px] top-0 h-1/2 w-0.5 bg-[var(--color-border-light)]" />
      )}
      {!isLast && (
        <div className="absolute left-[19px] bottom-0 h-1/2 w-0.5 bg-[var(--color-border-light)]" />
      )}

      {/* Timeline node */}
      <div className={`timeline-node ${isSelected ? 'timeline-node-active' : ''}`} />

      {/* Commit content */}
      <div className="flex items-start gap-3 pl-10">
        <CommitAvatar name={commit.author_name} email={commit.author_name} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-start gap-2 min-w-0">
              {commitType && (
                <span
                  className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded"
                  style={{
                    backgroundColor: `${commitType.color}20`,
                    color: commitType.color,
                    border: `1px solid ${commitType.color}40`,
                  }}
                >
                  {commitType.type}
                </span>
              )}
              <p
                className={`text-sm font-medium leading-tight ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'} line-clamp-2`}
              >
                {commitType
                  ? firstLine.replace(
                      /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.*?\))?:\s*/i,
                      ''
                    )
                  : firstLine}
                {hasMoreLines && <span className="text-[var(--color-text-tertiary)]"> ...</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-tertiary)] bg-[var(--color-bg-surface-2)] px-2 py-1 rounded-md border border-[var(--color-border-light)]">
                <Hash className="w-3 h-3" />
                {commit.sha.substring(0, 7)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1.5 truncate">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{commit.author_name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
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
}

function DateGroup({ label, commits, selectedSha, onSelectCommit }: DateGroupProps) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-4 py-2 sticky top-0 bg-[var(--git-panel-bg)] z-10 border-b border-[var(--color-border-light)]">
        {label}
      </h3>
      {commits.map((commit, idx) => (
        <CommitItem
          key={commit.sha}
          commit={commit}
          isSelected={selectedSha === commit.sha}
          index={idx}
          totalInGroup={commits.length}
          onSelect={() => onSelectCommit(commit.sha)}
        />
      ))}
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="empty-state h-full">
      <div className="empty-state-icon">
        <History className="w-10 h-10" />
      </div>
      <h3 className="empty-state-title">No commits yet</h3>
      <p className="empty-state-description">Make your first commit to start tracking history</p>
    </div>
  );
}

export function CommitHistory({ onSelectCommit, selectedSha }: CommitHistoryProps) {
  const { history: commits, refreshHistory: loadCommits, repository, isLoading } = useGit();
  const [qualityFilter, setQualityFilter] = useState<QualityFilter>('all');

  useEffect(() => {
    if (repository) {
      loadCommits();
    }
  }, [repository, loadCommits]);

  // Calculate filter stats

  // Filter commits by quality
  const filteredCommits = useMemo(() => {
    if (!commits || qualityFilter === 'all') return commits;

    return commits;
  }, [commits, qualityFilter]);

  const groupedCommits = useMemo(() => {
    if (!filteredCommits) return [];
    return groupCommitsByDate(filteredCommits as CommitSummary[]);
  }, [filteredCommits]);

  if (isLoading && !commits?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <GitCommit className="w-6 h-6 text-[var(--color-primary)] animate-pulse" />
          <span className="text-xs text-[var(--color-text-tertiary)]">Loading commits...</span>
        </div>
      </div>
    );
  }

  if (!commits || commits.length === 0) {
    return <EmptyHistoryState />;
  }

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)]">
      {/* Commit list */}
      <div className="flex-1 overflow-y-auto">
        {filteredCommits && filteredCommits.length > 0 ? (
          groupedCommits.map((group) => (
            <DateGroup
              key={group.label}
              label={group.label}
              commits={group.commits}
              selectedSha={selectedSha}
              onSelectCommit={onSelectCommit}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Filter className="w-8 h-8 text-[var(--color-text-tertiary)] mb-3 opacity-50" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              No commits match the {qualityFilter} quality filter
            </p>
            <button
              onClick={() => setQualityFilter('all')}
              className="mt-3 text-xs text-[var(--color-primary)] hover:underline"
            >
              Show all commits
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
