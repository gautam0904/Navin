import { Keyboard } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Space'], description: 'Stage/unstage selected file', category: 'File Actions' },
  { keys: ['Enter'], description: 'View diff of selected file', category: 'File Actions' },
  { keys: ['Ctrl', 'Enter'], description: 'Commit staged changes', category: 'Commit Actions' },
  { keys: ['Ctrl', 'K'], description: 'Focus search', category: 'Navigation' },
  { keys: ['Esc'], description: 'Clear selection', category: 'Navigation' },
];

export function KeyboardShortcuts() {
  const grouped = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  return (
    <div className="p-3 border-t border-[--git-panel-border] bg-[--git-panel-header]">
      <div className="flex items-center gap-2 mb-3">
        <Keyboard className="w-3.5 h-3.5 text-[--color-text-tertiary]" />
        <span className="text-xs font-semibold text-[--color-text-secondary]">
          Keyboard Shortcuts
        </span>
      </div>
      <div className="space-y-3">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="text-[10px] font-semibold text-[--color-text-primary] mb-1.5 uppercase tracking-wider">
              {category}
            </div>
            <div className="space-y-1.5">
              {items.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px]">
                  <span className="text-[--color-text-secondary]">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIdx) => (
                      <span key={keyIdx}>
                        <kbd className="px-1.5 py-0.5 bg-[--color-bg-surface-2] border border-[--git-panel-border] rounded text-[10px] font-mono text-[--color-text-primary] shadow-sm">
                          {key}
                        </kbd>
                        {keyIdx < shortcut.keys.length - 1 && (
                          <span className="mx-0.5 text-[--color-text-tertiary] text-[9px]">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
