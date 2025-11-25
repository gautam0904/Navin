import Navigation from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";
import { FolderOpen } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import { useChecklist } from "../../pages/checkList/hooks/useChecklist";
import { useAppContext } from "../../contexts/AppContext";

interface SidebarProps {
  width: number;
}

export default function Sidebar({ width }: SidebarProps) {
  const collapsed = width < 220; // auto-collapse threshold - increased to prevent truncation
  const fullyCollapsed = width <= 80; // fully collapsed (icon-only mode)

  const { currentProject } = useProject();
  const { completedItems, totalItems } = useChecklist();
  const { isAdminMode } = useAppContext();

  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <aside className="h-full flex flex-col overflow-y-auto overflow-x-hidden bg-bg-secondary dark:bg-bg-secondary w-full">
      {/* Header */}
      <div className={`border-b border-border/40 ${
        fullyCollapsed ? 'px-2 py-3' : 'px-3 py-3'
      }`}>
        {fullyCollapsed ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-base">N</span>
            </div>
          </div>
        ) : !collapsed ? (
          <>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-text-primary mb-1.5">
                Navin
              </h1>
              <p className="text-xs text-text-secondary font-medium">
                Developer Checklist
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface-2/50 rounded-md border border-border/40 hover:border-border/60 transition-colors">
                <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-text-primary flex-1 min-w-0 break-words">
                  {currentProject ? currentProject.name : "Default Project"}
                </span>
              </div>

              {totalItems > 0 && (
                <div className="px-3 py-2.5 bg-primary/5 dark:bg-primary/10 rounded-md border border-primary/20 dark:border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-primary">{progressPercent}%</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-bold text-text-primary">
                      {completedItems}
                    </span>
                    <span className="text-sm text-text-tertiary font-medium">of</span>
                    <span className="text-lg font-bold text-text-primary">
                      {totalItems}
                    </span>
                    <span className="text-sm text-text-secondary ml-1">tasks</span>
                  </div>
                  <div className="h-2 bg-bg-surface-2 dark:bg-bg-surface-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {isAdminMode && (
                <div className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-md flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-primary">
                    Admin Mode
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-sm">N</span>
            </div>
          </div>
        )}
      </div>

      <Navigation collapsed={fullyCollapsed || collapsed} />
        
      <div className={`mt-auto border-t border-border/40 ${
        fullyCollapsed ? 'p-2' : 'p-3'
      }`}>
        <ThemeToggle collapsed={fullyCollapsed || collapsed} />
      </div>
    </aside>
  );
}
