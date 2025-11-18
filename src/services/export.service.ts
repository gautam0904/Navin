import { ChecklistSection } from "../types/checklist";
import { invoke } from "@tauri-apps/api/core";
import { defaultChecklistData } from "../data/defaultChecklist";

export interface ExportData {
  version: string;
  exportedAt: string;
  checklistData: ChecklistSection[];
  checkedItems: Record<string, boolean>;
  defaultChecklistData?: ChecklistSection[];
}

/**
 * Export service for JSON data portability
 * Allows users to save/load checklist data across devices
 */
export class ExportService {
  private static readonly VERSION = "1.0.0";

  /**
   * Export checklist data and progress to JSON file
   */
  static async exportToJSON(
    checklistData: ChecklistSection[],
    checkedItems: Record<string, boolean>
  ): Promise<void> {
    try {
      const exportData: ExportData = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        checklistData,
        checkedItems,
        defaultChecklistData, // Include default checklist in export
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      // Use Tauri command to save file
      await invoke("save_export_file", {
        content: jsonString,
        filename: `navin-export-${new Date().toISOString().split("T")[0]}.json`,
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      // Fallback to clipboard
      try {
        await this.exportToClipboard(checklistData, checkedItems);
        alert("Failed to save file, but data has been copied to clipboard!");
      } catch (clipboardError) {
        throw new Error("Failed to save file. Please try copying manually.");
      }
    }
  }

  /**
   * Export to clipboard as fallback
   */
  static async exportToClipboard(
    checklistData: ChecklistSection[],
    checkedItems: Record<string, boolean>
  ): Promise<void> {
    const jsonString = this.exportToJSONString(checklistData, checkedItems);
    await navigator.clipboard.writeText(jsonString);
  }

  /**
   * Import checklist data and progress from JSON file
   */
  static async importFromJSON(): Promise<ExportData | null> {
    try {
      // Use Tauri command to open file (now async with dialog)
      const content = await invoke<string>("open_import_file");

      if (!content || content === "No file selected") {
        return null; // User cancelled
      }

      const importData: ExportData = JSON.parse(content);

      // Validate data structure
      if (
        !importData.checklistData ||
        !Array.isArray(importData.checklistData)
      ) {
        throw new Error("Invalid export file format");
      }

      return importData;
    } catch (error) {
      console.error("Failed to import data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to import data. Please check the file format.";
      if (errorMessage.includes("No file selected")) {
        return null; // User cancelled, not an error
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Export to JSON string (for clipboard or API)
   */
  static exportToJSONString(
    checklistData: ChecklistSection[],
    checkedItems: Record<string, boolean>
  ): string {
    const exportData: ExportData = {
      version: this.VERSION,
      exportedAt: new Date().toISOString(),
      checklistData,
      checkedItems,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import from JSON string
   */
  static importFromJSONString(jsonString: string): ExportData {
    try {
      const importData: ExportData = JSON.parse(jsonString);

      if (
        !importData.checklistData ||
        !Array.isArray(importData.checklistData)
      ) {
        throw new Error("Invalid export format");
      }

      return importData;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  }

  /**
   * Import from clipboard JSON string
   */
  static async importFromClipboard(): Promise<ExportData | null> {
    try {
      const jsonString = await navigator.clipboard.readText();
      return this.importFromJSONString(jsonString);
    } catch (error) {
      console.error("Failed to import from clipboard:", error);
      throw new Error("Failed to read from clipboard. Please make sure the JSON data is copied.");
    }
  }

  /**
   * Import data into database
   */
  static async importDataIntoDatabase(
    checklistData: ChecklistSection[],
    checkedItems: Record<string, boolean>,
    projectId?: string
  ): Promise<void> {
    try {
      const checkedItemIds = Object.keys(checkedItems).filter(id => checkedItems[id]);
      await invoke("import_checklist_data", {
        sections: checklistData,
        checkedItems: checkedItemIds,
        projectId: projectId || null,
      });
    } catch (error) {
      console.error("Failed to import data into database:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to import data into database."
      );
    }
  }
}
