import { Settings, Database, RefreshCw, Trash2, Download, Upload, Share2, FolderOpen, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ProgressService, ExportService } from '../services';
import { useChecklist } from '../hooks/useChecklist';
import { useProject } from '../contexts/ProjectContext';
import { useState } from 'react';

export const SettingsPage = () => {
  const { isAdminMode } = useAppContext();
  const { checklistData, checkedItems } = useChecklist();
  const { currentProject } = useProject();
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
    if (!confirm('This will replace your current checklist data for the current project. Are you sure?')) {
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
    if (!confirm('This will replace your current checklist data for the current project. Are you sure?')) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Database</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Database Location</p>
                <p className="text-sm text-gray-600">Stored locally in app data directory</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleResetProgress}
              className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Reset All Progress</span>
            </button>
            <p className="text-sm text-gray-600">
              This will clear all checked items but keep your checklist structure intact.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Data Portability</h2>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">{isExporting ? 'Exporting...' : 'Export to JSON'}</span>
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">{isImporting ? 'Importing...' : 'Import from JSON'}</span>
              </button>
            </div>
            <button
              onClick={handleImportFromClipboard}
              disabled={isImporting}
              className="w-full flex items-center gap-3 p-4 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200"
            >
              <Clipboard className="w-5 h-5" />
              <span className="font-medium">{isImporting ? 'Importing...' : 'Import from Clipboard'}</span>
            </button>
            <button
              onClick={() => {
                if ((window as any).openShareModal) {
                  (window as any).openShareModal();
                } else {
                  alert('Share feature is loading...');
                }
              }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-200"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share via P2P (Offline)</span>
            </button>
            <p className="text-sm text-gray-600">
              Export your checklist data and progress to a JSON file that can be shared across devices.
              Import to restore data from a previously exported file. Use P2P sharing for direct device-to-device transfer without internet.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Manage multiple projects, each with its own checklist criteria.
            </p>
            <Link
              to="/projects"
              className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Manage Projects</span>
            </Link>
          </div>
        </section>

        {isAdminMode && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Admin Mode</h2>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-800">
                You are currently in admin mode. You can edit checklist items and sections.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

