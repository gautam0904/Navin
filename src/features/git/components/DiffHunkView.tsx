import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DiffHunk, QualityHint } from '../types/diff';
import { UnifiedDiffLine } from './UnifiedDiffLine';

interface DiffHunkViewProps {
  hunk: DiffHunk;
  hints?: QualityHint[];
  onApplyFix?: (hint: QualityHint) => void;
}

export function DiffHunkView({ hunk, hints, onApplyFix }: DiffHunkViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-[--git-panel-border] last:border-b-0">
      {/* Hunk header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 bg-[--git-diff-hunk] hover:brightness-95 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-[--color-primary]" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[--color-primary]" />
        )}
        <code className="text-xs font-mono text-[--color-primary]">{hunk.header}</code>
      </button>

      {/* Hunk lines */}
      {isExpanded && (
        <div className="overflow-x-auto">
          {hunk.lines.map((line, idx) => (
            <UnifiedDiffLine key={idx} line={line} hints={hints} onApplyFix={onApplyFix} />
          ))}
        </div>
      )}
    </div>
  );
}
