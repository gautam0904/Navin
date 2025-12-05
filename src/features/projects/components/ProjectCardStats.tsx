import React from 'react';
import { ChecklistSection } from '../../../types/checklist';

interface ProjectStats {
  projectId: string;
  sectionsCount: number;
  itemsCount: number;
  completedCount: number;
  sections: ChecklistSection[];
}

interface ChecklistStatsProps {
  stats: ProjectStats | undefined;
  isLoading: boolean;
}

export const ChecklistStats: React.FC<ChecklistStatsProps> = ({ stats, isLoading }) => {
  if (isLoading)
    return <div className="text-sm text-text-muted dark:text-text-muted">Loading...</div>;
  if (!stats)
    return (
      <div className="text-sm text-text-muted dark:text-text-muted">No checklist criteria yet</div>
    );

  const progressPercent =
    stats.itemsCount > 0 ? Math.round((stats.completedCount / stats.itemsCount) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary dark:text-text-secondary">Criteria Sections:</span>
        <span className="font-semibold text-text-primary dark:text-text-primary">
          {stats.sectionsCount}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary dark:text-text-secondary">Total Items:</span>
        <span className="font-semibold text-text-primary dark:text-text-primary">
          {stats.itemsCount}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary dark:text-text-secondary">Completed:</span>
        <span className="font-semibold text-primary dark:text-accent">
          {stats.completedCount} / {stats.itemsCount}
        </span>
      </div>
      {stats.itemsCount > 0 && (
        <div className="mt-2">
          <div className="w-full bg-bg-primary dark:bg-pickled-bluewood rounded-full h-2 border border-border-medium dark:border-border-light">
            <div
              className="bg-primary dark:bg-accent h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-text-muted dark:text-text-muted mt-1">
            {progressPercent}% Complete
          </div>
        </div>
      )}
      {stats.sections.length > 0 && (
        <div className="mt-3 pt-3 border-t border-primary/30 dark:border-primary/40">
          <div className="text-xs font-semibold text-text-secondary dark:text-text-secondary mb-2">
            Criteria Types:
          </div>
          <div className="flex flex-wrap gap-1">
            {stats.sections.slice(0, 5).map((section) => (
              <span
                key={section.id}
                className="px-2 py-1 bg-bg-secondary dark:bg-bg-secondary text-xs text-text-secondary dark:text-text-secondary rounded border border-primary/30 dark:border-primary/40"
              >
                {section.title.replace(/[^\w\s]/g, '').substring(0, 20)}
              </span>
            ))}
            {stats.sections.length > 5 && (
              <span className="px-2 py-1 bg-bg-secondary dark:bg-bg-secondary text-xs text-text-muted dark:text-text-muted rounded border border-primary/30 dark:border-primary/40">
                +{stats.sections.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
