import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { RepositoryInfo, RepositoryStatus, Branch, CommitSummary, Remote, Stash } from '../types/git';
import { GitService } from '../services/gitService';

interface GitContextType {
  repository: RepositoryInfo | null;
  status: RepositoryStatus | null;
  branches: Branch[] | null;
  history: CommitSummary[] | null;
  remotes: Remote[] | null;
  stashes: Stash[] | null;
  isLoading: boolean;
  error: string | null;

  // Core
  openRepository: (path: string) => Promise<void>;
  closeRepository: () => void;
  refreshStatus: () => Promise<void>;
  refreshBranches: () => Promise<void>;

  // Staging
  stageFile: (path: string) => Promise<void>;
  stageAll: () => Promise<void>;
  unstageFile: (path: string) => Promise<void>;
  unstageAll: () => Promise<void>;

  // Commit
  commit: (message: string, author: string, email: string) => Promise<void>;

  // Branching
  checkoutBranch: (name: string) => Promise<void>;
  createBranch: (name: string, from?: string) => Promise<void>;
  deleteBranch: (name: string, force?: boolean) => Promise<void>;

  // Phase 2: History
  refreshHistory: (limit?: number, offset?: number) => Promise<void>;

  // Phase 2: Remotes
  refreshRemotes: () => Promise<void>;
  addRemote: (name: string, url: string) => Promise<void>;
  removeRemote: (name: string) => Promise<void>;
  fetchRemote: (name: string) => Promise<void>;
  pushToRemote: (remote: string, branch: string, force?: boolean) => Promise<void>;
  pullFromRemote: (remote: string, branch: string) => Promise<void>;

  // Phase 2: Stashes
  refreshStashes: () => Promise<void>;
  createStash: (message?: string) => Promise<void>;
  applyStash: (index: number) => Promise<void>;
  popStash: (index: number) => Promise<void>;
  dropStash: (index: number) => Promise<void>;
}

const GitContext = createContext<GitContextType | undefined>(undefined);

export function GitProvider({ children }: { children: React.ReactNode }) {
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [status, setStatus] = useState<RepositoryStatus | null>(null);
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [history, setHistory] = useState<CommitSummary[] | null>(null);
  const [remotes, setRemotes] = useState<Remote[] | null>(null);
  const [stashes, setStashes] = useState<Stash[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.error('[GitContext] Failed to refresh branches:', err);
      setBranches([]);
    }
  }, [repository]);

  const refreshHistory = useCallback(async (limit = 50, offset = 0) => {
    if (!repository) return;
    try {
      const commits = await GitService.getCommits(limit, offset);
      setHistory(commits);
    } catch (err) {
      console.error('[GitContext] Failed to refresh history:', err);
      setHistory([]);
    }
  }, [repository]);

  const refreshRemotes = useCallback(async () => {
    if (!repository) return;
    try {
      const remoteList = await GitService.listRemotes();
      setRemotes(remoteList);
    } catch (err) {
      console.error('[GitContext] Failed to refresh remotes:', err);
      setRemotes([]);
    }
  }, [repository]);

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
    setStashes([]);
  }, [repository]);

  const openRepository = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const repo = await GitService.openRepository(path);
      setRepository(repo);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('[GitContext] Failed to open repository:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeRepository = useCallback(() => {
    setRepository(null);
    setStatus(null);
    setBranches(null);
    setHistory(null);
    setRemotes(null);
    setStashes(null);
    setError(null);
  }, []);

  const stageFile = useCallback(async (path: string) => {
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
  }, [refreshStatus]);

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

  const unstageFile = useCallback(async (path: string) => {
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
  }, [refreshStatus]);

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

  const commit = useCallback(async (message: string, author: string, email: string) => {
    setIsLoading(true);
    try {
      await GitService.createCommit(message, author, email);
      await refreshStatus();
      await refreshHistory(); // Refresh history after commit
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus, refreshHistory]);

  const checkoutBranch = useCallback(async (name: string) => {
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
  }, [refreshStatus, refreshBranches, refreshHistory]);

  const createBranch = useCallback(async (name: string, from?: string) => {
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
  }, [refreshBranches]);

  const deleteBranch = useCallback(async (name: string, force: boolean = false) => {
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
  }, [refreshBranches]);

  // Remote operations
  const addRemote = useCallback(async (name: string, url: string) => {
    setIsLoading(true);
    try {
      await GitService.addRemote(name, url);
      await refreshRemotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [refreshRemotes]);

  const removeRemote = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      await GitService.removeRemote(name);
      await refreshRemotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [refreshRemotes]);

  const fetchRemote = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      await GitService.fetchRemote(name);
      await Promise.all([refreshStatus(), refreshHistory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus, refreshHistory]);

  const pushToRemote = useCallback(async (remote: string, branch: string, force?: boolean) => {
    setIsLoading(true);
    try {
      await GitService.pushToRemote(remote, branch, force);
      await refreshStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus]);

  const pullFromRemote = useCallback(async (remote: string, branch: string) => {
    setIsLoading(true);
    try {
      await GitService.pullFromRemote(remote, branch);
      await Promise.all([refreshStatus(), refreshHistory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus, refreshHistory]);

  // Stash operations (placeholders for now)
  const createStash = useCallback(async (message?: string) => {
    // await GitService.createStash(message);
    // await refreshStashes();
  }, []);

  const applyStash = useCallback(async (index: number) => {
    // await GitService.applyStash(index);
    // await refreshStatus();
  }, []);

  const popStash = useCallback(async (index: number) => {
    // await GitService.popStash(index);
    // await refreshStatus();
    // await refreshStashes();
  }, []);

  const dropStash = useCallback(async (index: number) => {
    // await GitService.dropStash(index);
    // await refreshStashes();
  }, []);

  // Initial load
  useEffect(() => {
    if (!repository) return;

    console.log('[GitContext] Repository changed, loading initial data...');
    Promise.all([
      refreshStatus(),
      refreshBranches(),
      refreshHistory(),
      refreshRemotes()
    ]).catch((err) => {
      console.error('[GitContext] Failed to load initial data:', err);
    });
  }, [repository, refreshStatus, refreshBranches, refreshHistory, refreshRemotes]);

  // Auto-refresh status
  useEffect(() => {
    if (!repository) return;
    const interval = setInterval(refreshStatus, 3000);
    return () => clearInterval(interval);
  }, [repository, refreshStatus]);

  const value: GitContextType = {
    repository,
    status,
    branches,
    history,
    remotes,
    stashes,
    isLoading,
    error,
    openRepository,
    closeRepository,
    refreshStatus,
    refreshBranches,
    stageFile,
    stageAll,
    unstageFile,
    unstageAll,
    commit,
    checkoutBranch,
    createBranch,
    deleteBranch,
    refreshHistory,
    refreshRemotes,
    addRemote,
    removeRemote,
    fetchRemote,
    pushToRemote,
    pullFromRemote,
    refreshStashes,
    createStash,
    applyStash,
    popStash,
    dropStash,
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
