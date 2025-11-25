import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, Info, Home, FolderOpen } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import { useChecklist } from '@/features/checklist/hooks/useChecklist';

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

interface NavItemProps {
  item: (typeof navItems)[0];
  isActive: boolean;
  collapsed: boolean;
  completedItems: number;
  totalItems: number;
  onNavigate?: () => void;
}

const NavItem = ({
  item,
  isActive,
  collapsed,
  completedItems,
  totalItems,
  onNavigate,
}: NavItemProps) => {
  const Icon = item.icon;
  const isChecklist = item.path === ROUTES.CHECKLIST && totalItems > 0;

  const getLinkClassName = () => {
    const baseClasses = 'group relative flex items-center transition-all duration-200 rounded-lg';
    const sizeClasses = collapsed ? 'justify-center py-3 px-2' : 'gap-3 px-3 py-2.5';
    if (isActive) {
      const activeClasses = collapsed
        ? 'bg-primary/20 text-primary'
        : 'bg-primary/10 text-primary font-semibold';
      return `${baseClasses} ${sizeClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${sizeClasses} text-text-primary hover:bg-bg-surface-3/50 hover:text-primary`;
  };

  const getIconClassName = () => {
    const size = collapsed ? 'w-5 h-5' : 'w-4 h-4';
    const color = isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary';
    return `${size} shrink-0 transition-all duration-200 ${color}`;
  };

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={getLinkClassName()}
    >
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
      )}
      <Icon className={getIconClassName()} />
      {!collapsed && (
        <>
          <span
            className={`flex-1 transition-all duration-200 text-sm ${isActive ? 'font-semibold' : 'font-normal'}`}
          >
            {item.label}
          </span>
          {isChecklist && (
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary group-hover:bg-primary/15'
              }`}
            >
              {completedItems}/{totalItems}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

const Navigation = ({ collapsed = false, onNavigate }: NavigationProps) => {
  const location = useLocation();
  const { completedItems, totalItems } = useChecklist();

  return (
    <nav className={`flex-1 ${collapsed ? 'py-2 px-2' : 'py-3 px-2'}`}>
      <div className={`${collapsed ? 'space-y-1' : 'space-y-0.5'}`}>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            collapsed={collapsed}
            completedItems={completedItems}
            totalItems={totalItems}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
