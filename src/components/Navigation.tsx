import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardList, Settings, Info, Home, FolderOpen } from "lucide-react";
import { ROUTES } from "../constants/routes";
import { useChecklist } from "../pages/checkList/hooks/useChecklist";

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: Home },
  { path: ROUTES.CHECKLIST, label: "Checklist", icon: ClipboardList },
  { path: ROUTES.PROJECTS, label: "Projects", icon: FolderOpen },
  { path: ROUTES.SETTINGS, label: "Settings", icon: Settings },
  { path: ROUTES.ABOUT, label: "About", icon: Info },
];

interface NavigationProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

const Navigation = ({ collapsed = false, onNavigate }: NavigationProps) => {
  const location = useLocation();
  const { completedItems, totalItems } = useChecklist();

  return (
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
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 transition-all duration-150 rounded-lg
                ${collapsed ? "justify-center py-3 px-0" : "px-3 py-2.5"}
                ${isActive ? "bg-primary/20 text-primary font-semibold ring-1 ring-primary/30" : "text-text-primary hover:bg-bg-surface-3"}
              `}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-text-secondary group-hover:text-primary"}`} />
              {!collapsed && <span className={`flex-1 ${isActive ? "font-semibold" : ""}`}>{item.label}</span>}
              {!collapsed && isChecklist && (
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${isActive ? "bg-white/25 text-white" : "bg-primary/10 text-primary"}`}>
                  {completedItems}/{totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
