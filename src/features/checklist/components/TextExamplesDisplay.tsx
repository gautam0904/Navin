import React from 'react';
import { Check, X } from 'lucide-react';

interface TextExamplesDisplayProps {
  examples: { good: string[]; bad: string[] };
}

export const TextExamplesDisplay: React.FC<TextExamplesDisplayProps> = ({ examples }) => {
  if (examples.good.length === 0 && examples.bad.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {examples.good.length > 0 && (
        <div className="bg-primary/10 dark:bg-primary/15 border border-primary/30 dark:border-primary/30 rounded-lg p-5 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-lg border border-primary/30 dark:border-primary/30">
              <Check size={20} className="text-primary dark:text-primary" />
            </div>
            <h4 className="font-bold text-primary dark:text-primary text-lg">Good Examples</h4>
          </div>
          <ul className="space-y-2">
            {examples.good.map((ex, i) => (
              <li
                key={i}
                className="font-mono text-sm text-text-secondary dark:text-text-secondary bg-bg-surface-2 dark:bg-bg-surface-2 px-3 py-2 rounded-md border border-border-medium dark:border-border-medium shadow-sm"
              >
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
      {examples.bad.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-800">
              <X size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <h4 className="font-bold text-red-600 dark:text-red-400 text-lg">Bad Examples</h4>
          </div>
          <ul className="space-y-2">
            {examples.bad.map((ex, i) => (
              <li
                key={i}
                className="font-mono text-sm text-red-600 dark:text-red-400 bg-bg-secondary/60 dark:bg-bg-secondary/60 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
              >
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
