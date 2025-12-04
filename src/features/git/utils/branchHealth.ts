import { useMemo } from 'react';
import { GraphData } from '../utils/graphParser';
import { Branch } from '@/types/git';

export interface BranchHealth {
  name: string;
  commitCount: number;
  daysSinceLastCommit: number;
  isStale: boolean;
  isActive: boolean;
}

export function analyzeBranchHealth(
  graphData: GraphData | null,
  branches: Branch[] | null
): BranchHealth[] {
  if (!graphData || !branches) return [];

  return branches
    .filter((b) => !b.is_remote)
    .map((branch) => {
      const branchCommits = graphData.nodes.filter(
        (node) => node.message.includes(branch.name) // Simplified - would need better branch tracking
      );

      const lastCommit = branch.last_commit;
      const daysSinceLastCommit = lastCommit
        ? Math.floor(
            (Date.now() - new Date(lastCommit.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          )
        : 999;

      return {
        name: branch.name,
        commitCount: branchCommits.length,
        daysSinceLastCommit,
        isStale: daysSinceLastCommit > 30,
        isActive: daysSinceLastCommit < 7,
      };
    });
}

export function useBranchHealth(graphData: GraphData | null, branches: Branch[] | null) {
  return useMemo(() => analyzeBranchHealth(graphData, branches), [graphData, branches]);
}
