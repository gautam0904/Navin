import { Link } from 'react-router-dom';
import { ClipboardList, TrendingUp, Settings, ArrowRight, FolderOpen } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useChecklist } from '../hooks/useChecklist';
import { useProject } from '../contexts/ProjectContext';

export const HomePage = () => {
  const { totalItems, completedItems, progressPercent } = useChecklist();
  const { currentProject } = useProject();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Navin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your comprehensive developer checklist to maintain code quality and follow best practices
        </p>
        {currentProject && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Current Project: <span className="font-semibold">{currentProject.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Your Progress
          </h2>
          <Link
            to={ROUTES.CHECKLIST}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View Checklist
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completed Items</span>
              <span className="font-semibold">
                {completedItems} / {totalItems}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{progressPercent}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={ROUTES.CHECKLIST}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">View Checklist</h3>
              <p className="text-sm text-gray-600">
                Access your complete developer checklist
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        </Link>

        <Link
          to={ROUTES.PROJECTS}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FolderOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Projects</h3>
              <p className="text-sm text-gray-600">
                Manage projects with different checklist criteria
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </Link>

        <Link
          to={ROUTES.SETTINGS}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Settings</h3>
              <p className="text-sm text-gray-600">
                Manage your preferences and data
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Comprehensive Checklist</h3>
            <p className="text-sm text-gray-600">
              Covering branch naming, API handling, code quality, testing, and more
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">💾 Persistent Storage</h3>
            <p className="text-sm text-gray-600">
              Your progress is saved locally using SQLite database
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">⚙️ Admin Mode</h3>
            <p className="text-sm text-gray-600">
              Edit and customize checklist items to fit your workflow
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📁 Project-Based</h3>
            <p className="text-sm text-gray-600">
              Each project has its own checklist criteria and progress tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

