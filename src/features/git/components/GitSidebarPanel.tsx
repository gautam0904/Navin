import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, GitCommit, FolderGit2, History, Package, Shield } from 'lucide-react';
import { ChangesPanel } from './ChangesPanel';
import { BranchPanel } from './BranchPanel';
import { CommitHistory } from './CommitHistory';
import { StashPanel } from './StashPanel';
import { RemotePanel } from './RemotePanel';
import { useGit } from '@/contexts/GitContext';

type GitTab = 'changes' | 'branches' | 'history' | 'stash' | 'remotes' | 'quality';

interface TabButtonProps {
  tab: GitTab;
  activeTab: GitTab;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  highlight?: boolean;
  onClick: () => void;
}

function TabButton({ tab, activeTab, icon, label, badge, highlight, onClick }: TabButtonProps) {
  const isActive = tab === activeTab;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all
        border-b-2 whitespace-nowrap relative
        ${
          isActive
            ? 'border-[--color-primary] text-[--color-primary]'
            : 'border-transparent text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-surface-2]'
        }
      `}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`
          ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full
          ${
            isActive
              ? 'bg-[--color-primary] text-white'
              : 'bg-[--color-bg-surface-3] text-[--color-text-secondary]'
          }
        `}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {highlight && !isActive && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-[--color-primary] rounded-full animate-pulse" />
      )}
    </button>
  );
}

// Helper component to reduce complexity
const TabNavigation: React.FC<{
  activeTab: GitTab;
  changesCount: number;
  onTabChange: (tab: GitTab) => void;
}> = ({ activeTab, changesCount, onTabChange }) => {
  const tabs: Array<{
    id: GitTab;
    icon: React.ReactNode;
    label: string;
    badge?: number;
    highlight?: boolean;
  }> = [
    {
      id: 'changes',
      icon: <GitCommit className="w-3.5 h-3.5" />,
      label: 'Changes',
      badge: changesCount,
    },
    { id: 'history', icon: <History className="w-3.5 h-3.5" />, label: 'History' },
    { id: 'branches', icon: <GitBranch className="w-3.5 h-3.5" />, label: 'Branches' },
    { id: 'stash', icon: <Package className="w-3.5 h-3.5" />, label: 'Stash' },
    { id: 'remotes', icon: <FolderGit2 className="w-3.5 h-3.5" />, label: 'Remotes' },
    { id: 'quality', icon: <Shield className="w-3.5 h-3.5" />, label: 'Quality', highlight: true },
  ];

  return (
    <div className="flex border-b border-[--git-panel-border] overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab.id}
          activeTab={activeTab}
          icon={tab.icon}
          label={tab.label}
          badge={tab.badge}
          highlight={tab.highlight}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};

const TabContent: React.FC<{ activeTab: GitTab; onSelectCommit: (sha: string) => void }> = ({
  activeTab,
  onSelectCommit,
}) => {
  switch (activeTab) {
    case 'changes':
      return <ChangesPanel />;
    case 'branches':
      return <BranchPanel />;
    case 'history':
      return (
        <div className="h-full">
          <CommitHistory onSelectCommit={onSelectCommit} />
        </div>
      );
    case 'stash':
      return <StashPanel />;
    case 'remotes':
      return <RemotePanel />;
    default:
      return null;
  }
};

export function GitSidebarPanel() {
  const [activeTab, setActiveTab] = useState<GitTab>('changes');
  const { status, repository, setActiveView } = useGit();
  const navigate = useNavigate();

  const changesCount = status
    ? (status.staged?.length || 0) +
      (status.unstaged?.length || 0) +
      (status.untracked?.length || 0)
    : 0;

  const handleSelectCommit = (sha: string) => {
    console.log('Selected commit:', sha);
  };

  if (!repository) {
    return (
      <div className="empty-state h-full">
        <div className="empty-state-icon">
          <FolderGit2 className="w-10 h-10" />
        </div>
        <h3 className="empty-state-title">No repository open</h3>
        <p className="empty-state-description">
          Open a folder with a git repository to see changes
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[--git-panel-bg]">
      <TabNavigation
        activeTab={activeTab}
        changesCount={changesCount}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveView(tab);
          navigate('/git');
        }}
      />
      <div className="flex-1 overflow-hidden min-h-0">
        <TabContent activeTab={activeTab} onSelectCommit={handleSelectCommit} />
      </div>
    </div>
  );
}
