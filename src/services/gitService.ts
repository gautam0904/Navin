import { invoke } from '@tauri-apps/api/core';
import type {
  RepositoryInfo,
  RepositoryStatus,
  Branch,
  Commit,
  CommitSummary,
  FileDiff,
  Remote,
  Stash,
} from '../types/git';

export class GitService {
  /**
   * Open a repository at the given path
   */
  static async openRepository(path: string): Promise<RepositoryInfo> {
    return invoke<RepositoryInfo>('open_repository', { path });
  }

  /**
   * Discover repository from a path (searches upwards)
   */
  static async discoverRepository(path: string): Promise<RepositoryInfo> {
    return invoke<RepositoryInfo>('discover_repository', { path });
  }

  /**
   * Get current repository status
   */
  static async getStatus(): Promise<RepositoryStatus> {
    return invoke<RepositoryStatus>('get_repository_status');
  }

  /**
   * Get all branches (local and remote)
   */
  static async getBranches(): Promise<Branch[]> {
    return invoke<Branch[]>('get_branches');
  }

  /**
   * Stage a file
   */
  static async stageFile(filePath: string): Promise<void> {
    return invoke('stage_file', { filePath });
  }

  /**
   * Stage all changes
   */
  static async stageAll(): Promise<void> {
    return invoke('stage_all');
  }

  /**
   * Unstage a file
   */
  static async unstageFile(filePath: string): Promise<void> {
    return invoke('unstage_file', { filePath });
  }

  /**
   * Unstage all changes
   */
  static async unstageAll(): Promise<void> {
    return invoke('unstage_all');
  }

  /**
   * Create a commit
   */
  static async createCommit(
    message: string,
    authorName: string,
    authorEmail: string
  ): Promise<string> {
    return invoke<string>('create_commit', {
      message,
      authorName,
      authorEmail,
    });
  }

  /**
   * Checkout a branch
   */
  static async checkoutBranch(branchName: string): Promise<void> {
    return invoke('checkout_branch', { branchName });
  }

  /**
   * Create a new branch
   */
  static async createBranch(name: string, from?: string): Promise<void> {
    return invoke('create_branch', { name, from });
  }

  /**
   * Delete a branch
   */
  static async deleteBranch(name: string, force: boolean = false): Promise<void> {
    return invoke('delete_branch', { name, force });
  }

  /**
   * Get current repository path
   */
  static async getCurrentRepository(): Promise<string | null> {
    return invoke<string | null>('get_current_repository');
  }

  /**
   * Get git configuration
   */
  static async getConfig(): Promise<[string, string]> {
    return invoke<[string, string]>('get_git_config');
  }

  /**
   * Get detailed git configuration (global and local)
   * Returns: [globalName, globalEmail, localName, localEmail]
   */
  static async getConfigDetailed(): Promise<[string, string, string, string]> {
    return invoke<[string, string, string, string]>('get_git_config_detailed');
  }

  /**
   * Set git configuration
   * @param global - true for global config, false for local (default: false)
   */
  static async setConfig(name: string, email: string, global?: boolean): Promise<void> {
    return invoke('set_git_config', { name, email, global });
  }

  // ===== Phase 2: History Operations =====

  /**
   * Get paginated commit history
   */
  static async getCommits(limit: number, offset: number): Promise<CommitSummary[]> {
    return invoke<CommitSummary[]>('get_commits', { limit, offset });
  }

  /**
   * Get detailed commit information
   */
  static async getCommitDetails(sha: string): Promise<Commit> {
    return invoke<Commit>('get_commit_details', { sha });
  }

  /**
   * Get file changes for a specific commit
   */
  static async getCommitDiff(sha: string): Promise<FileDiff[]> {
    return invoke<FileDiff[]>('get_commit_diff', { sha });
  }

  /**
   * Get commit history for a specific file
   */
  static async getFileHistory(filePath: string, limit: number): Promise<CommitSummary[]> {
    return invoke<CommitSummary[]>('get_file_history', { filePath, limit });
  }

  // ===== Phase 2: Diff Operations =====

  /**
   * Get unstaged diff for a file
   */
  static async getFileDiffUnstaged(filePath: string): Promise<FileDiff> {
    return invoke<FileDiff>('get_file_diff_unstaged', { filePath });
  }

  /**
   * Get staged diff for a file
   */
  static async getFileDiffStaged(filePath: string): Promise<FileDiff> {
    return invoke<FileDiff>('get_file_diff_staged', { filePath });
  }

  /**
   * Get diff between two commits
   */
  static async getDiffBetweenCommits(commit1: string, commit2: string): Promise<FileDiff[]> {
    return invoke<FileDiff[]>('get_diff_between_commits', { commit1, commit2 });
  }

  // ===== Phase 2: Remote Operations =====

  /**
   * List all remotes
   */
  static async listRemotes(): Promise<Remote[]> {
    return invoke<Remote[]>('list_remotes');
  }

  /**
   * Add a new remote
   */
  static async addRemote(name: string, url: string): Promise<void> {
    return invoke('add_remote', { name, url });
  }

  /**
   * Remove a remote
   */
  static async removeRemote(name: string): Promise<void> {
    return invoke('remove_remote', { name });
  }

  /**
   * Fetch from remote
   */
  static async fetchRemote(name: string): Promise<void> {
    return invoke('fetch_remote', { name });
  }

  /**
   * Push to remote
   */
  static async pushToRemote(remote: string, branch: string, force?: boolean): Promise<void> {
    return invoke('push_to_remote', { remote, branch, force });
  }

  /**
   * Pull from remote
   */
  static async pullFromRemote(remote: string, branch: string): Promise<void> {
    return invoke('pull_from_remote', { remote, branch });
  }

  // ===== Stash Operations =====

  /**
   * List all stashes
   */
  static async listStashes(): Promise<Stash[]> {
    return invoke<Stash[]>('list_stashes');
  }

  /**
   * Create a new stash
   */
  static async createStash(message?: string): Promise<string> {
    return invoke<string>('create_stash', { message });
  }

  /**
   * Apply a stash by index
   */
  static async applyStash(index: number): Promise<void> {
    return invoke('apply_stash', { index });
  }

  /**
   * Pop a stash by index
   */
  static async popStash(index: number): Promise<void> {
    return invoke('pop_stash', { index });
  }

  /**
   * Drop a stash by index
   */
  static async dropStash(index: number): Promise<void> {
    return invoke('drop_stash', { index });
  }
}
