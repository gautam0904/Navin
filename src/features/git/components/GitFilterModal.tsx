import React, { useState } from 'react';

interface GitFilterModalProps {
  isOpen: boolean;
  query: string;
  type: 'all' | 'modified' | 'added' | 'deleted';
  onApply: (query: string, type: 'all' | 'modified' | 'added' | 'deleted') => void;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export const GitFilterModal: React.FC<GitFilterModalProps> = ({
  isOpen,
  query,
  type,
  onApply,
  onClose,
  anchorRect,
  placement = 'bottom-end',
}) => {
  // Initialize state from props
  const [localQuery, setLocalQuery] = useState<string>(query);
  const [localType, setLocalType] = useState<typeof type>(type);

  // Update local state when props change (only sync when modal is closed)
  // When modal opens, we want fresh state from props
  React.useEffect(() => {
    if (!isOpen) {
      setLocalQuery(query);
      setLocalType(type);
    }
  }, [query, type, isOpen]);

  if (!isOpen) return null;

  // Compute anchored position
  const panelWidth = 320;
  const panelHeightEstimate = 260;
  const margin = 8;
  let top = 48;
  let left = Math.max(margin, window.innerWidth - panelWidth - margin);
  if (anchorRect) {
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const wantBottom = placement.startsWith('bottom');
    const placeAtBottom = wantBottom ? spaceBelow >= panelHeightEstimate + margin : false;
    if (placeAtBottom) {
      top = anchorRect.bottom + margin;
    } else {
      top = anchorRect.top - panelHeightEstimate - margin;
    }
    if (placement.endsWith('end')) {
      left = anchorRect.right - panelWidth;
    } else {
      left = anchorRect.left;
    }
    left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - panelHeightEstimate - margin));
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="fixed w-[320px] rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] shadow-xl"
        style={{ top, left }}
      >
        <div className="px-4 py-3 border-b border-[--git-panel-border] text-sm font-semibold text-[--color-text-primary]">
          Filter Files
        </div>
        <div className="p-4 space-y-3">
          <div>
            <input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by name or path..."
              className="w-full px-3 py-2 text-sm rounded border border-[--git-panel-border] bg-[--color-bg-surface-1] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'modified', 'added', 'deleted'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLocalType(t)}
                className={`px-3 py-1 text-xs rounded ${localType === t ? 'bg-[--color-primary] text-white' : 'bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:bg-[--color-bg-surface-3] hover:text-[--color-text-primary]'}`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[--git-panel-border] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded border border-[--git-panel-border] text-[--color-text-secondary] hover:bg-[--color-bg-surface-2]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApply(localQuery, localType);
              onClose();
            }}
            className="px-3 py-1.5 text-sm rounded bg-[--color-primary] text-white hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
