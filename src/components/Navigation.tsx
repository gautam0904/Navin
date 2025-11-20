import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, Info, Home, FolderOpen } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAppContext } from '../contexts/AppContext';
import { useProject } from '../contexts/ProjectContext';
import { useChecklist } from '../hooks/useChecklist';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { path: ROUTES.HOME, label: 'Home', icon: Home },
  { path: ROUTES.CHECKLIST, label: 'Checklist', icon: ClipboardList },
  { path: ROUTES.PROJECTS, label: 'Projects', icon: FolderOpen },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { path: ROUTES.ABOUT, label: 'About', icon: Info },
];

export const Navigation = () => {
  const location = useLocation();
  const { isAdminMode } = useAppContext();
  const { currentProject } = useProject();
  const { completedItems, totalItems } = useChecklist();
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <aside className="w-64 bg-bg-surface-2 dark:bg-bg-surface-2 border-r border-border-light dark:border-border-medium shrink-0 flex flex-col h-full shadow-sm">
      {/* App Header */}
      <div className="px-5 py-4 border-b border-border-light dark:border-border-medium bg-bg-secondary dark:bg-bg-secondary">
        <h1 className="text-lg font-bold text-primary dark:text-primary mb-3">Navin</h1>
        {currentProject && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-text-secondary">
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate">{currentProject.name}</span>
            </div>
            {totalItems > 0 && (
              <div className="px-2 py-1.5 bg-bg-surface-2 dark:bg-bg-surface-2 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-secondary dark:text-text-secondary">
                    {completedItems}/{totalItems}
                  </span>
                  <span className="text-xs font-medium text-primary dark:text-primary">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            )}
            {isAdminMode && (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-md">
                Admin Mode
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-3 px-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isChecklist = item.path === ROUTES.CHECKLIST && totalItems > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg relative
                  ${isActive
                    ? 'bg-primary dark:bg-primary text-white dark:text-white shadow-md font-semibold border-l-4 border-l-white/30 dark:border-l-white/30'
                    : 'text-text-primary dark:text-text-secondary hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 hover:text-primary dark:hover:text-primary border-l-4 border-l-transparent'
                  }
                `}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-all duration-150 ${isActive
                    ? 'text-white dark:text-white'
                    : 'text-text-secondary dark:text-text-secondary group-hover:text-primary dark:group-hover:text-primary group-hover:scale-110'
                    }`}
                />
                <span className={`flex-1 ${isActive ? 'text-white dark:text-white font-semibold' : 'text-text-primary dark:text-text-secondary'}`}>
                  {item.label}
                </span>
                {isChecklist && (
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold shrink-0 ${isActive
                    ? 'bg-white/25 dark:bg-white/25 text-white dark:text-white border border-white/30'
                    : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border border-primary/20 dark:border-primary/30'
                    }`}>
                    {completedItems}/{totalItems}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-border-light dark:border-border-medium">
        <ThemeToggle />
      </div>
    </aside>
  );
};
