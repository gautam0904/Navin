import { useCallback } from 'react';
import { GitService } from '../services/gitService';

export function useStagingOperations(
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  refreshStatus: () => Promise<void>
) {
  const stageFile = useCallback(
    async (path: string) => {
      setIsLoading(true);
      try {
        await GitService.stageFile(path);
        await refreshStatus();
      } catch (err) {
        console.error('[GitContext] stageFile error:', err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, setIsLoading, setError]
  );

  const stageAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await GitService.stageAll();
      await refreshStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus, setIsLoading, setError]);

  const unstageFile = useCallback(
    async (path: string) => {
      setIsLoading(true);
      try {
        await GitService.unstageFile(path);
        await refreshStatus();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, setIsLoading, setError]
  );

  const unstageAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await GitService.unstageAll();
      await refreshStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus, setIsLoading, setError]);

  return {
    stageFile,
    stageAll,
    unstageFile,
    unstageAll,
  };
}
