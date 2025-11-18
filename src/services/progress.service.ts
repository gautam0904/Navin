import { safeInvoke } from '../utils/tauri';

/**
 * Progress Service
 * Handles user progress tracking (checked items) via Tauri commands
 */
export class ProgressService {
  /**
   * Get all checked item IDs for a project
   */
  static async getCheckedItems(projectId?: string): Promise<string[]> {
    try {
      return await safeInvoke<string[]>("get_checked_items", { projectId: projectId || null });
    } catch (error) {
      console.error("Failed to get checked items:", error);
      throw error;
    }
  }

  /**
   * Toggle item checked status for a project
   */
  static async toggleItem(itemId: string, projectId?: string): Promise<boolean> {
    try {
      return await safeInvoke<boolean>("toggle_item_checked", { itemId, projectId: projectId || null });
    } catch (error) {
      console.error("Failed to toggle item:", error);
      throw error;
    }
  }

  /**
   * Set item checked status for a project
   */
  static async setItemChecked(
    itemId: string,
    isChecked: boolean,
    projectId?: string
  ): Promise<void> {
    try {
      await safeInvoke("set_item_checked", { itemId, isChecked, projectId: projectId || null });
    } catch (error) {
      console.error("Failed to set item checked:", error);
      throw error;
    }
  }

  /**
   * Reset all progress for a project
   */
  static async resetProgress(projectId?: string): Promise<void> {
    try {
      await safeInvoke("reset_progress", { projectId: projectId || null });
    } catch (error) {
      console.error("Failed to reset progress:", error);
      throw error;
    }
  }
}
