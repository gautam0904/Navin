import React from 'react';
import { Sparkles } from 'lucide-react';

interface CommitMessageProps {
  message: string;
  onMessageChange: (message: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CommitMessage({ message, onMessageChange, onKeyDown }: CommitMessageProps) {
  const firstLineLength = message.split('\n')[0].length;
  const charPercentage = Math.min((firstLineLength / 72) * 100, 100);
  const isWarning = firstLineLength > 50 && firstLineLength <= 72;
  const isError = firstLineLength > 72;

  return (
    <div className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Write a meaningful commit message..."
        rows={3}
        className="commit-textarea"
      />
      <div className="commit-char-counter">
        <div className="commit-char-counter-bar">
          <div
            className={`commit-char-counter-fill ${isWarning ? 'warning' : ''} ${isError ? 'error' : ''}`}
            style={{ width: `${charPercentage}%` }}
          />
        </div>
        <span
          className={`font-mono ${isError ? 'text-[--color-error]' : isWarning ? 'text-[--color-warning]' : ''}`}
        >
          {firstLineLength}/72
        </span>
      </div>
      <p className="text-[10px] text-[--color-text-tertiary] flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        Tip: Use conventional commits (feat:, fix:, docs:, etc.)
      </p>
    </div>
  );
}
