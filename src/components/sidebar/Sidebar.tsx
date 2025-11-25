import Navigation from './Navigation';
import { ThemeToggle } from './ThemeToggle';
// import { useChecklist } from '@pages/checkList/hooks/useChecklist';

interface SidebarProps {
  width: number;
}

export default function Sidebar({ width }: SidebarProps) {
  const collapsed = width < 200;
  const fullyCollapsed = width <= 80;

  // const { completedItems, totalItems } = useChecklist();

  return (
    <aside className="h-full flex flex-col overflow-y-auto overflow-x-hidden bg-bg-secondary dark:bg-bg-secondary w-full">
      {/* Header */}
      <div className={`border-b border-border/40 ${fullyCollapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
        {fullyCollapsed ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-base">N</span>
            </div>
          </div>
        ) : !collapsed ? (
          <>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-text-primary mb-1.5">Navin</h1>
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

      <div className={`mt-auto border-t border-border/40 ${fullyCollapsed ? 'p-2' : 'p-3'}`}>
        <ThemeToggle collapsed={fullyCollapsed || collapsed} />
      </div>
    </aside>
  );
}
