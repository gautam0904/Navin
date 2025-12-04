/* eslint-disable complexity */
import { GraphData, GraphNode } from './graphParser';

interface NodeMetadata {
  node: GraphNode;
  children: Set<string>; // SHAs of children
  parents: Set<string>; // SHAs of parents
  visited: boolean;
  lane: number;
}

/**
 * Build the graph layout with topological sorting and lane assignment
 */
export function buildGraphLayout(data: GraphData): GraphData {
  if (data.nodes.length === 0) {
    return data;
  }

  // Create metadata for each node
  const metadata = new Map<string, NodeMetadata>();
  data.nodes.forEach((node) => {
    metadata.set(node.sha, {
      node,
      children: new Set(),
      parents: new Set(node.parents),
      visited: false,
      lane: 0,
    });
  });

  // Build children relationships from edges
  data.edges.forEach((edge) => {
    const parent = metadata.get(edge.source);
    if (parent) {
      parent.children.add(edge.target);
    }
  });

  // Topological sort using DFS
  const sorted: GraphNode[] = [];
  const visiting = new Set<string>();

  function dfs(sha: string): void {
    const meta = metadata.get(sha);
    if (!meta || meta.visited) return;

    if (visiting.has(sha)) {
      // Cycle detected (shouldn't happen in git DAG)
      return;
    }

    visiting.add(sha);

    // Visit parents first (reverse topological order)
    meta.parents.forEach((parentSha) => {
      dfs(parentSha);
    });

    visiting.delete(sha);
    meta.visited = true;
    sorted.push(meta.node);
  }

  // Start DFS from all nodes (to handle disconnected components)
  data.nodes.forEach((node) => {
    if (!metadata.get(node.sha)?.visited) {
      dfs(node.sha);
    }
  });

  // Assign Y positions based on topological order
  sorted.forEach((node, index) => {
    node.y = index;
  });

  // Assign lanes
  assignLanes(sorted, metadata);

  // Calculate total lanes used
  const maxLane = Math.max(...sorted.map((n) => n.lane), 0);

  // Calculate X positions based on lanes
  const LANE_WIDTH = 40;
  sorted.forEach((node) => {
    node.x = node.lane * LANE_WIDTH;
  });

  return {
    nodes: sorted,
    edges: data.edges,
    lanes: maxLane + 1,
  };
}

/**
 * Assign lanes to nodes using a greedy algorithm
 * This tries to keep branches in consistent lanes and minimize crossings
 */
function assignLanes(nodes: GraphNode[], metadata: Map<string, NodeMetadata>): void {
  const laneUsage: Map<number, string | null> = new Map(); // lane -> current commit SHA using it
  let nextFreeLane = 0;

  nodes.forEach((node) => {
    const meta = metadata.get(node.sha);
    if (!meta) return;

    // Try to inherit lane from parent
    let assignedLane: number | null = null;

    if (meta.parents.size === 1) {
      // Single parent - try to use parent's lane
      const parentSha = Array.from(meta.parents)[0];
      const parentMeta = metadata.get(parentSha);
      if (parentMeta) {
        const parentLane = parentMeta.lane;
        if (laneUsage.get(parentLane) === parentSha || laneUsage.get(parentLane) === null) {
          assignedLane = parentLane;
        }
      }
    } else if (meta.parents.size > 1) {
      // Merge commit - try to use the first parent's lane
      const firstParentSha = Array.from(meta.parents)[0];
      const firstParentMeta = metadata.get(firstParentSha);
      if (firstParentMeta) {
        const parentLane = firstParentMeta.lane;
        if (laneUsage.get(parentLane) === firstParentSha || laneUsage.get(parentLane) === null) {
          assignedLane = parentLane;
        }
      }
    }

    // If no lane assigned yet, find a free lane
    if (assignedLane === null) {
      // Look for a free lane
      let foundFreeLane = false;
      for (let i = 0; i < nextFreeLane; i++) {
        if (laneUsage.get(i) === null) {
          assignedLane = i;
          foundFreeLane = true;
          break;
        }
      }

      if (!foundFreeLane) {
        assignedLane = nextFreeLane;
        nextFreeLane++;
      }
    }

    // Ensure assignedLane is not null
    if (assignedLane === null) {
      assignedLane = 0; // Fallback to lane 0
    }

    node.lane = assignedLane;
    meta.lane = assignedLane;
    laneUsage.set(assignedLane, node.sha);

    // Free up parent lanes if they have no more children
    meta.parents.forEach((parentSha) => {
      const parentMeta = metadata.get(parentSha);
      if (!parentMeta) return;

      // Check if all children have been processed
      const allChildrenProcessed = Array.from(parentMeta.children).every((childSha) => {
        const childMeta = metadata.get(childSha);
        return childMeta && childMeta.lane !== 0; // Assuming 0 means not yet assigned
      });

      if (allChildrenProcessed && laneUsage.get(parentMeta.lane) === parentSha) {
        laneUsage.set(parentMeta.lane, null);
      }
    });
  });
}
