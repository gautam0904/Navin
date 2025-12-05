import { useState } from 'react';
import { Lightbulb, AlertTriangle, ChevronDown, ChevronRight, Wand2 } from 'lucide-react';
import { QualityHint } from '../types/diff';

interface InlineQualityHintProps {
  hint: QualityHint;
  onApplyFix?: (hint: QualityHint) => void;
}

export function InlineQualityHint({ hint, onApplyFix }: InlineQualityHintProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hintStyles = {
    warning: {
      bg: 'bg-[rgba(245,158,11,0.1)]',
      border: 'border-[rgba(245,158,11,0.3)]',
      icon: 'text-[#f59e0b]',
    },
    error: {
      bg: 'bg-[rgba(239,68,68,0.1)]',
      border: 'border-[rgba(239,68,68,0.3)]',
      icon: 'text-[#ef4444]',
    },
    suggestion: {
      bg: 'bg-[rgba(59,130,246,0.1)]',
      border: 'border-[rgba(59,130,246,0.3)]',
      icon: 'text-[#3b82f6]',
    },
    info: {
      bg: 'bg-[rgba(107,114,128,0.1)]',
      border: 'border-[rgba(107,114,128,0.3)]',
      icon: 'text-[#6b7280]',
    },
  };

  const style = hintStyles[hint.type];

  return (
    <div className={`mx-4 my-1 rounded-lg border ${style.bg} ${style.border} animate-fade-in`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        {hint.type === 'suggestion' ? (
          <Lightbulb className={`w-4 h-4 shrink-0 ${style.icon}`} />
        ) : (
          <AlertTriangle className={`w-4 h-4 shrink-0 ${style.icon}`} />
        )}
        <span className="text-xs font-medium text-[var(--color-text-secondary)] truncate flex-1">
          {hint.rule}
        </span>
        <span className={`text-xs ${style.icon}`}>Line {hint.lineNumber}</span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-[var(--color-text-tertiary)]" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[var(--color-text-tertiary)]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[var(--color-border-light)]">
          <p className="text-xs text-[var(--color-text-primary)] mb-2 mt-2">{hint.message}</p>
          {hint.suggestedFix && (
            <div className="p-2 bg-[var(--color-bg-primary)] rounded-md font-mono text-xs text-[var(--color-text-secondary)] mb-2">
              {hint.suggestedFix}
            </div>
          )}
          {hint.autoFixable && onApplyFix && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApplyFix(hint);
              }}
              className="btn-premium btn-premium-sm btn-premium-primary"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Apply Fix
            </button>
          )}
        </div>
      )}
    </div>
  );
}
