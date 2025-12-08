import React, { useState } from 'react';
import { useFileExplorer, FileEntry } from '../../contexts/FileExplorerContext';
import { useGit } from '../../contexts/GitContext';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getIconPath } from '../../utils/iconResolver';

const getGitStatus = (path: string, status: ReturnType<typeof useGit>['status']) => {
  if (!status) return null;

  const allFiles = [
    ...(status.staged || []),
    ...(status.unstaged || []),
    ...(status.untracked || []),
  ];
  const file = allFiles.find((f) => f.path === path);
  if (!file) return null;

  const statusType = file.status;
  if ('Modified' in statusType) return { type: 'M', color: '#f59e0b' };
  if ('Added' in statusType) return { type: 'A', color: '#10b981' };
  if ('Deleted' in statusType) return { type: 'D', color: '#ef4444' };
  if ('Untracked' in statusType) return { type: 'U', color: '#6b7280' };
  return null;
};

const FileTreeNode: React.FC<{ entry: FileEntry; depth: number }> = ({ entry, depth }) => {
  const { expandFolder } = useFileExplorer();
  const { status } = useGit();
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (entry.is_dir) {
      if (!isExpanded && !entry.children) {
        setIsLoading(true);
        await expandFolder(entry.path);
        setIsLoading(false);
      }
      setIsExpanded(!isExpanded);
    }
  };

  const iconPath = getIconPath(entry, isExpanded);
  const gitStatus = !entry.is_dir ? getGitStatus(entry.path, status) : null;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-primary/10 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleToggle}
      >
        <span className="mr-1 shrink-0">
          {entry.is_dir ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-4 h-4 block" />
          )}
        </span>
        <span className="mr-2 shrink-0 flex items-center">
          <img
            src={iconPath}
            alt={entry.name}
            className="w-4 h-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = entry.is_dir ? '/icons/folder.svg' : '/icons/file.svg';
            }}
          />
        </span>
        <span className="truncate flex-1">{entry.name}</span>
        {gitStatus && (
          <span
            className="ml-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{
              backgroundColor: `${gitStatus.color}20`,
              color: gitStatus.color,
              border: `1px solid ${gitStatus.color}40`,
            }}
            title={`${gitStatus.type === 'M' ? 'Modified' : gitStatus.type === 'A' ? 'Added' : gitStatus.type === 'D' ? 'Deleted' : 'Untracked'}`}
          >
            {gitStatus.type}
          </span>
        )}
      </div>
      {isExpanded && entry.children && (
        <div>
          {entry.children.map((child) => (
            <FileTreeNode key={child.path} entry={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExplorerWithGitBadges: React.FC = () => {
  const { fileTree, currentPath } = useFileExplorer();

  if (!currentPath) {
    return <div className="p-4 text-center text-text-muted text-sm">No folder opened.</div>;
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
        Explorer
      </div>
      <div
        className="px-2 py-1 text-xs font-semibold text-primary mb-2 truncate"
        title={currentPath}
      >
        {currentPath.split(/[\\/]/).pop()}
      </div>
      <div>
        {fileTree.map((entry) => (
          <FileTreeNode key={entry.path} entry={entry} depth={0} />
        ))}
      </div>
    </div>
  );
};
