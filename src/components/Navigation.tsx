import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, Info, Home, FolderOpen } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAppContext } from '../contexts/AppContext';
import { useProject } from '../contexts/ProjectContext';

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

  return (
    <nav className="bg-white border-b border-gray-300 shadow-sm flex-shrink-0">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">Navin</h1>
            {currentProject && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {currentProject.name}
              </span>
            )}
            {isAdminMode && (
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                Admin
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm
                    ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-medium border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
