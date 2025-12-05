import { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Play, Upload, GitBranch, Clock, Package } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { formatDistanceToNow } from 'date-fns';

interface StashEntry {
  message: string;
  branch: string | null;
  index?: number;
  timestamp?: string;
}

function EmptyStashState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Package className="w-10 h-10" />
      </div>
      <h3 className="empty-state-title">No stashes yet</h3>
      <p className="empty-state-description">
        Stash your changes to save work in progress without committing
      </p>
    </div>
  );
}

interface StashCardProps {
  stash: StashEntry;
  index: number;
  onApply: () => void;
  onPop: () => void;
  onDrop: () => void;
}

function StashCard({ stash, index, onApply, onPop, onDrop }: StashCardProps) {
  const displayMessage = stash.message || `WIP on ${stash.branch}`;
  const truncatedMessage =
    displayMessage.length > 60 ? displayMessage.slice(0, 60) + '...' : displayMessage;

  return (
    <div className="stash-card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="stash-card-header">
        <div className="stash-card-icon">
          <Archive className="w-4 h-4" />
        </div>
        <div className="stash-card-content">
          <div className="stash-card-title" title={displayMessage}>
            {truncatedMessage}
          </div>
          <div className="stash-card-meta">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {stash.branch}
            </span>
            {stash.timestamp && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(stash.timestamp), { addSuffix: true })}
              </span>
            )}
            <span className="badge badge-neutral">stash@{`{${index}}`}</span>
          </div>
        </div>
      </div>

      <div className="stash-card-actions">
        <button
          onClick={onApply}
          className="stash-card-action"
          title="Apply this stash (keep stash)"
        >
          <Play className="w-3.5 h-3.5" />
          Apply
        </button>
        <button onClick={onPop} className="stash-card-action" title="Apply and remove stash">
          <Upload className="w-3.5 h-3.5" />
          Pop
        </button>
        <button
          onClick={onDrop}
          className="stash-card-action stash-card-action-danger"
          title="Delete this stash"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Drop
        </button>
      </div>
    </div>
  );
}

interface CreateStashFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message?: string) => Promise<void>;
}

function CreateStashForm({ isOpen, onClose, onSubmit }: CreateStashFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(message || undefined);
    setMessage('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="p-4 bg-[var(--color-bg-surface-2)] border-b border-[var(--color-border-light)] animate-slide-in">
      <div className="space-y-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Stash message (optional)"
          className="input-premium"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-premium btn-premium-ghost btn-premium-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-premium btn-premium-primary btn-premium-sm"
          >
            {isSubmitting ? 'Saving...' : 'Stash Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StashPanel() {
  const { stashes, refreshStashes, createStash, applyStash, popStash, dropStash } = useGit();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    refreshStashes();
  }, [refreshStashes]);

  const handleCreateStash = async (message?: string) => {
    await createStash(message);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="section-header">
        <div className="section-header-title">
          <Archive className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Stashes</span>
          {stashes && stashes.length > 0 && (
            <span className="section-header-count">{stashes.length}</span>
          )}
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-premium btn-premium-ghost btn-premium-icon"
          title="Stash current changes"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Create Form */}
      <CreateStashForm
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSubmit={handleCreateStash}
      />

      {/* Stash List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {!stashes || stashes.length === 0 ? (
          <EmptyStashState />
        ) : (
          stashes.map((stash, index) => (
            <StashCard
              key={index}
              stash={stash}
              index={index}
              onApply={() => applyStash(index)}
              onPop={() => popStash(index)}
              onDrop={() => dropStash(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}
