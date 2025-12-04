import { GraphNode, GraphEdge } from './graphParser';

export interface EdgePath {
  edge: GraphEdge;
  path: string; // SVG path d attribute
  isMerge: boolean;
}

/**
 * Calculate paths for edges, using bezier curves for merges
 */
export function calculateEdgePaths(
  nodes: GraphNode[],
  edges: GraphEdge[],
  rowHeight: number = 30,
  laneWidth: number = 40
): EdgePath[] {
  const nodeMap = new Map(nodes.map((n) => [n.sha, n]));

  return edges.map((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);

    if (!source || !target) {
      return {
        edge,
        path: '',
        isMerge: false,
      };
    }

    const x1 = source.x + laneWidth / 2;
    const y1 = source.y * rowHeight + rowHeight / 2;
    const x2 = target.x + laneWidth / 2;
    const y2 = target.y * rowHeight + rowHeight / 2;

    // Check if this is a merge (different lanes)
    const isMerge = source.lane !== target.lane;
    const isFork = target.parents.length > 1;

    let path: string;

    if (isMerge || isFork) {
      // Use cubic bezier curve for merges and forks
      const controlPointOffset = Math.abs(y2 - y1) * 0.5;
      const cx1 = x1;
      const cy1 = y1 + controlPointOffset;
      const cx2 = x2;
      const cy2 = y2 - controlPointOffset;

      path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    } else {
      // Straight line for same-lane commits
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    return {
      edge,
      path,
      isMerge: isMerge || isFork,
    };
  });
}
