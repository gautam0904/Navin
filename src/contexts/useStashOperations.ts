import { useCallback } from 'react';
import { GitService } from '../services/gitService';
import { Stash } from '../types/git';

export function useStashOperations(
  repository: string | null,
  setStashes: (stashes: Stash[]) => void,
  refreshStatus: () => Promise<void>
) {
  const refreshStashes = useCallback(async () => {
    if (!repository) return [];
    try {
      const stashList = await GitService.listStashes();
      setStashes(stashList);
      return stashList;
    } catch (err) {
      console.error('[GitContext] Failed to refresh stashes:', err);
      setStashes([]);
      return [];
    }
  }, [repository, setStashes]);

  const createStash = useCallback(
    async (message?: string) => {
      await GitService.createStash(message);
      await refreshStashes();
    },
    [refreshStashes]
  );

  const applyStash = useCallback(
    async (index: number) => {
      await GitService.applyStash(index);
      await refreshStatus();
    },
    [refreshStatus]
  );

  const popStash = useCallback(
    async (index: number) => {
      await GitService.popStash(index);
      await refreshStatus();
      await refreshStashes();
    },
    [refreshStatus, refreshStashes]
  );

  const dropStash = useCallback(
    async (index: number) => {
      await GitService.dropStash(index);
      await refreshStashes();
    },
    [refreshStashes]
  );

  return {
    refreshStashes,
    createStash,
    applyStash,
    popStash,
    dropStash,
  };
}
