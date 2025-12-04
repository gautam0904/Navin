import { GraphData } from './graphParser';

/**
 * Optimize graph data for large repositories
 * Implements level-of-detail rendering
 */
export function optimizeGraphData(
  data: GraphData,
  visibleRange: { start: number; end: number },
  zoomLevel: number
): GraphData {
  // For high zoom levels, show all details
  if (zoomLevel > 0.8) {
    return data;
  }

  // For low zoom levels, simplify the graph
  const visibleNodes = data.nodes.filter(
    (_node, index) => index >= visibleRange.start && index <= visibleRange.end
  );

  // Only keep edges that connect visible nodes
  const visibleNodeShas = new Set(visibleNodes.map((n) => n.sha));
  const visibleEdges = data.edges.filter(
    (edge) => visibleNodeShas.has(edge.source) && visibleNodeShas.has(edge.target)
  );

  return {
    nodes: visibleNodes,
    edges: visibleEdges,
    lanes: data.lanes,
  };
}

/**
 * Calculate visible range for virtual scrolling
 */
export function calculateVisibleRange(
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  totalNodes: number,
  buffer: number = 10
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const end = Math.min(
    totalNodes - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + buffer
  );

  return { start, end };
}

/**
 * Memoization cache for graph computations
 */
const graphCache = new Map<string, GraphData>();

export function getCachedGraph(key: string): GraphData | undefined {
  return graphCache.get(key);
}

export function setCachedGraph(key: string, data: GraphData): void {
  // Limit cache size to prevent memory leaks
  if (graphCache.size > 10) {
    const firstKey = graphCache.keys().next().value;
    if (firstKey) {
      graphCache.delete(firstKey);
    }
  }
  graphCache.set(key, data);
}

export function clearGraphCache(): void {
  graphCache.clear();
}
