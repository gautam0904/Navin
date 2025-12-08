import { LayoutGrid, FileText } from 'lucide-react';

interface ReviewModeToggleProps {
  isReviewMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ReviewModeToggle({ isReviewMode, onToggle }: ReviewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-[--git-panel-border] bg-[--color-bg-surface-2]">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
          !isReviewMode
            ? 'bg-[--color-primary] text-white'
            : 'text-[--color-text-secondary] hover:text-[--color-text-primary]'
        }`}
        title="Editing Mode"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
          isReviewMode
            ? 'bg-[--color-primary] text-white'
            : 'text-[--color-text-secondary] hover:text-[--color-text-primary]'
        }`}
        title="Review Mode"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Review</span>
      </button>
    </div>
  );
}
