import React from 'react';
import { ChecklistItem as ChecklistItemType } from '../../../types/checklist';

interface ItemExamplesDisplayProps {
  item: ChecklistItemType;
}

const hasAnyExamples = (item: ChecklistItemType): boolean => {
  const hasText = item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0);
  const hasCode =
    item.codeExamples && (item.codeExamples.good.length > 0 || item.codeExamples.bad.length > 0);
  const hasLegacy = !!item.codeExample;
  return hasText || hasCode || hasLegacy;
};

const ItemTextExamples: React.FC<{ examples: { good: string[]; bad: string[] } }> = ({
  examples,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {examples.good.length > 0 && (
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-3">
          <h5 className="font-semibold text-primary dark:text-primary mb-2 text-sm">Good:</h5>
          <ul className="space-y-1">
            {examples.good.map((ex, i) => (
              <li
                key={i}
                className="text-sm text-text-secondary dark:text-text-secondary font-mono"
              >
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
      {examples.bad.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2 text-sm">Bad:</h5>
          <ul className="space-y-1">
            {examples.bad.map((ex, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-400 font-mono">
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ItemCodeExampleBlock: React.FC<{ codeEx: { language: string; code: string } }> = ({
  codeEx,
}) => {
  return (
    <div className="bg-black-russian dark:bg-blue-charcoal rounded-lg p-3 overflow-x-auto border border-border-dark">
      <div className="text-xs text-loblolly dark:text-regent-gray mb-1">
        {codeEx.language.toUpperCase()}
      </div>
      <pre className="text-xs font-mono text-wild-sand dark:text-loblolly whitespace-pre-wrap">
        {codeEx.code}
      </pre>
    </div>
  );
};

const ItemGoodCodeExamples: React.FC<{
  examples: Array<{ language: string; code: string }>;
}> = ({ examples }) => {
  if (examples.length === 0) return null;

  return (
    <div className="space-y-2">
      <h5 className="font-semibold text-primary dark:text-accent mb-2 text-sm">Good Code:</h5>
      {examples.map((codeEx, i) => (
        <ItemCodeExampleBlock key={i} codeEx={codeEx} />
      ))}
    </div>
  );
};

const ItemBadCodeExamples: React.FC<{
  examples: Array<{ language: string; code: string }>;
}> = ({ examples }) => {
  if (examples.length === 0) return null;

  return (
    <div className="space-y-2">
      <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2 text-sm">Bad Code:</h5>
      {examples.map((codeEx, i) => (
        <ItemCodeExampleBlock key={i} codeEx={codeEx} />
      ))}
    </div>
  );
};

const ItemCodeExamples: React.FC<{
  codeExamples: {
    good: Array<{ language: string; code: string }>;
    bad: Array<{ language: string; code: string }>;
  };
}> = ({ codeExamples }) => {
  return (
    <>
      <ItemGoodCodeExamples examples={codeExamples.good} />
      <ItemBadCodeExamples examples={codeExamples.bad} />
    </>
  );
};

const ItemLegacyCode: React.FC<{ codeExample: string }> = ({ codeExample }) => {
  return (
    <div className="bg-black-russian dark:bg-blue-charcoal rounded-lg p-3 overflow-x-auto border border-border-dark">
      <pre className="text-xs font-mono text-wild-sand dark:text-loblolly whitespace-pre-wrap">
        {codeExample}
      </pre>
    </div>
  );
};

export const ItemExamplesDisplay: React.FC<ItemExamplesDisplayProps> = ({ item }) => {
  if (!hasAnyExamples(item)) {
    return (
      <p className="text-xs text-text-muted dark:text-text-muted italic">
        No examples for this item.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {item.examples && (item.examples.good.length > 0 || item.examples.bad.length > 0) && (
        <ItemTextExamples examples={item.examples} />
      )}
      {item.codeExamples &&
        (item.codeExamples.good.length > 0 || item.codeExamples.bad.length > 0) && (
          <ItemCodeExamples codeExamples={item.codeExamples} />
        )}
      {item.codeExample && <ItemLegacyCode codeExample={item.codeExample} />}
    </div>
  );
};
