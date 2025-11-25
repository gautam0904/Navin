import React from 'react';
import { Check, X, Code2 } from 'lucide-react';
import { CodeExamples } from '../../../types/checklist';
import { CodeEditor } from './CodeEditor';

interface CodeExamplesDisplayProps {
  codeExamples: CodeExamples;
}

export const CodeExamplesDisplay: React.FC<CodeExamplesDisplayProps> = ({ codeExamples }) => {
  const hasGoodExamples = codeExamples.good.length > 0;
  const hasBadExamples = codeExamples.bad.length > 0;

  if (!hasGoodExamples && !hasBadExamples) {
    return null;
  }

  return (
    <>
      {hasGoodExamples && (
        <div className="bg-primary/10 dark:bg-primary/15 border border-primary/30 dark:border-primary/30 rounded-lg p-5 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-xl border border-primary/30 dark:border-primary/40 relative">
              <Code2 size={20} className="text-primary dark:text-primary" />
              <Check
                size={14}
                className="text-primary dark:text-primary absolute -top-1 -right-1 bg-bg-secondary dark:bg-bg-secondary rounded-full p-0.5"
              />
            </div>
            <h4 className="font-bold text-primary dark:text-primary text-lg">Good Code Examples</h4>
          </div>
          <div className="space-y-3">
            {codeExamples.good.map((codeEx, i) => (
              <div
                key={i}
                className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-3 border border-primary/30 dark:border-primary/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded text-xs font-semibold">
                    {codeEx.language.toUpperCase()}
                  </span>
                </div>
                <CodeEditor
                  value={codeEx.code}
                  onChange={() => {}}
                  language={codeEx.language}
                  height="200px"
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {hasBadExamples && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-5 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl border border-red-200 dark:border-red-800 relative">
              <Code2 size={20} className="text-red-600 dark:text-red-400" />
              <X
                size={14}
                className="text-red-600 dark:text-red-400 absolute -top-1 -right-1 bg-bg-secondary dark:bg-bg-secondary rounded-full p-0.5"
              />
            </div>
            <h4 className="font-bold text-red-600 dark:text-red-400 text-lg">Bad Code Examples</h4>
          </div>
          <div className="space-y-3">
            {codeExamples.bad.map((codeEx, i) => (
              <div
                key={i}
                className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-3 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded text-xs font-semibold">
                    {codeEx.language.toUpperCase()}
                  </span>
                </div>
                <CodeEditor
                  value={codeEx.code}
                  onChange={() => {}}
                  language={codeEx.language}
                  height="200px"
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
