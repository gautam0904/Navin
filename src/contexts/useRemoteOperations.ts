import { useCallback } from 'react';
import { GitService } from '../services/gitService';

export function useRemoteOperations(
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  refreshRemotes: () => Promise<void>,
  refreshStatus: () => Promise<void>,
  refreshHistory: () => Promise<void>
) {
  const addRemote = useCallback(
    async (name: string, url: string) => {
      setIsLoading(true);
      try {
        await GitService.addRemote(name, url);
        await refreshRemotes();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [refreshRemotes, setIsLoading, setError]
  );

  const removeRemote = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await GitService.removeRemote(name);
        await refreshRemotes();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [refreshRemotes, setIsLoading, setError]
  );

  const fetchRemote = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await GitService.fetchRemote(name);
        await Promise.all([refreshStatus(), refreshHistory()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, refreshHistory, setIsLoading, setError]
  );

  const pushToRemote = useCallback(
    async (remote: string, branch: string, force?: boolean) => {
      setIsLoading(true);
      try {
        await GitService.pushToRemote(remote, branch, force);
        await refreshStatus();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, setIsLoading, setError]
  );

  const pullFromRemote = useCallback(
    async (remote: string, branch: string) => {
      setIsLoading(true);
      try {
        await GitService.pullFromRemote(remote, branch);
        await Promise.all([refreshStatus(), refreshHistory()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, refreshHistory, setIsLoading, setError]
  );

  return {
    addRemote,
    removeRemote,
    fetchRemote,
    pushToRemote,
    pullFromRemote,
  };
}

