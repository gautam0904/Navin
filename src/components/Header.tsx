import React from 'react';
import { Download, RotateCcw, Settings, Save, Copy, XCircle, Plus, FolderOpen } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useProject } from '../contexts/ProjectContext';

interface HeaderProps {
  progressPercent: number;
  completedItems: number;
  totalItems: number;
  isAdminMode: boolean;
  hasUnsavedChanges: boolean;
  onAdminClick: () => void;
  onReset: () => void;
  onExport: () => void;
  onSave: () => void;
  onCopyCode: () => void;
  onExitAdmin: () => void;
  onAddSection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progressPercent,
  completedItems,
  totalItems,
  isAdminMode,
  hasUnsavedChanges,
  onAdminClick,
  onReset,
  onExport,
  onSave,
  onCopyCode,
  onExitAdmin,
  onAddSection
}) => {
  const { currentProject } = useProject();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200">
              <span className="text-2xl">🧩</span>
              <span className="text-sm font-semibold text-blue-700">PRE-COMMIT CHECKLIST</span>
            </div>
            {currentProject && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200">
                <FolderOpen className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">{currentProject.name}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {currentProject ? `${currentProject.name} Checklist` : 'Frontend Implementation Checklist'}
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            {currentProject 
              ? `Project-specific criteria for ${currentProject.name}. Each project has its own checklist.`
              : 'Follow every item before committing your code'
            }
          </p>
          {currentProject && (
            <p className="text-sm text-gray-500 mt-2">
              💡 Switch projects to see different criteria. Each project maintains separate checklist sections and progress.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {isAdminMode ? (
            <>
              <button
                onClick={onSave}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-semibold shadow-lg border ${
                  hasUnsavedChanges
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200 animate-pulse border-green-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                <Save size={20} />
                {hasUnsavedChanges ? 'Ready to Save' : 'No Changes'}
              </button>
              <button
                onClick={onCopyCode}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-indigo-200 border border-indigo-300"
              >
                <Copy size={20} />
                Copy Code
              </button>
              <button
                onClick={onExitAdmin}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-600 font-semibold border border-red-200"
              >
                <XCircle size={20} />
                Exit
              </button>
            </>
          ) : (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-600 font-semibold border border-blue-200"
            >
              <Settings size={20} />
              Admin
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 font-semibold border border-gray-300"
          >
            <RotateCcw size={20} />
            Reset
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-200 border border-blue-300"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      <ProgressBar
        progressPercent={progressPercent}
        completedItems={completedItems}
        totalItems={totalItems}
      />

      {isAdminMode && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={onAddSection}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-green-200 border border-green-300"
            >
              <Plus size={20} />
              Add New Section
            </button>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <span className="text-yellow-700 font-semibold">⚠️ Click "Copy Code" to save permanently</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

