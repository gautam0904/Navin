import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressSectionProps {
  completedItems: number;
  totalItems: number;
  progressPercent: number;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  completedItems,
  totalItems,
  progressPercent,
}) => {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 bg-bg-surface-2/50 dark:bg-bg-surface-2/30 border-b border-border-light dark:border-border-medium">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-sm sm:text-base font-semibold text-text-primary dark:text-text-primary" />
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-text-primary dark:text-text-primary mb-0.5">
              Overall Progress
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
              {completedItems} of {totalItems} items completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary leading-none">
              {progressPercent}%
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary mt-0.5">
              Complete
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border-light dark:border-border-medium"></div>
          <div
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-bg-secondary dark:bg-bg-surface-3 rounded-lg shadow-sm"
            style={{ minWidth: '60px' }}
          >
            <div className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary">
              {completedItems}
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">
              Completed
            </div>
          </div>
          <div
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-bg-secondary dark:bg-bg-surface-3 rounded-lg shadow-sm"
            style={{ minWidth: '60px' }}
          >
            <div className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary">
              {totalItems}
            </div>
            <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">
              Total
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="progress-container relative" style={{ height: '10px' }}>
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          {progressPercent > 10 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg z-10">
                {progressPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-3 text-xs sm:text-sm">
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
