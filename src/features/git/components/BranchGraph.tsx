import { useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { parseCommitGraph } from '../utils/graphParser';
import { buildGraphLayout } from '../utils/graphBuilder';
import { calculateEdgePaths } from '../utils/edgeRouter';
import { useGraphInteractivity } from '../hooks/useGraphInteractivity';
import { CommitTooltip } from './CommitTooltip';

const ROW_HEIGHT = 50;
const LANE_WIDTH = 40;

export function BranchGraph() {
  const { history } = useGit();
  const [zoomLevel] = useState(1);

  const { graphData, edgePaths } = useMemo(() => {
    if (!history) return { graphData: null, edgePaths: [] };
    const parsed = parseCommitGraph(history);
    const layoutData = buildGraphLayout(parsed);
    const paths = calculateEdgePaths(layoutData.nodes, layoutData.edges, ROW_HEIGHT, LANE_WIDTH);
    return { graphData: layoutData, edgePaths: paths };
  }, [history]);

  const { hoveredNode, selectedNode, tooltip, handleNodeHover, handleNodeClick } =
    useGraphInteractivity();

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <GitBranch className="w-12 h-12 mb-3 text-(--color-text-tertiary) opacity-30" />
        <p className="text-sm text-(--color-text-secondary)">No commits found</p>
      </div>
    );
  }

  // Calculate canvas dimensions with zoom
  const canvasHeight = (graphData?.nodes.length || 0) * ROW_HEIGHT * zoomLevel + 100;
  const canvasWidth = ((graphData?.lanes || 1) * LANE_WIDTH + 600) * zoomLevel;

  return (
    <div className="flex flex-col h-full bg-(--git-graph-bg)">
      {/* <GraphHeader
                laneCount={graphData?.lanes || 0}
                commitCount={history.length}
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
            /> */}

      {/* Graph visualization */}
      <div className="flex-1 overflow-auto p-4">
        <svg
          width={canvasWidth}
          height={canvasHeight}
          className="block"
          style={{ minWidth: '100%', minHeight: '100%' }}
        >
          {/* Render Edges with Bezier curves */}
          {edgePaths.map(({ edge, path, isMerge }) => {
            const isHighlighted =
              hoveredNode === edge.source ||
              hoveredNode === edge.target ||
              selectedNode === edge.source ||
              selectedNode === edge.target;

            return (
              <path
                key={`${edge.source}-${edge.target}`}
                d={path}
                stroke={isMerge ? 'var(--git-graph-lane-3)' : 'var(--git-graph-edge)'}
                strokeWidth={(isMerge ? 2.5 : 2) * zoomLevel}
                fill="none"
                className="transition-all"
                opacity={isHighlighted ? 1 : isMerge ? 0.9 : 0.6}
              />
            );
          })}

          {/* Render Nodes */}
          {graphData?.nodes.map((node) => {
            const cx = (node.x + LANE_WIDTH / 2) * zoomLevel;
            const cy = (node.y * ROW_HEIGHT + ROW_HEIGHT / 2) * zoomLevel;
            const laneColor = `var(--git-graph-lane-${(node.lane % 8) + 1})`;
            const isHovered = hoveredNode === node.sha;
            const isSelected = selectedNode === node.sha;

            return (
              <g
                key={node.sha}
                className="cursor-pointer group"
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={() => handleNodeHover(null)}
                onClick={() => handleNodeClick(node)}
              >
                {/* Selection highlight */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={12 * zoomLevel}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    opacity={0.3}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={(isHovered || isSelected ? 8 : 6) * zoomLevel}
                  fill="var(--git-graph-node-bg)"
                  stroke={laneColor}
                  strokeWidth={2.5 * zoomLevel}
                  className="transition-all"
                />

                {/* Commit info */}
                <text
                  x={cx + 16 * zoomLevel}
                  y={cy - 8 * zoomLevel}
                  className="text-xs font-mono fill-(--git-commit-sha) select-none pointer-events-none"
                  style={{ fontSize: `${11 * zoomLevel}px` }}
                >
                  {node.short_sha}
                </text>
                <text
                  x={cx + 16 * zoomLevel}
                  y={cy + 8 * zoomLevel}
                  className="text-sm fill-(--color-text-primary) select-none pointer-events-none"
                  style={{ fontSize: `${13 * zoomLevel}px` }}
                >
                  {node.message.length > 60 ? node.message.substring(0, 60) + '...' : node.message}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip overlay */}
      {tooltip && <CommitTooltip node={tooltip.node} x={tooltip.x} y={tooltip.y} />}
    </div>
  );
}
