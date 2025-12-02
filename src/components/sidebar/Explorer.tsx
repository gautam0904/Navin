import React, { useState } from 'react';
import { useFileExplorer, FileEntry } from '../../contexts/FileExplorerContext';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getIconPath } from '../../utils/iconResolver';

const FileTreeNode: React.FC<{ entry: FileEntry; depth: number }> = ({ entry, depth }) => {
  const { expandFolder } = useFileExplorer();
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
        <span className="truncate">{entry.name}</span>
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

export const Explorer: React.FC = () => {
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
