import { Trash2 } from 'lucide-react';

interface DeleteConfirmProps {
  branchName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({ branchName, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div className="p-4 bg-[rgba(239,68,68,0.1)] border-b border-[--color-error] animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[--color-error] flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[--color-text-primary] mb-1">
            Delete branch <span className="font-mono font-semibold">{branchName}</span>?
          </p>
          <p className="text-xs text-[--color-text-tertiary] mb-3">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={onCancel} className="btn-premium btn-premium-ghost btn-premium-sm">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-premium btn-premium-danger btn-premium-sm">
              Delete Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
