import React from 'react';
import { format } from 'date-fns';
import { GraphNode } from '../utils/graphParser';

interface CommitTooltipProps {
  node: GraphNode;
  x: number;
  y: number;
}

export function CommitTooltip({ node, x, y }: CommitTooltipProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x + 10;
      let adjustedY = y + 10;

      // Adjust if tooltip goes off-screen
      if (adjustedX + rect.width > viewportWidth) {
        adjustedX = x - rect.width - 10;
      }
      if (adjustedY + rect.height > viewportHeight) {
        adjustedY = y - rect.height - 10;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  const timestamp = new Date(node.timestamp);
  const formattedDate = format(timestamp, 'MMM d, yyyy HH:mm');

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="bg-[--color-bg-surface-2] border border-[--git-panel-border] rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xs font-mono text-[--git-commit-sha] bg-[--color-bg-surface-3] px-2 py-1 rounded">
            {node.short_sha}
          </span>
        </div>

        <p className="text-sm text-[--color-text-primary] mb-2 line-clamp-3">{node.message}</p>

        <div className="flex flex-col gap-1 text-xs text-[--color-text-tertiary]">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Author:</span>
            <span>{node.author_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Date:</span>
            <span>{formattedDate}</span>
          </div>
          {node.parents.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Merge:</span>
              <span className="text-[--git-graph-lane-3]">{node.parents.length} parents</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
