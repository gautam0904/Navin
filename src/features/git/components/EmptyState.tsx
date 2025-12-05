import { Inbox, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  isStaged: boolean;
}

export function EmptyState({ isStaged }: EmptyStateProps) {
  return (
    <div className="empty-state py-8">
      <div className="empty-state-icon">
        {isStaged ? <Inbox className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
      </div>
      <h3 className="empty-state-title">{isStaged ? 'No staged changes' : 'No changes'}</h3>
      <p className="empty-state-description">
        {isStaged
          ? 'Stage files from the changes list to prepare for commit'
          : 'Your working directory is clean'}
      </p>
    </div>
  );
}
