import { CommitSummary } from '@/types/git';

export interface GraphNode extends CommitSummary {
  x: number;
  y: number;
  lane: number;
}

export interface GraphEdge {
  source: string; // parent sha
  target: string; // child sha
  type: 'default' | 'merge' | 'fork';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  lanes: number;
}

export function parseCommitGraph(commits: CommitSummary[]): GraphData {
  const nodes: GraphNode[] = commits.map((commit, index) => ({
    ...commit,
    x: 0,
    y: index, // Initial Y based on topological/time order
    lane: 0,
  }));

  const edges: GraphEdge[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.sha, n]));

  nodes.forEach((node) => {
    node.parents.forEach((parentSha) => {
      // Only add edge if parent exists in the current set (might be partial history)
      if (nodeMap.has(parentSha)) {
        edges.push({
          source: parentSha,
          target: node.sha,
          type: 'default', // Logic for merge/fork will be added in layout phase
        });
      }
    });
  });

  return { nodes, edges, lanes: 1 };
}
