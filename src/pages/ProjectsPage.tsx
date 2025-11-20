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
            <FolderOpen className="w-6 h-6 text-primary dark:text-accent" />
            <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary">Projects</h1>
          </div>
          <p className="text-text-secondary dark:text-text-secondary ml-9">
            Each project has its own checklist criteria. Switch between projects to see different checklists.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md p-6 border border-border-light dark:border-border-medium transition-colors">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary mb-4">Create New Project</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">
                Project Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">
                Description (optional)
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter project description"
                rows={3}
                className="w-full px-4 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewName('');
                  setNewDescription('');
                }}
                className="px-4 py-2 bg-bg-primary dark:bg-pickled-bluewood hover:bg-border-light dark:hover:bg-pickled-bluewood/80 text-text-secondary dark:text-loblolly rounded-lg transition-colors"
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
              className={`bg-bg-secondary dark:bg-bg-secondary rounded-xl shadow-sm p-6 border transition-all ${isCurrent
                ? 'border-primary dark:border-accent ring-2 ring-primary/20 dark:ring-accent/20 shadow-md'
                : 'border-border-light dark:border-border-medium hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-md'
                }`}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-2">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-3 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-white dark:text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-3 py-2 bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-text-secondary dark:text-text-secondary rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary">{project.name}</h3>
                        {isCurrent && (
                          <Star className="w-5 h-5 text-primary dark:text-accent fill-primary dark:fill-accent" />
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-text-secondary dark:text-text-secondary mb-3">{project.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Checklist Stats */}
                  <div className="mb-4 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList className="w-5 h-5 text-primary dark:text-accent" />
                      <h4 className="font-semibold text-text-primary dark:text-text-primary">Checklist Criteria</h4>
                    </div>
                    {isLoadingStats ? (
                      <div className="text-sm text-text-muted dark:text-text-muted">Loading...</div>
                    ) : stats ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary dark:text-text-secondary">Criteria Sections:</span>
                          <span className="font-semibold text-text-primary dark:text-text-primary">{stats.sectionsCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary dark:text-text-secondary">Total Items:</span>
                          <span className="font-semibold text-text-primary dark:text-text-primary">{stats.itemsCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary dark:text-text-secondary">Completed:</span>
                          <span className="font-semibold text-primary dark:text-accent">
                            {stats.completedCount} / {stats.itemsCount}
                          </span>
                        </div>
                        {stats.itemsCount > 0 && (
                          <div className="mt-2">
                            <div className="w-full bg-bg-primary dark:bg-pickled-bluewood rounded-full h-2 border border-border-medium dark:border-border-light">
                              <div
                                className="bg-primary dark:bg-accent h-2 rounded-full transition-all"
                                style={{ width: `${Math.round((stats.completedCount / stats.itemsCount) * 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-text-muted dark:text-text-muted mt-1">
                              {Math.round((stats.completedCount / stats.itemsCount) * 100)}% Complete
                            </div>
                          </div>
                        )}
                        {stats.sections.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-primary/30 dark:border-primary/40">
                            <div className="text-xs font-semibold text-text-secondary dark:text-text-secondary mb-2">Criteria Types:</div>
                            <div className="flex flex-wrap gap-1">
                              {stats.sections.slice(0, 5).map((section) => (
                                <span
                                  key={section.id}
                                  className="px-2 py-1 bg-bg-secondary dark:bg-bg-secondary text-xs text-text-secondary dark:text-text-secondary rounded border border-primary/30 dark:border-primary/40"
                                >
                                  {section.title.replace(/[^\w\s]/g, '').substring(0, 20)}
                                </span>
                              ))}
                              {stats.sections.length > 5 && (
                                <span className="px-2 py-1 bg-bg-secondary dark:bg-bg-secondary text-xs text-text-muted dark:text-text-muted rounded border border-primary/30 dark:border-primary/40">
                                  +{stats.sections.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-text-muted dark:text-text-muted">No checklist criteria yet</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCurrent && (
                      <button
                        onClick={() => handleSwitch(project.id)}
                        className="flex-1 px-3 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors text-sm font-medium"
                      >
                        <StarOff className="w-4 h-4 inline mr-1" />
                        Switch
                      </button>
                    )}
                    {isCurrent && (
                      <Link
                        to={ROUTES.CHECKLIST}
                        className="flex-1 px-3 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors text-sm font-medium text-center"
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
                        className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors text-sm font-medium text-center border border-green-200 dark:border-green-800"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View Criteria
                      </Link>
                    )}
                    <button
                      onClick={() => handleStartEdit(project)}
                      className="px-3 py-2 bg-bg-primary dark:bg-pickled-bluewood hover:bg-border-light dark:hover:bg-pickled-bluewood/80 text-text-secondary dark:text-loblolly rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!project.is_default && (
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
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
        <div className="text-center py-12 bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md border border-border-light dark:border-border-medium transition-colors">
          <FolderOpen className="w-16 h-16 text-text-muted dark:text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary mb-2">No Projects Yet</h3>
          <p className="text-text-secondary dark:text-text-secondary mb-4">Create your first project to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};
