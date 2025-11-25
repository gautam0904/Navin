import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ExamplesToggleButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ExamplesToggleButton: React.FC<ExamplesToggleButtonProps> = ({
  isExpanded,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/15 hover:bg-primary/20 dark:hover:bg-primary/25 text-primary dark:text-primary rounded-lg transition-all font-medium border border-primary/30 dark:border-primary/30 shadow-sm hover:shadow-md"
      style={{ height: 'var(--button-height)' }}
    >
      {isExpanded ? 'Hide' : 'Show'} Examples
      <ChevronDown
        size={18}
        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
  );
};
