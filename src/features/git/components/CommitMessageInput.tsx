import React, { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CommitMessageProps {
  message: string;
  onMessageChange: (message: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const COMMIT_TYPES = [
  { type: 'feat', description: 'add new feature' },
  { type: 'fix', description: 'resolve bug' },
  { type: 'docs', description: 'update documentation' },
  { type: 'style', description: 'formatting, missing semicolons, etc.' },
  { type: 'refactor', description: 'code restructuring' },
  { type: 'test', description: 'add or update tests' },
  { type: 'chore', description: 'maintenance tasks' },
];

const CONVENTIONAL_PATTERN =
  /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+/;

// Validation helper outside component to reduce complexity
function getValidationState(firstLine: string) {
  const length = firstLine.length;
  const isConventional = CONVENTIONAL_PATTERN.test(firstLine);
  return {
    isWarning: length > 50 && length <= 72,
    isError: length > 72,
    isEmpty: length === 0,
    isTooShort: length > 0 && length < 10,
    isConventional,
    isValid: length > 0 && length >= 10 && length <= 72 && isConventional,
  };
}

// Color helper outside component
function getLengthColor(validation: ReturnType<typeof getValidationState>): string {
  if (validation.isError) return 'text-[--color-error]';
  if (validation.isWarning) return 'text-[#f59e0b]';
  if (validation.isValid) return 'text-[--git-status-added]';
  return 'text-[--color-text-tertiary]';
}

export function CommitMessage({ message, onMessageChange, onKeyDown }: CommitMessageProps) {
  const [showExamples, setShowExamples] = useState(false);
  const firstLine = message.split('\n')[0];
  const validation = useMemo(() => getValidationState(firstLine), [firstLine]);
  const lengthColor = getLengthColor(validation);

  const suggestions = useMemo(() => {
    if (!firstLine || firstLine.length > 5) return [];
    const lower = firstLine.toLowerCase();
    return COMMIT_TYPES.filter(({ type }) => type.startsWith(lower)).slice(0, 3);
  }, [firstLine]);

  const handleSuggestionClick = (type: string) => {
    const description = COMMIT_TYPES.find((t) => t.type === type)?.description || '';
    onMessageChange(`${type}: ${description}`);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type="text"
          value={firstLine}
          onChange={(e) => {
            const newFirstLine = e.target.value;
            const rest = message.split('\n').slice(1).join('\n');
            onMessageChange(rest ? `${newFirstLine}\n${rest}` : newFirstLine);
          }}
          onKeyDown={onKeyDown}
          placeholder="feat: add new feature..."
          className="w-full px-3 py-1.5 pr-16 text-sm rounded border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {validation.isValid && <CheckCircle2 className="w-3 h-3 text-[--git-status-added]" />}
          {validation.isTooShort && <XCircle className="w-3 h-3 text-[--color-error]" />}
          {!validation.isConventional && !validation.isEmpty && !validation.isTooShort && (
            <AlertCircle className="w-3 h-3 text-[#f59e0b]" />
          )}
          <span className={`text-xs font-mono ${lengthColor}`}>{firstLine.length}/72</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestions.map(({ type }) => (
              <button
                key={type}
                onClick={() => handleSuggestionClick(type)}
                className="px-1.5 py-0.5 text-[10px] bg-[--color-bg-surface-2] hover:bg-[--color-bg-surface-3] rounded text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors"
          title="Show conventional commit examples"
        >
          <Sparkles className="w-3 h-3" />
          <span>Examples</span>
          {showExamples ? (
            <ChevronUp className="w-2.5 h-2.5" />
          ) : (
            <ChevronDown className="w-2.5 h-2.5" />
          )}
        </button>
      </div>

      {showExamples && (
        <div className="pt-1 pb-0.5 space-y-0.5 border-t border-[--git-panel-border]">
          {COMMIT_TYPES.slice(0, 4).map(({ type, description }) => (
            <div key={type} className="text-[10px] text-[--color-text-secondary] font-mono">
              <span className="text-[--color-primary]">{type}:</span> {description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
