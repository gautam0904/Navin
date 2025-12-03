import { invoke } from '@tauri-apps/api/core';
import type { RepositoryInfo, RepositoryStatus, Branch } from '../types/git';

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
   * Set git configuration
   */
  static async setConfig(name: string, email: string): Promise<void> {
    return invoke('set_git_config', { name, email });
  }
}
