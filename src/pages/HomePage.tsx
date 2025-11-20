import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, TrendingUp, Settings, ArrowRight, FolderOpen, ChevronDown, ChevronRight, CheckCircle2, Database, Shield, FolderTree } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useChecklist } from '../hooks/useChecklist';
import { useProject } from '../contexts/ProjectContext';

interface Feature {
  id: string;
  icon: typeof ClipboardList;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'checklist',
    icon: ClipboardList,
    title: 'Comprehensive Checklist',
    description: 'Covering branch naming, API handling, code quality, testing, and more. Each section includes detailed items to ensure best practices are followed.'
  },
  {
    id: 'storage',
    icon: Database,
    title: 'Persistent Storage',
    description: 'Your progress is saved locally using SQLite database. All checklist states and project data persist across app restarts.'
  },
  {
    id: 'admin',
    icon: Shield,
    title: 'Admin Mode',
    description: 'Edit and customize checklist items to fit your workflow. Add new sections, modify existing items, and save changes to your codebase.'
  },
  {
    id: 'projects',
    icon: FolderTree,
    title: 'Project-Based',
    description: 'Each project has its own checklist criteria and progress tracking. Switch between projects seamlessly while maintaining separate progress.'
  }
];

export const HomePage = () => {
  const { totalItems, completedItems, progressPercent } = useChecklist();
  const { currentProject } = useProject();
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  const toggleFeature = (id: string) => {
    setExpandedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary tracking-tight leading-tight">
          Welcome to Navin
        </h1>
        <p className="text-base text-text-secondary dark:text-text-secondary leading-relaxed max-w-2xl">
          Your comprehensive developer checklist to maintain code quality and follow best practices
        </p>
        {currentProject && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-primary/10 rounded border border-primary/20 dark:border-primary/30 text-sm">
            <FolderOpen className="w-4 h-4 text-primary dark:text-accent" />
            <span className="font-medium text-primary dark:text-accent">
              <span className="text-text-secondary dark:text-text-secondary">Project:</span> {currentProject.name}
            </span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary dark:text-primary" />
            <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary">
              Your Progress
            </h2>
          </div>
          <Link
            to={ROUTES.CHECKLIST}
            className="button-primary text-sm"
          >
            View Checklist
            <ArrowRight className="w-4 h-4 inline-block ml-1.5" />
          </Link>
        </div>

        {totalItems > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary dark:text-text-secondary font-medium">
                Completed Items
              </span>
              <span className="font-semibold text-text-primary dark:text-text-primary">
                {completedItems} / {totalItems}
              </span>
            </div>
            <div className="progress-container relative" style={{ height: '1rem' }}>
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              {progressPercent > 15 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-md z-10">
                    {progressPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-text-tertiary dark:text-text-tertiary mb-3" />
            <p className="text-sm text-text-secondary dark:text-text-secondary">
              No checklist items yet. <Link to={ROUTES.PROJECTS} className="text-primary dark:text-primary hover:underline font-medium">Create a project</Link> to get started.
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border-light dark:border-border-medium"></div>

      {/* Features Section */}
      <div className="card" style={{ padding: 0 }}>
        <div className="px-4 py-3 border-b border-border-light dark:border-border-medium">
          <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary">
            Features
          </h2>
        </div>
        <div className="divide-y divide-border-light dark:divide-border-medium">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isExpanded = expandedFeatures[feature.id];

            return (
              <div key={feature.id} className="group">
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-primary/5 dark:hover:bg-accent/5 active:bg-primary/10 dark:active:bg-accent/10 transition-colors text-left"
                  title={isExpanded ? "Collapse" : "Expand for details"}
                >
                  <div className="flex items-center gap-2 shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-tertiary dark:text-text-tertiary transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-tertiary dark:text-text-tertiary transition-transform group-hover:translate-x-0.5" />
                    )}
                    <Icon className={`w-5 h-5 text-primary dark:text-accent transition-transform ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}`} />
                  </div>
                  <span className="flex-1 font-medium text-text-primary dark:text-text-primary">
                    {feature.title}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pl-12 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-text-secondary dark:text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

