import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Database,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Share2,
  Clipboard,
  FolderOpen,
} from 'lucide-react';
import { ProgressService } from '@/services';
import { ExportService } from '@/services';
import { useProject } from '@/contexts/ProjectContext';
import { useChecklist } from '../../checklist/hooks/useChecklist';
import { useAppContext } from '@/app/providers/AppProvider';

export const SettingsPage = () => {
  const { currentProject } = useProject();
  const { checklistData, checkedItems } = useChecklist();
  const { isAdminMode } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleResetProgress = async () => {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      try {
        await ProgressService.resetProgress();
        alert('Progress reset successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset progress:', error);
        alert('Failed to reset progress. Please try again.');
      }
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await ExportService.exportToJSON(checklistData, checkedItems);
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (
      !confirm(
        'This will replace your current checklist data for the current project. Are you sure?'
      )
    ) {
      return;
    }

    try {
      setIsImporting(true);
      const importData = await ExportService.importFromJSON();

      if (!importData) {
        return; // User cancelled
      }

      // Import the data into database
      await ExportService.importDataIntoDatabase(
        importData.checklistData,
        importData.checkedItems,
        currentProject?.id
      );

      alert('Data imported successfully! Reloading...');
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to import data.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromClipboard = async () => {
    if (
      !confirm(
        'This will replace your current checklist data for the current project. Are you sure?'
      )
    ) {
      return;
    }

    try {
      setIsImporting(true);
      const importData = await ExportService.importFromClipboard();

      if (!importData) {
        return;
      }

      // Import the data into database
      await ExportService.importDataIntoDatabase(
        importData.checklistData,
        importData.checkedItems,
        currentProject?.id
      );

      alert('Data imported successfully! Reloading...');
      window.location.reload();
    } catch (error) {
      console.error('Import from clipboard failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to import data from clipboard.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-accent shrink-0" />
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary">
          Settings
        </h1>
      </div>

      <div className="bg-bg-secondary dark:bg-bg-secondary rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-border-light dark:border-border-medium transition-colors">
        <section>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary">
              Database
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-bg-surface-2 dark:bg-bg-surface-2 rounded-lg border border-border-light dark:border-border-medium shadow-sm">
              <div>
                <p className="font-semibold text-sm sm:text-base text-text-primary dark:text-text-primary mb-1">
                  Database Location
                </p>
                <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
                  Stored locally in app data directory
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary">
              Data Management
            </h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleResetProgress}
              className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-150 border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">Reset All Progress</span>
            </button>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
              This will clear all checked items but keep your checklist structure intact.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary">
              Data Portability
            </h2>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-accent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/30 dark:border-primary/40 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">
                  {isExporting ? 'Exporting...' : 'Export to JSON'}
                </span>
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">
                  {isImporting ? 'Importing...' : 'Import from JSON'}
                </span>
              </button>
            </div>
            <button
              onClick={handleImportFromClipboard}
              disabled={isImporting}
              className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">
                {isImporting ? 'Importing...' : 'Import from Clipboard'}
              </span>
            </button>
            <button
              onClick={() => {
                if ((window as Window & { openShareModal?: () => void }).openShareModal) {
                  (window as Window & { openShareModal?: () => void }).openShareModal?.();
                } else {
                  alert('Share feature is loading...');
                }
              }}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 p-3 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-accent rounded-lg transition-all duration-150 border border-primary/30 dark:border-primary/40 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">Share via P2P (Offline)</span>
            </button>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
              Export your checklist data and progress to a JSON file that can be shared across
              devices. Import to restore data from a previously exported file. Use P2P sharing for
              direct device-to-device transfer without internet.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary">
              Projects
            </h2>
          </div>
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
              Manage multiple projects, each with its own checklist criteria.
            </p>
            <Link
              to="/projects"
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-accent rounded-lg transition-all duration-150 border border-primary/30 dark:border-primary/40 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">Manage Projects</span>
            </Link>
          </div>
        </section>

        {isAdminMode && (
          <section>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-text-secondary shrink-0" />
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-primary">
                Admin Mode
              </h2>
            </div>
            <div className="p-3 sm:p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
              <p className="text-xs sm:text-sm text-primary dark:text-accent">
                You are currently in admin mode. You can edit checklist items and sections.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
