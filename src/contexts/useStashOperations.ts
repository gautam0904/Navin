import { useCallback } from 'react';

// Placeholder stash operations - to be implemented when backend is ready
export function useStashOperations() {
  const refreshStashes = useCallback(async () => {
    // Stash support not fully implemented in service yet, placeholder
    // if (!repository) return;
    // try {
    //   const stashList = await GitService.listStashes();
    //   setStashes(stashList);
    // } catch (err) {
    //   console.error('[GitContext] Failed to refresh stashes:', err);
    //   setStashes([]);
    // }
    return [];
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createStash = useCallback(async (_message?: string) => {
    // await GitService.createStash(_message);
    // await refreshStashes();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const applyStash = useCallback(async (_index: number) => {
    // await GitService.applyStash(_index);
    // await refreshStatus();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const popStash = useCallback(async (_index: number) => {
    // await GitService.popStash(_index);
    // await refreshStatus();
    // await refreshStashes();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dropStash = useCallback(async (_index: number) => {
    // await GitService.dropStash(_index);
    // await refreshStashes();
  }, []);

  return {
    refreshStashes,
    createStash,
    applyStash,
    popStash,
    dropStash,
  };
}
