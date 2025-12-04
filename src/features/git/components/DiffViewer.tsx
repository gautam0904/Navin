/* eslint-disable complexity, max-lines, max-depth */
import React, { useState } from 'react';
import {
  FileCode,
  SplitSquareHorizontal,
  AlignLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  FileEdit,
} from 'lucide-react';

export interface DiffLine {
  type: 'add' | 'del' | 'context' | 'hunk';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface FileDiff {
  path: string;
  oldPath?: string; // For renames
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
}

interface DiffViewerProps {
  diff: FileDiff | null;
  viewMode?: 'unified' | 'split';
  onViewModeChange?: (mode: 'unified' | 'split') => void;
}

function DiffStats({ additions, deletions }: { additions: number; deletions: number }) {
  const total = additions + deletions;
  const addPercent = total > 0 ? (additions / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[var(--git-status-added)]">+{additions}</span>
      <span className="text-xs font-medium text-[var(--git-status-deleted)]">-{deletions}</span>
      <div className="flex w-16 h-1.5 rounded-full overflow-hidden bg-[var(--color-bg-surface-3)]">
        <div className="h-full bg-[var(--git-status-added)]" style={{ width: `${addPercent}%` }} />
        <div
          className="h-full bg-[var(--git-status-deleted)]"
          style={{ width: `${100 - addPercent}%` }}
        />
      </div>
    </div>
  );
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: 'unified' | 'split';
  onChange: (mode: 'unified' | 'split') => void;
}) {
  return (
    <div className="flex rounded-md overflow-hidden border border-[var(--git-panel-border)]">
      <button
        onClick={() => onChange('unified')}
        className={`flex items-center gap-1 px-2 py-1 text-xs ${
          mode === 'unified'
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-bg-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-3)]'
        }`}
        title="Unified View"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onChange('split')}
        className={`flex items-center gap-1 px-2 py-1 text-xs ${
          mode === 'split'
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-bg-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-3)]'
        }`}
        title="Split View"
      >
        <SplitSquareHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function UnifiedDiffLine({ line }: { line: DiffLine }) {
  let bgClass = '';
  let textClass = 'text-[var(--color-text-primary)]';
  let prefix = ' ';

  switch (line.type) {
    case 'add':
      bgClass = 'bg-[var(--git-diff-add-line)]';
      textClass = 'text-[var(--git-status-added)]';
      prefix = '+';

      break;
    case 'del':
      bgClass = 'bg-[var(--git-diff-del-line)]';
      textClass = 'text-[var(--git-status-deleted)]';
      prefix = '-';

      break;
    case 'hunk':
      bgClass = 'bg-[var(--git-diff-hunk)]';
      textClass = 'text-[var(--color-primary)] italic';
      prefix = '@@';
      break;
  }

  return (
    <div className={`git-diff-line flex ${bgClass} hover:brightness-95`}>
      {/* Line numbers */}
      <div className="git-diff-gutter w-12 shrink-0 select-none text-right pr-2 border-r border-[var(--git-panel-border)]">
        {line.type !== 'hunk' && line.oldLineNumber}
      </div>
      <div className="git-diff-gutter w-12 shrink-0 select-none text-right pr-2 border-r border-[var(--git-panel-border)]">
        {line.type !== 'hunk' && line.newLineNumber}
      </div>

      {/* Prefix indicator */}
      <div className={`w-6 shrink-0 text-center ${textClass}`}>
        {line.type === 'hunk' ? '' : prefix}
      </div>

      {/* Content */}
      <pre className={`flex-1 px-2 overflow-x-auto ${textClass}`}>{line.content}</pre>
    </div>
  );
}

function DiffHunkView({ hunk }: { hunk: DiffHunk }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-[var(--git-panel-border)] last:border-b-0">
      {/* Hunk header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 bg-[var(--git-diff-hunk)] hover:brightness-95 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-[var(--color-primary)]" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[var(--color-primary)]" />
        )}
        <code className="text-xs font-mono text-[var(--color-primary)]">{hunk.header}</code>
      </button>

      {/* Hunk lines */}
      {isExpanded && (
        <div className="overflow-x-auto">
          {hunk.lines.map((line, idx) => (
            <UnifiedDiffLine key={idx} line={line} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyDiffState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <FileCode className="w-16 h-16 mb-4 text-[var(--color-text-tertiary)] opacity-30" />
      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
        No file selected
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)]">
        Select a file from the changes list to view its diff
      </p>
    </div>
  );
}

export function DiffViewer({ diff, viewMode = 'unified', onViewModeChange }: DiffViewerProps) {
  const [mode, setMode] = useState<'unified' | 'split'>(viewMode);

  const handleModeChange = (newMode: 'unified' | 'split') => {
    setMode(newMode);
    onViewModeChange?.(newMode);
  };

  if (!diff) {
    return <EmptyDiffState />;
  }

  const statusColors: Record<string, string> = {
    added: 'text-[var(--git-status-added)]',
    modified: 'text-[var(--git-status-modified)]',
    deleted: 'text-[var(--git-status-deleted)]',
    renamed: 'text-[var(--git-status-renamed)]',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    added: <Plus className="w-4 h-4" />,
    modified: <FileEdit className="w-4 h-4" />,
    deleted: <Minus className="w-4 h-4" />,
    renamed: <FileEdit className="w-4 h-4" />,
  };

  return (
    <div className="flex flex-col h-full bg-[var(--git-panel-bg)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--git-panel-border)] bg-[var(--git-panel-header)]">
        <div className="flex items-center gap-3 min-w-0">
          <span className={statusColors[diff.status]}>{statusIcons[diff.status]}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {diff.path}
              </span>
              {diff.oldPath && (
                <span className="text-xs text-[var(--color-text-tertiary)]">← {diff.oldPath}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <DiffStats additions={diff.additions} deletions={diff.deletions} />
          <ViewModeToggle mode={mode} onChange={handleModeChange} />
        </div>
      </div>

      {/* Diff content */}
      <div className="flex-1 overflow-y-auto">
        {diff.hunks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[var(--color-text-tertiary)]">
            <p className="text-sm">No changes in this file</p>
          </div>
        ) : (
          diff.hunks.map((hunk, idx) => <DiffHunkView key={idx} hunk={hunk} />)
        )}
      </div>
    </div>
  );
}

// Helper to parse git diff output into our structure
export function parseDiffOutput(diffText: string): FileDiff | null {
  if (!diffText) return null;

  const lines = diffText.split('\n');
  let path = '';
  let oldPath: string | undefined;
  let status: FileDiff['status'] = 'modified';
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  let additions = 0;
  let deletions = 0;

  for (const line of lines) {
    // Parse file header
    if (line.startsWith('diff --git')) {
      const match = line.match(/diff --git a\/(.*) b\/(.*)/);
      if (match) {
        path = match[2];
        if (match[1] !== match[2]) {
          oldPath = match[1];
          status = 'renamed';
        }
      }
    }
    // Parse new file
    else if (line.startsWith('new file')) {
      status = 'added';
    }
    // Parse deleted file
    else if (line.startsWith('deleted file')) {
      status = 'deleted';
    }
    // Parse hunk header
    else if (line.startsWith('@@')) {
      const match = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
      if (match) {
        currentHunk = {
          header: line,
          lines: [],
          oldStart: parseInt(match[1]),
          oldCount: parseInt(match[2] || '1'),
          newStart: parseInt(match[3]),
          newCount: parseInt(match[4] || '1'),
        };
        hunks.push(currentHunk);
      }
    }
    // Parse content lines
    else if (currentHunk) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        currentHunk.lines.push({
          type: 'add',
          content: line.slice(1),
          newLineNumber:
            currentHunk.newStart + currentHunk.lines.filter((l) => l.type !== 'del').length,
        });
        additions++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        currentHunk.lines.push({
          type: 'del',
          content: line.slice(1),
          oldLineNumber:
            currentHunk.oldStart + currentHunk.lines.filter((l) => l.type !== 'add').length,
        });
        deletions++;
      } else if (line.startsWith(' ') || line === '') {
        const contextLines = currentHunk.lines.filter((l) => l.type !== 'del');
        const oldContextLines = currentHunk.lines.filter((l) => l.type !== 'add');
        currentHunk.lines.push({
          type: 'context',
          content: line.slice(1) || '',
          oldLineNumber: currentHunk.oldStart + oldContextLines.length,
          newLineNumber: currentHunk.newStart + contextLines.length,
        });
      }
    }
  }

  return {
    path,
    oldPath,
    status,
    hunks,
    additions,
    deletions,
  };
}
