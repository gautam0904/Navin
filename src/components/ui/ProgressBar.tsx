import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  completedItems: number;
  totalItems: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  completedItems,
  totalItems,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Row - Aligned with sections */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary dark:text-text-primary">
              Overall Progress
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary">
              {completedItems} of {totalItems} items completed
            </p>
          </div>
        </div>
        {/* Fixed-width right-side counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary dark:text-primary leading-none">
              {progressPercent}%
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary mt-0.5">
              Complete
            </div>
          </div>
          <div className="w-px h-10 bg-border-light dark:border-border-medium"></div>
          <div
            className="px-4 py-2 bg-bg-surface-2 dark:bg-bg-surface-3 rounded-lg shadow-sm"
            style={{ minWidth: '80px' }}
          >
            <div className="text-xl font-bold text-text-primary dark:text-text-primary">
              {completedItems}
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">
              Completed
            </div>
          </div>
          <div
            className="px-4 py-2 bg-bg-surface-2 dark:bg-bg-surface-3 rounded-lg shadow-sm"
            style={{ minWidth: '80px' }}
          >
            <div className="text-xl font-bold text-text-primary dark:text-text-primary">
              {totalItems}
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container relative" style={{ height: '10px' }}>
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        {/* Percentage overlay for visibility */}
        {progressPercent > 10 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg z-10">
              {progressPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-secondary dark:text-text-secondary">
          {totalItems - completedItems} items remaining
        </span>
        <span className="font-semibold text-primary dark:text-primary">
          {completedItems}/{totalItems} tasks
        </span>
      </div>
    </div>
  );
};
