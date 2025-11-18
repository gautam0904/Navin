import { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit2, Trash2, Check, X, Star, StarOff, ClipboardList, Eye, ArrowRight } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { ProjectService } from '../services/project.service';
import { ChecklistSection } from '../types/checklist';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface ProjectStats {
  projectId: string;
  sectionsCount: number;
  itemsCount: number;
  completedCount: number;
  sections: ChecklistSection[];
}

export const ProjectsPage = () => {
  const {
    projects,
    currentProject,
    isLoading,
    error,
    switchProject,
    createProject,
    updateProject,
    deleteProject,
  } = useProject();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [projectStats, setProjectStats] = useState<Record<string, ProjectStats>>({});
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});

  const handleStartEdit = (project: typeof projects[0]) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;

    try {
      await updateProject(editingId, editName.trim(), editDescription.trim() || undefined);
      setEditingId(null);
      setEditName('');
      setEditDescription('');
    } catch (err) {
      // Error already shown in context
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProject(projectId);
    } catch (err) {
      // Error already shown in context
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;

    try {
      await createProject(newName.trim(), newDescription.trim() || undefined);
      setShowCreateForm(false);
      setNewName('');
      setNewDescription('');
    } catch (err) {
      // Error already shown in context
    }
  };

  const handleSwitch = async (projectId: string) => {
    if (currentProject?.id === projectId) return;

    if (confirm('Switch to this project? Your current progress will be saved.')) {
      try {
        await switchProject(projectId);
      } catch (err) {
        // Error already shown in context
      }
    }
  };

  // Load checklist stats for each project
  useEffect(() => {
    const loadProjectStats = async () => {
      for (const project of projects) {
        try {
          setLoadingStats(prev => ({ ...prev, [project.id]: true }));
          const checklist = await ProjectService.getProjectChecklist(project.id);
          
          // Get completed items count
          const { ProgressService } = await import('../services');
          const checkedItems = await ProgressService.getCheckedItems(project.id);
          
          const totalItems = checklist.reduce((sum, section) => sum + section.items.length, 0);
          const completedItems = checkedItems.length;
          
          setProjectStats(prev => ({
            ...prev,
            [project.id]: {
              projectId: project.id,
              sectionsCount: checklist.length,
              itemsCount: totalItems,
              completedCount: completedItems,
              sections: checklist,
            },
          }));
        } catch (err) {
          console.error(`Failed to load stats for project ${project.id}:`, err);
        } finally {
          setLoadingStats(prev => ({ ...prev, [project.id]: false }));
        }
      }
    };

    if (projects.length > 0) {
      loadProjectStats();
    }
  }, [projects]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          </div>
          <p className="text-gray-600 ml-9">
            Each project has its own checklist criteria. Switch between projects to see different checklists.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Project</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter project description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewName('');
                  setNewDescription('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const isEditing = editingId === project.id;
          const isCurrent = currentProject?.id === project.id;
          const stats = projectStats[project.id];
          const isLoadingStats = loadingStats[project.id];

          return (
            <div
              key={project.id}
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        {isCurrent && (
                          <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Checklist Stats */}
                  <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-gray-900">Checklist Criteria</h4>
                    </div>
                    {isLoadingStats ? (
                      <div className="text-sm text-gray-500">Loading...</div>
                    ) : stats ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Criteria Sections:</span>
                          <span className="font-semibold text-gray-900">{stats.sectionsCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Total Items:</span>
                          <span className="font-semibold text-gray-900">{stats.itemsCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-semibold text-indigo-600">
                            {stats.completedCount} / {stats.itemsCount}
                          </span>
                        </div>
                        {stats.itemsCount > 0 && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${Math.round((stats.completedCount / stats.itemsCount) * 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round((stats.completedCount / stats.itemsCount) * 100)}% Complete
                            </div>
                          </div>
                        )}
                        {stats.sections.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="text-xs font-semibold text-gray-700 mb-2">Criteria Types:</div>
                            <div className="flex flex-wrap gap-1">
                              {stats.sections.slice(0, 5).map((section) => (
                                <span
                                  key={section.id}
                                  className="px-2 py-1 bg-white text-xs text-gray-700 rounded border border-blue-200"
                                >
                                  {section.title.replace(/[^\w\s]/g, '').substring(0, 20)}
                                </span>
                              ))}
                              {stats.sections.length > 5 && (
                                <span className="px-2 py-1 bg-white text-xs text-gray-500 rounded border border-blue-200">
                                  +{stats.sections.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No checklist criteria yet</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCurrent && (
                      <button
                        onClick={() => handleSwitch(project.id)}
                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <StarOff className="w-4 h-4 inline mr-1" />
                        Switch
                      </button>
                    )}
                    {isCurrent && (
                      <Link
                        to={ROUTES.CHECKLIST}
                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium text-center"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View Criteria
                        <ArrowRight className="w-4 h-4 inline ml-1" />
                      </Link>
                    )}
                    {!isCurrent && (
                      <Link
                        to={ROUTES.CHECKLIST}
                        onClick={() => handleSwitch(project.id)}
                        className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium text-center border border-green-200"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View Criteria
                      </Link>
                    )}
                    <button
                      onClick={() => handleStartEdit(project)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!project.is_default && (
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && !showCreateForm && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-4">Create your first project to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};
