import { useState, useCallback, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { GraphNode } from '../utils/graphParser';

interface CommitTooltipData {
  node: GraphNode;
  x: number;
  y: number;
}

export function useGraphInteractivity() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<CommitTooltipData | null>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNodeHover = useCallback((node: GraphNode | null, event?: MouseEvent) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }

    if (node && event) {
      setHoveredNode(node.sha);

      // Show tooltip after a short delay
      tooltipTimeoutRef.current = setTimeout(() => {
        setTooltip({
          node,
          x: event.clientX,
          y: event.clientY,
        });
      }, 300);
    } else {
      setHoveredNode(null);
      setTooltip(null);
    }
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node.sha);
  }, []);

  const handleNodeDoubleClick = useCallback((node: GraphNode) => {
    // Could open commit details in right panel
    console.log('Double-clicked commit:', node.sha);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoveredNode,
    selectedNode,
    tooltip,
    handleNodeHover,
    handleNodeClick,
    handleNodeDoubleClick,
  };
}
