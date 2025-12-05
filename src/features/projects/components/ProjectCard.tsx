import React from 'react';
import { Edit2, Trash2, Star, StarOff, ClipboardList, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { ChecklistSection } from '../../../types/checklist';
import { ProjectEditingForm } from './ProjectCardForm';
import { ChecklistStats } from './ProjectCardStats';

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
  description?: string | null;
  created_at: string;
  updated_at: string;
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
          className="flex-1 px-3 py-2 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-accent rounded-lg transition-colors text-sm font-medium text-center border border-primary/30 dark:border-primary/40"
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
      className={`bg-bg-secondary dark:bg-bg-secondary rounded-xl shadow-sm p-6 border transition-all ${isCurrent ? 'border-primary dark:border-accent ring-2 ring-primary/20 dark:ring-accent/20 shadow-md' : 'border-border-light dark:border-border-medium hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-md'}`}
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
