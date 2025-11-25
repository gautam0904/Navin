import { ChecklistSection, ChecklistItem, CodeExamples } from '../types/checklist';
import { safeInvoke } from '../utils/tauri';

/**
 * Checklist Service
 * Handles all checklist-related database operations via Tauri commands
 */
export class ChecklistService {
  /**
   * Get all checklist sections with their items
   */
  static async getAllSections(projectId?: string): Promise<ChecklistSection[]> {
    try {
      return await safeInvoke<ChecklistSection[]>('get_all_sections', {
        projectId: projectId || null,
      });
    } catch (error) {
      console.error('Failed to get sections:', error);
      throw error;
    }
  }

  /**
   * Add a new section
   */
  static async addSection(
    section: ChecklistSection,
    displayOrder: number,
    projectId?: string
  ): Promise<void> {
    try {
      await safeInvoke('add_section', { section, displayOrder, projectId: projectId || null });
    } catch (error) {
      console.error('Failed to add section:', error);
      throw error;
    }
  }

  /**
   * Update section title
   */
  static async updateSectionTitle(sectionId: string, title: string): Promise<void> {
    try {
      await safeInvoke('update_section_title', { sectionId, title });
    } catch (error) {
      console.error('Failed to update section title:', error);
      throw error;
    }
  }

  /**
   * Delete a section
   */
  static async deleteSection(sectionId: string): Promise<void> {
    try {
      await safeInvoke('delete_section', { sectionId });
    } catch (error) {
      console.error('Failed to delete section:', error);
      throw error;
    }
  }

  /**
   * Add an item to a section
   */
  static async addItem(sectionId: string, item: ChecklistItem): Promise<void> {
    try {
      await safeInvoke('add_item', { sectionId, item });
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  }

  /**
   * Update an item's text
   */
  static async updateItem(itemId: string, text: string): Promise<void> {
    try {
      await safeInvoke('update_item', { itemId, text });
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  }

  /**
   * Delete an item
   */
  static async deleteItem(itemId: string): Promise<void> {
    try {
      await safeInvoke('delete_item', { itemId });
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }

  /**
   * Update examples for a section
   */
  static async updateExamples(
    sectionId: string,
    examples?: { good: string[]; bad: string[] }
  ): Promise<void> {
    try {
      await safeInvoke('update_section_examples', { sectionId, examples: examples || null });
    } catch (error) {
      console.error('Failed to update examples:', error);
      throw error;
    }
  }

  /**
   * Update code examples for a section (good/bad with language)
   */
  static async updateCodeExamples(sectionId: string, codeExamples?: CodeExamples): Promise<void> {
    try {
      await safeInvoke('update_section_code_examples', {
        sectionId,
        codeExamples: codeExamples || null,
      });
    } catch (error) {
      console.error('Failed to update code examples:', error);
      throw error;
    }
  }

  /**
   * Update code example for a section (legacy - single code example)
   */
  static async updateCodeExample(sectionId: string, codeExample?: string): Promise<void> {
    try {
      await safeInvoke('update_section_code_example', {
        sectionId,
        codeExample: codeExample || null,
      });
    } catch (error) {
      console.error('Failed to update code example:', error);
      throw error;
    }
  }

  /**
   * Update examples for an item
   */
  static async updateItemExamples(
    itemId: string,
    examples?: { good: string[]; bad: string[] }
  ): Promise<void> {
    try {
      await safeInvoke('update_item_examples', { itemId, examples: examples || null });
    } catch (error) {
      console.error('Failed to update item examples:', error);
      throw error;
    }
  }

  /**
   * Update code examples for an item (good/bad with language)
   */
  static async updateItemCodeExamples(itemId: string, codeExamples?: CodeExamples): Promise<void> {
    try {
      await safeInvoke('update_item_code_examples', { itemId, codeExamples: codeExamples || null });
    } catch (error) {
      console.error('Failed to update item code examples:', error);
      throw error;
    }
  }

  /**
   * Update code example for an item (legacy - single code example)
   */
  static async updateItemCodeExample(itemId: string, codeExample?: string): Promise<void> {
    try {
      await safeInvoke('update_item_code_example', { itemId, codeExample: codeExample || null });
    } catch (error) {
      console.error('Failed to update item code example:', error);
      throw error;
    }
  }
}
