import React, { useState } from 'react';
import { Search, GitBranch, ChevronDown, FolderGit2, User } from 'lucide-react';
import { useGit } from '../contexts/GitContext';
import { BranchSwitchModal } from '../features/git/components/BranchSwitchModal';

interface GitAppHeaderProps {
  currentFilePath?: string | null;
  onSearch?: (query: string) => void;
}

export function GitAppHeader({ currentFilePath, onSearch }: GitAppHeaderProps) {
  const { repository, branches } = useGit();
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentBranch = branches?.find((b) => b.is_head);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getBreadcrumbs = () => {
    if (!currentFilePath) return [];
    const parts = currentFilePath.split('/').filter(Boolean);
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <div className="h-10 flex items-center justify-between px-4 border-b border-[--git-panel-border] bg-[--git-panel-header]">
        {/* Left: Repository name and branch */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <FolderGit2 className="w-4 h-4 text-[--color-primary] shrink-0" />
            <span className="text-sm font-semibold text-[--color-text-primary] truncate">
              {repository?.name || 'No Repository'}
            </span>
          </div>
          {currentBranch && (
            <button
              onClick={() => setShowBranchModal(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[--color-bg-surface-2] hover:bg-[--color-bg-surface-3] border border-[--git-panel-border] transition-colors group"
            >
              <GitBranch className="w-3.5 h-3.5 text-[--git-branch-current] group-hover:text-[--color-primary] transition-colors" />
              <span className="text-xs font-medium text-[--color-text-primary]">
                {currentBranch.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[--color-text-tertiary] group-hover:text-[--color-text-primary] transition-colors" />
            </button>
          )}
        </div>

        {/* Center: Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 flex-1 justify-center min-w-0">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <span className="text-[--color-text-tertiary] text-xs">/</span>}
                <button
                  className="text-xs text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors truncate max-w-[120px]"
                  title={crumb.path}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Right: Search and user */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--color-text-tertiary]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            />
          </div>
          <div className="w-6 h-6 rounded-full bg-[--color-primary] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {showBranchModal && (
        <BranchSwitchModal isOpen={showBranchModal} onClose={() => setShowBranchModal(false)} />
      )}
    </>
  );
}
