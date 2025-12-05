import { BranchGraph } from './BranchGraph';
import { Search, Filter, ZoomIn, ZoomOut } from 'lucide-react';

export function CenterPanel() {
  return (
    <div className="flex flex-col h-full bg-(--color-bg-primary)">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-(--git-panel-border) bg-(--git-panel-header)">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--color-text-tertiary)" />
            <input
              type="text"
              placeholder="Search commits..."
              className="pl-8 pr-3 py-1.5 text-xs rounded border border-(--git-panel-border) bg-(--color-bg-primary) text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) w-64"
            />
          </div>
          <button
            className="p-1.5 rounded hover:bg-(--git-panel-item-hover) text-(--color-text-secondary)"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded hover:bg-(--git-panel-item-hover) text-(--color-text-secondary)"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-(--git-panel-item-hover) text-(--color-text-secondary)"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 overflow-hidden relative">
        <BranchGraph />
      </div>
    </div>
  );
}
