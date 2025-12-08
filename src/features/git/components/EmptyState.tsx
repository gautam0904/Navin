interface EmptyStateProps {
  isStaged: boolean;
  isClean?: boolean;
  hasOtherSectionFiles?: boolean;
}

// Message lookup to reduce complexity
const EMPTY_STATE_MESSAGES: Record<string, string> = {
  'clean-unstaged': 'Working tree clean',
  'staged-no-other': 'Stage files from the changes list to prepare for commit',
  'unstaged-no-other': 'Your working directory is clean',
  'staged-has-other': 'Stage files from the changes list above',
  'unstaged-has-other': 'All changes are staged and ready to commit',
};

function getMessageKey(isStaged: boolean, isClean: boolean, hasOtherSectionFiles: boolean): string {
  if (isClean && !isStaged) return 'clean-unstaged';
  if (isStaged && !hasOtherSectionFiles) return 'staged-no-other';
  if (!isStaged && !hasOtherSectionFiles) return 'unstaged-no-other';
  if (isStaged) return 'staged-has-other';
  return 'unstaged-has-other';
}

export function EmptyState({
  isStaged,
  isClean = false,
  hasOtherSectionFiles = false,
}: EmptyStateProps) {
  if (isStaged && hasOtherSectionFiles) {
    return (
      <div className="px-3 py-1.5 border-t border-dashed border-[--git-panel-border]">
        <p className="text-[10px] text-[--color-text-tertiary] italic text-center">
          No files staged • Drag here or select above
        </p>
      </div>
    );
  }

  const description = EMPTY_STATE_MESSAGES[getMessageKey(isStaged, isClean, hasOtherSectionFiles)];

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-[--color-text-tertiary]">{description}</p>
    </div>
  );
}
