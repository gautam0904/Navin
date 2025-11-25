import React from 'react';

interface FooterProps {
  completedItems: number;
  totalItems: number;
  isAdminMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ completedItems, totalItems, isAdminMode }) => {
  const isComplete = completedItems === totalItems && totalItems > 0;

  return (
    <div
      className="mt-8 bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md p-8 text-center border border-primary/20 dark:border-primary/20 transition-colors card"
      style={{ padding: 'var(--space-xl)' }}
    >
      {isComplete ? (
        <div className="space-y-5">
          <div className="inline-flex p-6 bg-primary dark:bg-primary text-text-inverse dark:text-text-inverse rounded-2xl border-2 border-primary/30 dark:border-primary/40 shadow-xl">
            <span className="text-6xl">🎉</span>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-primary dark:text-accent mb-3 tracking-tight">
              Congratulations!
            </h3>
            <p className="text-xl text-text-secondary dark:text-text-secondary font-bold">
              All items completed. Ready for PR!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-primary dark:bg-primary text-text-inverse dark:text-text-inverse rounded-2xl border-2 border-primary/30 dark:border-primary/40 shadow-xl">
            <span className="text-3xl">💪</span>
            <span className="text-xl font-extrabold text-text-inverse dark:text-text-inverse tracking-tight">
              {totalItems - completedItems} items remaining
            </span>
          </div>
          <p className="text-lg text-text-secondary dark:text-text-secondary font-semibold">
            Keep going! You&apos;re doing great.
          </p>
        </div>
      )}

      {isAdminMode && (
        <div className="mt-6 pt-6 border-t-2 border-border-medium dark:border-border-light space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/30 dark:border-primary/40">
            <span className="text-primary dark:text-accent font-bold">🔧 Admin Mode Active</span>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-sm text-text-secondary dark:text-text-secondary font-medium">
              <strong>How to save your changes permanently:</strong>
            </p>
            <ol className="text-sm text-text-secondary dark:text-text-secondary space-y-2 text-left">
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">1.</span>
                <span>Make your changes (add/edit/delete sections or items)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">2.</span>
                <span>
                  Click the <strong>&quot;Copy Code&quot;</strong> button above
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">3.</span>
                <span>
                  Open{' '}
                  <code className="bg-bg-surface-2 dark:bg-bg-surface-2 px-2 py-0.5 rounded border border-border-medium dark:border-border-medium shadow-sm">
                    src/data/defaultChecklist.ts
                  </code>{' '}
                  in your editor
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">4.</span>
                <span>
                  Find the{' '}
                  <code className="bg-bg-surface-2 dark:bg-bg-surface-2 px-2 py-0.5 rounded border border-border-medium dark:border-border-medium shadow-sm">
                    defaultChecklistData
                  </code>{' '}
                  array
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">5.</span>
                <span>Replace it with the copied code and save the file</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary dark:text-accent">6.</span>
                <span>Refresh the app to see your changes!</span>
              </li>
            </ol>
            <p className="text-xs text-text-muted dark:text-text-muted bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-3 mt-3">
              💡 <strong>Note:</strong> This saves changes to your actual source code, making them
              permanent across all users and deploys!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
