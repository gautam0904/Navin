import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { RepositoryInfo, RepositoryStatus, Branch } from '../types/git';
import { GitService } from '../services/gitService';

interface GitContextType {
  repository: RepositoryInfo | null;
  status: RepositoryStatus | null;
  branches: Branch[] | null;
  isLoading: boolean;
  error: string | null;
  openRepository: (path: string) => Promise<void>;
  refreshStatus: () => Promise<void>;
  refreshBranches: () => Promise<void>;
  stageFile: (path: string) => Promise<void>;
  stageAll: () => Promise<void>;
  unstageFile: (path: string) => Promise<void>;
  unstageAll: () => Promise<void>;
  commit: (message: string, author: string, email: string) => Promise<void>;
  checkoutBranch: (name: string) => Promise<void>;
  createBranch: (name: string, from?: string) => Promise<void>;
}

const GitContext = createContext<GitContextType | undefined>(undefined);

export function GitProvider({ children }: { children: React.ReactNode }) {
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [status, setStatus] = useState<RepositoryStatus | null>(null);
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openRepository = useCallback(
    async (path: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const repo = await GitService.openRepository(path);
        setRepository(repo);

        // Auto-refresh status and branches
        await Promise.all([refreshStatus(), refreshBranches()]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error('Failed to open repository:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, refreshBranches]
  );

  const refreshStatus = useCallback(async () => {
    if (!repository) return;

    try {
      const newStatus = await GitService.getStatus();
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to refresh status:', err);
    }
  }, [repository]);

  const refreshBranches = useCallback(async () => {
    if (!repository) return;

    try {
      const newBranches = await GitService.getBranches();
      setBranches(newBranches);
    } catch (err) {
      console.error('Failed to refresh branches:', err);
      // If we fail to load branches, set to empty array so UI doesn't hang on loading
      setBranches([]);
    }
  }, [repository]);

  const stageFile = useCallback(
    async (path: string) => {
      setIsLoading(true);
      try {
        await GitService.stageFile(path);
        await refreshStatus();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus]
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
  }, [refreshStatus]);

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
    [refreshStatus]
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
  }, [refreshStatus]);

  const commit = useCallback(
    async (message: string, author: string, email: string) => {
      setIsLoading(true);
      try {
        await GitService.createCommit(message, author, email);
        await refreshStatus();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus]
  );

  const checkoutBranch = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await GitService.checkoutBranch(name);
        await Promise.all([refreshStatus(), refreshBranches()]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshStatus, refreshBranches]
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
    [refreshBranches]
  );

  // Auto-refresh status every 3 seconds when repository is open
  useEffect(() => {
    if (!repository) return;

    const interval = setInterval(refreshStatus, 3000);
    return () => clearInterval(interval);
  }, [repository, refreshStatus]);

  const value: GitContextType = {
    repository,
    status,
    branches,
    isLoading,
    error,
    openRepository,
    refreshStatus,
    refreshBranches,
    stageFile,
    stageAll,
    unstageFile,
    unstageAll,
    commit,
    checkoutBranch,
    createBranch,
  };

  return <GitContext.Provider value={value}>{children}</GitContext.Provider>;
}

export function useGit() {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error('useGit must be used within GitProvider');
  }
  return context;
}
