import { DiffLine as DiffLineType, QualityHint } from '../types/diff';
import { InlineQualityHint } from './InlineQualityHint';

interface UnifiedDiffLineProps {
  line: DiffLineType;
  hints?: QualityHint[];
  onApplyFix?: (hint: QualityHint) => void;
}

function getLineStyles(type: DiffLineType['type']) {
  switch (type) {
    case 'add':
      return {
        bgClass: 'bg-[var(--git-diff-add-line)]',
        textClass: 'text-[var(--git-status-added)]',
        prefix: '+',
      };
    case 'del':
      return {
        bgClass: 'bg-[var(--git-diff-del-line)]',
        textClass: 'text-[var(--git-status-deleted)]',
        prefix: '-',
      };
    case 'hunk':
      return {
        bgClass: 'bg-[var(--git-diff-hunk)]',
        textClass: 'text-[var(--color-primary)] italic',
        prefix: '@@',
      };
    default:
      return {
        bgClass: '',
        textClass: 'text-[var(--color-text-primary)]',
        prefix: ' ',
      };
  }
}

export function UnifiedDiffLine({ line, hints, onApplyFix }: UnifiedDiffLineProps) {
  const { bgClass, textClass, prefix } = getLineStyles(line.type);

  const lineHints =
    hints?.filter(
      (h) => h.lineNumber === line.newLineNumber || h.lineNumber === line.oldLineNumber
    ) || [];
  const hasWarning = lineHints.some((h) => h.type === 'warning' || h.type === 'error');

  return (
    <>
      <div
        className={`git-diff-line flex ${bgClass} hover:brightness-95 ${hasWarning ? 'relative' : ''}`}
      >
        {/* Warning indicator */}
        {hasWarning && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]" />}

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

      {/* Quality hints for this line */}
      {lineHints.map((hint, idx) => (
        <InlineQualityHint key={idx} hint={hint} onApplyFix={onApplyFix} />
      ))}
    </>
  );
}
