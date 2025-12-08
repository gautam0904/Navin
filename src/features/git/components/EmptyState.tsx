interface EmptyStateProps {
  isStaged: boolean;
  isClean?: boolean;
  hasOtherSectionFiles?: boolean;
}

export function EmptyState({ isStaged, isClean = false, hasOtherSectionFiles = false }: EmptyStateProps) {
  // Determine the message based on context
  let title: string;
  let description: string;

  if (isClean && !isStaged) {
    // Both panels empty - working tree clean
    title = 'Nothing to commit';
    description = 'Working tree clean';
  } else if (isStaged && !hasOtherSectionFiles) {
    // Staged empty, no unstaged files
    title = 'No staged changes';
    description = 'Stage files from the changes list to prepare for commit';
  } else if (!isStaged && !hasOtherSectionFiles) {
    // Unstaged empty, no staged files
    title = 'No changes';
    description = 'Your working directory is clean';
  } else if (isStaged) {
    // Staged empty but unstaged has files
    title = 'No staged changes';
    description = 'Stage files from the changes list above';
  } else {
    // Unstaged empty but staged has files
    title = 'No unstaged changes';
    description = 'All changes are staged and ready to commit';
  }

  if (isStaged && hasOtherSectionFiles) {
    return (
      <div className="px-3 py-1.5 border-t border-dashed border-[--git-panel-border]">
        <p className="text-[10px] text-[--color-text-tertiary] italic text-center">
          No files staged • Drag here or select above
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-[--color-text-tertiary]">{description}</p>
    </div>
  );
}
