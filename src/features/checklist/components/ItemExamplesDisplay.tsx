import React from 'react';
import { ChecklistItem as ChecklistItemType } from '../../../types/checklist';

interface ItemExamplesDisplayProps {
  item: ChecklistItemType;
}

// eslint-disable-next-line complexity
export const ItemExamplesDisplay: React.FC<ItemExamplesDisplayProps> = ({ item }) => {
  const hasTextExamples =
    item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0);
  const hasCodeExamples =
    item.codeExamples && (item.codeExamples.good.length > 0 || item.codeExamples.bad.length > 0);
  const hasLegacyCode = item.codeExample;

  if (!hasTextExamples && !hasCodeExamples && !hasLegacyCode) {
    return (
      <p className="text-xs text-text-muted dark:text-text-muted italic">
        No examples for this item.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {hasTextExamples && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {item.examples?.good.length ? (
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-3">
              <h5 className="font-semibold text-primary dark:text-primary mb-2 text-sm">Good:</h5>
              <ul className="space-y-1">
                {item.examples.good.map((ex, i) => (
                  <li
                    key={i}
                    className="text-sm text-text-secondary dark:text-text-secondary font-mono"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {item.examples?.bad.length ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2 text-sm">Bad:</h5>
              <ul className="space-y-1">
                {item.examples.bad.map((ex, i) => (
                  <li key={i} className="text-sm text-red-700 dark:text-red-400 font-mono">
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
      {hasCodeExamples && (
        <>
          {item.codeExamples?.good.length ? (
            <div className="space-y-2">
              <h5 className="font-semibold text-primary dark:text-accent mb-2 text-sm">
                Good Code:
              </h5>
              {item.codeExamples.good.map((codeEx, i) => (
                <div
                  key={i}
                  className="bg-black-russian dark:bg-blue-charcoal rounded-lg p-3 overflow-x-auto border border-border-dark"
                >
                  <div className="text-xs text-loblolly dark:text-regent-gray mb-1">
                    {codeEx.language.toUpperCase()}
                  </div>
                  <pre className="text-xs font-mono text-wild-sand dark:text-loblolly whitespace-pre-wrap">
                    {codeEx.code}
                  </pre>
                </div>
              ))}
            </div>
          ) : null}
          {item.codeExamples?.bad.length ? (
            <div className="space-y-2">
              <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2 text-sm">
                Bad Code:
              </h5>
              {item.codeExamples.bad.map((codeEx, i) => (
                <div
                  key={i}
                  className="bg-black-russian dark:bg-blue-charcoal rounded-lg p-3 overflow-x-auto border border-border-dark"
                >
                  <div className="text-xs text-loblolly dark:text-regent-gray mb-1">
                    {codeEx.language.toUpperCase()}
                  </div>
                  <pre className="text-xs font-mono text-wild-sand dark:text-loblolly whitespace-pre-wrap">
                    {codeEx.code}
                  </pre>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
      {hasLegacyCode && (
        <div className="bg-black-russian dark:bg-blue-charcoal rounded-lg p-3 overflow-x-auto border border-border-dark">
          <pre className="text-xs font-mono text-wild-sand dark:text-loblolly whitespace-pre-wrap">
            {item.codeExample}
          </pre>
        </div>
      )}
    </div>
  );
};
