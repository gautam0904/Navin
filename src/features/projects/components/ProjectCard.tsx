import React from 'react';
import {
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  StarOff,
  ClipboardList,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { ChecklistSection } from '../../../types/checklist';

interface ProjectStats {
  projectId: string;
  sectionsCount: number;
  itemsCount: number;
  completedCount: number;
  sections: ChecklistSection[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
}

interface ProjectCardProps {
  project: Project;
  isCurrent: boolean;
  isEditing: boolean;
  editName: string;
  editDescription: string;
  stats: ProjectStats | undefined;
  isLoadingStats: boolean;
  onStartEdit: (project: Project) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditNameChange: (name: string) => void;
  onEditDescriptionChange: (description: string) => void;
  onSwitch: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

const ProjectEditingForm: React.FC<{
  editName: string;
  editDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ editName, editDescription, onNameChange, onDescriptionChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-border-medium dark:border-border-light rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 px-3 py-2 bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark text-white dark:text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
        >
          <Check className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 text-text-secondary dark:text-text-secondary rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const ChecklistStats: React.FC<{ stats: ProjectStats | undefined; isLoading: boolean }> = ({
  stats,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="text-sm text-text-muted dark:text-text-muted">Loading...</div>;
  }

  if (!stats) {
    return (
      <div className="text-sm text-text-muted dark:text-text-muted">No checklist criteria yet</div>
    );
  }

  const progressPercent =
    stats.itemsCount > 0 ? Math.round((stats.completedCount / stats.itemsCount) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary dark:text-text-secondary">Criteria Sections:</span>
        <span className="font-semibold text-text-primary dark:text-text-primary">
          {stats.sectionsCount}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary dark:text-text-secondary">Total Items:</span>
        <span className="font-semibold text-text-primary dark:text-text-primary">
          {stats.itemsCount}
        </span>
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
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-text-muted dark:text-text-muted mt-1">
            {progressPercent}% Complete
          </div>
        </div>
      )}
      {stats.sections.length > 0 && (
        <div className="mt-3 pt-3 border-t border-primary/30 dark:border-primary/40">
          <div className="text-xs font-semibold text-text-secondary dark:text-text-secondary mb-2">
            Criteria Types:
          </div>
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
  );
};

const ProjectActions: React.FC<{
  project: Project;
  isCurrent: boolean;
  onSwitch: (projectId: string) => void;
  onEdit: () => void;
  onDelete: (projectId: string) => void;
}> = ({ project, isCurrent, onSwitch, onEdit, onDelete }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {!isCurrent && (
        <button
          onClick={() => onSwitch(project.id)}
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
          onClick={() => onSwitch(project.id)}
          className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors text-sm font-medium text-center border border-green-200 dark:border-green-800"
        >
          <Eye className="w-4 h-4 inline mr-1" />
          View Criteria
        </Link>
      )}
      <button
        onClick={onEdit}
        className="px-3 py-2 bg-bg-primary dark:bg-pickled-bluewood hover:bg-border-light dark:hover:bg-pickled-bluewood/80 text-text-secondary dark:text-loblolly rounded-lg transition-colors"
        title="Edit Project"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      {!project.is_default && (
        <button
          onClick={() => onDelete(project.id)}
          className="px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isCurrent,
  isEditing,
  editName,
  editDescription,
  stats,
  isLoadingStats,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onEditDescriptionChange,
  onSwitch,
  onDelete,
}) => {
  return (
    <div
      className={`bg-bg-secondary dark:bg-bg-secondary rounded-xl shadow-sm p-6 border transition-all ${
        isCurrent
          ? 'border-primary dark:border-accent ring-2 ring-primary/20 dark:ring-accent/20 shadow-md'
          : 'border-border-light dark:border-border-medium hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <ProjectEditingForm
          editName={editName}
          editDescription={editDescription}
          onNameChange={onEditNameChange}
          onDescriptionChange={onEditDescriptionChange}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary">
                  {project.name}
                </h3>
                {isCurrent && (
                  <Star className="w-5 h-5 text-primary dark:text-accent fill-primary dark:fill-accent" />
                )}
              </div>
              {project.description && (
                <p className="text-sm text-text-secondary dark:text-text-secondary mb-3">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-primary dark:text-accent" />
              <h4 className="font-semibold text-text-primary dark:text-text-primary">
                Checklist Criteria
              </h4>
            </div>
            <ChecklistStats stats={stats} isLoading={isLoadingStats} />
          </div>

          <ProjectActions
            project={project}
            isCurrent={isCurrent}
            onSwitch={onSwitch}
            onEdit={() => onStartEdit(project)}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  );
};
