import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  RepositoryInfo,
  RepositoryStatus,
  Branch,
  CommitSummary,
  Remote,
  Stash,
} from '../types/git';
import { GitService } from '../services/gitService';
import { useStashOperations } from './useStashOperations';
import { useRemoteOperations } from './useRemoteOperations';
import { useBranchOperations } from './useBranchOperations';
import { useStagingOperations } from './useStagingOperations';
import { useGitWatcher } from '../features/git/hooks/useGitWatcher';

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

  activeView: 'changes' | 'history' | 'branches' | 'stash' | 'remotes' | 'quality';
  setActiveView: (
    view: 'changes' | 'history' | 'branches' | 'stash' | 'remotes' | 'quality'
  ) => void;
  selectedFile: string | null;
  setSelectedFile: (path: string | null) => void;
  selectedCommit: string | null;
  setSelectedCommit: (sha: string | null) => void;
}

const GitContext = createContext<GitContextType | undefined>(undefined);

export function GitProvider({ children }: { children: React.ReactNode }) {
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [status, setStatus] = useState<RepositoryStatus | null>(null);
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [history, setHistory] = useState<CommitSummary[] | null>(null);
  const [remotes, setRemotes] = useState<Remote[] | null>(null);
  const [stashes, setStashes] = useState<Stash[] | null>(null);

  // UI State
  const [activeView, setActiveView] = useState<
    'changes' | 'history' | 'branches' | 'stash' | 'remotes' | 'quality'
  >('changes');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);

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

  const refreshHistory = useCallback(
    async (limit = 50, offset = 0) => {
      if (!repository) return;
      try {
        const commits = await GitService.getCommits(limit, offset);
        setHistory(commits);
      } catch (err) {
        console.error('[GitContext] Failed to refresh history:', err);
        setHistory([]);
      }
    },
    [repository]
  );

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

  const {
    refreshStashes: stashOpsRefresh,
    createStash,
    applyStash,
    popStash,
    dropStash,
  } = useStashOperations(repository?.path ?? null, setStashes, refreshStatus);

  const refreshStashes = useCallback(async () => {
    await stashOpsRefresh();
  }, [stashOpsRefresh]);

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

  const stagingOps = useStagingOperations(setIsLoading, setError, refreshStatus);
  const stageFile = stagingOps.stageFile;
  const stageAll = stagingOps.stageAll;
  const unstageFile = stagingOps.unstageFile;
  const unstageAll = stagingOps.unstageAll;

  const commit = useCallback(
    async (message: string, author: string, email: string) => {
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
    },
    [refreshStatus, refreshHistory]
  );

  const branchOps = useBranchOperations(
    setIsLoading,
    setError,
    refreshStatus,
    refreshBranches,
    refreshHistory
  );
  const checkoutBranch = branchOps.checkoutBranch;
  const createBranch = branchOps.createBranch;
  const deleteBranch = branchOps.deleteBranch;

  const remoteOps = useRemoteOperations(
    setIsLoading,
    setError,
    refreshRemotes,
    refreshStatus,
    refreshHistory
  );
  const addRemote = remoteOps.addRemote;
  const removeRemote = remoteOps.removeRemote;
  const fetchRemote = remoteOps.fetchRemote;
  const pushToRemote = remoteOps.pushToRemote;
  const pullFromRemote = remoteOps.pullFromRemote;

  // Stash operations delegated to hook
  // createStash, applyStash, popStash, dropStash are already destructured above

  const refreshAll = useCallback(async () => {
    if (!repository) return;
    await Promise.all([refreshStatus(), refreshBranches(), refreshHistory(), refreshRemotes()]);
  }, [repository, refreshStatus, refreshBranches, refreshHistory, refreshRemotes]);

  useEffect(() => {
    if (!repository) return;
    Promise.all([refreshStatus(), refreshBranches(), refreshHistory(), refreshRemotes()]).catch(
      (err) => console.error('[GitContext] Failed to load initial data:', err)
    );
  }, [repository, refreshStatus, refreshBranches, refreshHistory, refreshRemotes]);

  // Real-time monitoring
  useGitWatcher({
    repository,
    onRefresh: refreshAll,
    interval: 3000,
    enabled: !!repository,
  });

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
    // UI State
    activeView,
    setActiveView,
    selectedFile,
    setSelectedFile,
    selectedCommit,
    setSelectedCommit,
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
