import { useCallback } from 'react';
import { GitService } from '../services/gitService';

export function useBranchOperations(
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  refreshStatus: () => Promise<void>,
  refreshBranches: () => Promise<void>,
  refreshHistory: () => Promise<void>
) {
  const checkoutBranch = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await GitService.checkoutBranch(name);
        await Promise.all([refreshStatus(), refreshBranches(), refreshHistory()]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, refreshBranches, refreshHistory, setIsLoading, setError]
  );

  const createBranch = useCallback(
    async (name: string, from?: string) => {
      setIsLoading(true);
      try {
        await GitService.createBranch(name, from);
        await refreshBranches();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshBranches, setIsLoading, setError]
  );

  const deleteBranch = useCallback(
    async (name: string, force: boolean = false) => {
      setIsLoading(true);
      try {
        await GitService.deleteBranch(name, force);
        await refreshBranches();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshBranches, setIsLoading, setError]
  );

  return {
    checkoutBranch,
    createBranch,
    deleteBranch,
  };
}

