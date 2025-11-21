import Navigation from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";
import { FolderOpen } from "lucide-react";
import { useProject } from "../contexts/ProjectContext";
import { useChecklist } from "../pages/checkList/hooks/useChecklist";
import { useAppContext } from "../contexts/AppContext";

interface SidebarProps {
  width: number;
}

export default function Sidebar({ width }: SidebarProps) {
  const collapsed = width < 200; // auto-collapse threshold

  const { currentProject } = useProject();
  const { completedItems, totalItems } = useChecklist();
  const { isAdminMode } = useAppContext();

  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <aside className="h-full flex flex-col">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-border bg-bg-secondary dark:bg-bg-secondary`}>
        {!collapsed ? (
          <>
            <h1 className="text-xl font-bold text-primary mb-2">Navin</h1>

            {currentProject && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <FolderOpen className="w-4 h-4" />
                  <span className="font-medium truncate">{currentProject.name}</span>
                </div>

                {totalItems > 0 && (
                  <div className="px-2 py-1.5 bg-bg-surface-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-secondary">
                        {completedItems}/{totalItems}
                      </span>
                      <span className="text-xs font-medium text-primary">{progressPercent}%</span>
                    </div>
                  </div>
                )}

                {isAdminMode && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-md">
                    Admin Mode
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-10">
            <div className="text-primary font-bold text-lg">N</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto">
        <Navigation collapsed={collapsed} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-bg-secondary dark:bg-bg-secondary">
        <div className={`${collapsed ? "justify-center" : "justify-between items-center"} flex`}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
