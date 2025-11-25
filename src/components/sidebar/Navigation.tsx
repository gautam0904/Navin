import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, Info, Home, FolderOpen } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useChecklist } from '../../features/checklist/hooks/useChecklist';
import React from 'react';

const navItems = [
  { path: ROUTES.HOME, label: 'Home', icon: Home },
  { path: ROUTES.CHECKLIST, label: 'Checklist', icon: ClipboardList },
  { path: ROUTES.PROJECTS, label: 'Projects', icon: FolderOpen },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { path: ROUTES.ABOUT, label: 'About', icon: Info },
];

interface NavigationProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

const Navigation = ({ collapsed = false, onNavigate }: NavigationProps) => {
  const location = useLocation();
  const { completedItems, totalItems } = useChecklist();

  type NavItem = (typeof navItems)[number];

  const renderIcon = (Icon: React.ComponentType<{ className?: string }>, isActive: boolean) => {
    const base = 'shrink-0 transition-all duration-200';
    const commonColor = isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary';
    const size = collapsed ? 'w-5 h-5' : 'w-4 h-4';
    return <Icon className={`${size} ${base} ${commonColor}`} />;
  };

  const renderLabel = (item: NavItem, isActive: boolean) => (
    <span
      className={`flex-1 text-sm transition-all duration-200 ${
        isActive ? 'font-semibold' : 'font-normal'
      }`}
    >
      {item.label}
    </span>
  );

  const renderChecklistBadge = (isActive: boolean) => (
    <span
      className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all duration-200 shrink-0 ${
        isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/15'
      }`}
    >
      {completedItems}/{totalItems}
    </span>
  );

  return (
    <nav className={`flex-1 ${collapsed ? 'py-2 px-2' : 'py-3 px-2'}`}>
      <div className={`${collapsed ? 'space-y-1' : 'space-y-0.5'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isChecklist = item.path === ROUTES.CHECKLIST && totalItems > 0;

          const activeClasses = isActive
            ? collapsed
              ? 'bg-primary/20 text-primary'
              : 'bg-primary/10 text-primary font-semibold'
            : 'text-text-primary hover:bg-bg-surface-3/50 hover:text-primary';

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center transition-all duration-200 rounded-lg ${
                collapsed ? 'justify-center py-3 px-2' : 'gap-3 px-3 py-2.5'
              } ${activeClasses}`}
            >
              {!collapsed && isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
              )}

              {renderIcon(Icon, isActive)}

              {!collapsed && (
                <>
                  {renderLabel(item, isActive)}
                  {isChecklist && renderChecklistBadge(isActive)}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
