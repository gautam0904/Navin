import { useState, useEffect } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { useProject } from '../../../app/providers/ProjectProvider';
import { LoadingState } from '@components/ui/LoadingState';
import { ErrorState } from '@components/ui/ErrorState';
import { ProjectService } from '@services/project.service';
import { ChecklistSection } from '../../../types/checklist';
import { ProjectCard } from '../components/ProjectCard';

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

  const handleStartEdit = (project: (typeof projects)[0]) => {
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
    } catch {
      // Error already shown in context
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProject(projectId);
    } catch {
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
    } catch {
      // Error already shown in context
    }
  };

  const handleSwitch = async (projectId: string) => {
    if (currentProject?.id === projectId) return;

    if (confirm('Switch to this project? Your current progress will be saved.')) {
      try {
        await switchProject(projectId);
      } catch {
        // Error already shown in context
      }
    }
  };

  // Load checklist stats for each project
  useEffect(() => {
    const loadProjectStats = async () => {
      for (const project of projects) {
        try {
          setLoadingStats((prev) => ({ ...prev, [project.id]: true }));
          const checklist = await ProjectService.getProjectChecklist(project.id);

          // Get completed items count
          const { ProgressService } = await import('@services');
          const checkedItems = await ProgressService.getCheckedItems(project.id);

          const totalItems = checklist.reduce((sum, section) => sum + section.items.length, 0);
          const completedItems = checkedItems.length;

          setProjectStats((prev) => ({
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
          setLoadingStats((prev) => ({ ...prev, [project.id]: false }));
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
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-accent shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary">
              Projects
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary ml-7 sm:ml-9">
            Each project has its own checklist criteria. Switch between projects to see different
            checklists.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-text-inverse dark:text-text-inverse rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-sm sm:text-base">New Project</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md p-6 border border-border-light dark:border-border-medium transition-colors">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary mb-4">
            Create New Project
          </h2>
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
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isCurrent={currentProject?.id === project.id}
            isEditing={editingId === project.id}
            editName={editName}
            editDescription={editDescription}
            stats={projectStats[project.id]}
            isLoadingStats={loadingStats[project.id]}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onEditNameChange={setEditName}
            onEditDescriptionChange={setEditDescription}
            onSwitch={handleSwitch}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {projects.length === 0 && !showCreateForm && (
        <div className="text-center py-12 bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-md border border-border-light dark:border-border-medium transition-colors">
          <FolderOpen className="w-16 h-16 text-text-muted dark:text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary mb-2">
            No Projects Yet
          </h3>
          <p className="text-text-secondary dark:text-text-secondary mb-4">
            Create your first project to get started
          </p>
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
