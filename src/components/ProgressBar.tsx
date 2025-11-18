import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  completedItems: number;
  totalItems: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  completedItems,
  totalItems
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-700">Overall Progress</span>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {progressPercent}%
          </span>
          <span className="text-sm text-gray-700 font-semibold">
            {completedItems}/{totalItems}
          </span>
        </div>
      </div>
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-300">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-700 ease-out rounded-full shadow-lg"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

