import React, { useState } from 'react';
import {
  AlignLeft,
  FileCode,
  FileEdit,
  Minus,
  Plus,
  SplitSquareHorizontal,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { FileDiff, QualityHint } from '../types/diff';
import { DiffHunkView } from './DiffHunkView';
import { parseDiffOutput } from '../utils/diffParser';

interface DiffViewerProps {
  diff: FileDiff | null;
  viewMode?: 'unified' | 'split';
  onViewModeChange?: (mode: 'unified' | 'split') => void;
  qualityHints?: QualityHint[];
  onApplyFix?: (hint: QualityHint) => void;
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

function EmptyDiffState() {
  return (
    <div className="empty-state h-full">
      <div className="empty-state-icon">
        <FileCode className="w-10 h-10" />
      </div>
      <h3 className="empty-state-title">No file selected</h3>
      <p className="empty-state-description">
        Select a file from the changes list to view its diff
      </p>
    </div>
  );
}

// Quality summary for the file
function QualitySummary({ hints }: { hints: QualityHint[] }) {
  if (hints.length === 0) return null;

  const errorCount = hints.filter((h) => h.type === 'error').length;
  const warningCount = hints.filter((h) => h.type === 'warning').length;
  const suggestionCount = hints.filter((h) => h.type === 'suggestion').length;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[var(--color-bg-surface-2)] border-b border-[var(--color-border-light)]">
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">Quality:</span>
      {errorCount > 0 && (
        <span className="flex items-center gap-1 text-xs text-[#ef4444]">
          <AlertTriangle className="w-3 h-3" />
          {errorCount} {errorCount === 1 ? 'error' : 'errors'}
        </span>
      )}
      {warningCount > 0 && (
        <span className="flex items-center gap-1 text-xs text-[#f59e0b]">
          <AlertTriangle className="w-3 h-3" />
          {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
        </span>
      )}
      {suggestionCount > 0 && (
        <span className="flex items-center gap-1 text-xs text-[#3b82f6]">
          <Lightbulb className="w-3 h-3" />
          {suggestionCount} {suggestionCount === 1 ? 'suggestion' : 'suggestions'}
        </span>
      )}
    </div>
  );
}

export { parseDiffOutput };

export function DiffViewer({
  diff,
  viewMode = 'unified',
  onViewModeChange,
  qualityHints = [],
  onApplyFix,
}: DiffViewerProps) {
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

      {/* Quality summary */}
      <QualitySummary hints={qualityHints} />

      {/* Diff content */}
      <div className="flex-1 overflow-y-auto">
        {diff.hunks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[var(--color-text-tertiary)]">
            <p className="text-sm">No changes in this file</p>
          </div>
        ) : (
          diff.hunks.map((hunk, idx) => (
            <DiffHunkView key={idx} hunk={hunk} hints={qualityHints} onApplyFix={onApplyFix} />
          ))
        )}
      </div>
    </div>
  );
}
