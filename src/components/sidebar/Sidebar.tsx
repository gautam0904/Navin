import { useState } from 'react';
import Navigation from './Navigation';
import { ThemeToggle } from './ThemeToggle';
import { useFileExplorer } from '../../contexts/FileExplorerContext';
import { Explorer } from './Explorer';
import { Issues } from './Issues';
import { GitPanel } from '../../features/git/GitPanel';

interface SidebarProps {
  width: number;
}

type SidebarTab = 'explorer' | 'git' | 'issues' | 'menu';

function SidebarHeader({
  collapsed,
  fullyCollapsed,
}: {
  collapsed: boolean;
  fullyCollapsed: boolean;
}) {
  if (fullyCollapsed) {
    return (
      <div className="border-b border-border/40 px-2 py-3">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-base">N</span>
          </div>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="border-b border-border/40 px-3 py-3">
        <div className="flex items-center justify-center h-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-sm">N</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border/40 px-3 py-3">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text-primary mb-1.5">Navin</h1>
      </div>
    </div>
  );
}

function SidebarTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}) {
  const tabs: SidebarTab[] = ['explorer', 'git', 'issues', 'menu'];
  const tabLabels = { explorer: 'Explorer', git: 'Git', issues: 'Issues', menu: 'Menu' };

  return (
    <div className="flex border-b border-border/40">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {tabLabels[tab]}
        </button>
      ))}
    </div>
  );
}

function SidebarContent({
  activeTab,
  collapsed,
  fullyCollapsed,
}: {
  activeTab: SidebarTab;
  collapsed: boolean;
  fullyCollapsed: boolean;
}) {
  if (activeTab === 'explorer') return <Explorer />;
  if (activeTab === 'git') return <GitPanel />;
  if (activeTab === 'issues') return <Issues />;
  if (activeTab === 'menu') return <Navigation collapsed={fullyCollapsed || collapsed} />;
  return null;
}

export default function Sidebar({ width }: SidebarProps) {
  const collapsed = width < 200;
  const fullyCollapsed = width <= 80;
  const { currentPath } = useFileExplorer();
  const [activeTab, setActiveTab] = useState<SidebarTab>('explorer');

  if (!currentPath) {
    return (
      <aside className="h-full flex flex-col overflow-y-auto overflow-x-hidden bg-bg-secondary dark:bg-bg-secondary w-full">
        <SidebarHeader collapsed={collapsed} fullyCollapsed={fullyCollapsed} />
        <Navigation collapsed={fullyCollapsed || collapsed} />
        <div className={`mt-auto border-t border-border/40 ${fullyCollapsed ? 'p-2' : 'p-3'}`}>
          <ThemeToggle collapsed={fullyCollapsed || collapsed} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full flex flex-col overflow-hidden bg-bg-secondary dark:bg-bg-secondary w-full">
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        <SidebarContent
          activeTab={activeTab}
          collapsed={collapsed}
          fullyCollapsed={fullyCollapsed}
        />
      </div>
      <div className={`mt-auto border-t border-border/40 ${fullyCollapsed ? 'p-2' : 'p-3'}`}>
        <ThemeToggle collapsed={fullyCollapsed || collapsed} />
      </div>
    </aside>
  );
}
