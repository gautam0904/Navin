import { useState } from 'react';

interface CreateBranchFormProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function CreateBranchForm({ isOpen, isLoading, onClose, onSubmit }: CreateBranchFormProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="p-4 bg-[(--color-bg-surface-2)] border-b border-[(--color-border-light)] animate-slide-in">
      <div className="text-xs font-semibold text-[(--color-text-secondary)] uppercase tracking-wider mb-3">
        Create New Branch
      </div>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="feature/my-new-branch"
          className="input-premium"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-premium btn-premium-ghost btn-premium-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            className="btn-premium btn-premium-primary btn-premium-sm"
          >
            {isLoading ? 'Creating...' : 'Create Branch'}
          </button>
        </div>
      </div>
    </div>
  );
}
