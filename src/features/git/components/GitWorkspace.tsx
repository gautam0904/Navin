import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGit } from '@/contexts/GitContext';
import { ChangesPanel } from './ChangesPanel';
import { CommitComposer } from './CommitComposer';
import { RecentCommits } from './RecentCommits';
import { MonacoDiffEditor } from './MonacoDiffEditor';
import { RepositoryPicker } from './RepositoryPicker';
import { GripVertical } from 'lucide-react';
import type { Toast } from './Toast';

interface GitWorkspaceProps {
  onToast?: (toast: Toast) => void;
}

// Custom hook to handle resizable panel logic
function useResizablePanel(
  storageKey: string,
  defaultWidth: number,
  minWidth: number,
  maxWidth: number
) {
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : defaultWidth;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, String(width));
  }, [width, storageKey]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      setWidth(Math.min(Math.max(minWidth, e.clientX), maxWidth));
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, minWidth, maxWidth]);

  return { width, isResizing, handleMouseDown };
}

export function GitWorkspace({ onToast }: GitWorkspaceProps) {
  const { repository, status } = useGit();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const {
    width: leftPanelWidth,
    isResizing,
    handleMouseDown,
  } = useResizablePanel('git-workspace-left-width', 380, 280, 600);

  const selectedFileInfo = useMemo(() => {
    if (!selectedFile) return null;
    return [
      ...(status?.staged || []),
      ...(status?.unstaged || []),
      ...(status?.untracked || []),
    ].find((f) => f.path === selectedFile);
  }, [selectedFile, status]);

  const isStaged = useMemo(
    () => status?.staged?.some((f) => f.path === selectedFile) ?? false,
    [status, selectedFile]
  );

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex h-full bg-[--git-panel-bg] overflow-hidden">
      {/* Left Panel: Changes */}
      <div
        className="flex flex-col shrink-0 border-r border-[--git-panel-border] bg-[--git-panel-bg]"
        style={{ width: leftPanelWidth }}
      >
        {/* Commit Composer */}
        <div className="shrink-0 border-b border-[--git-panel-border]">
          <CommitComposer onToast={onToast} />
        </div>

        {/* Changes Panel */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChangesPanel selectedFile={selectedFile} onFileSelect={setSelectedFile} />
        </div>

        {/* Recent Commits */}
        <div className="shrink-0">
          <RecentCommits />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`
          relative w-1 cursor-col-resize group
          ${isResizing ? 'bg-[--color-primary]' : 'bg-transparent hover:bg-[--color-primary]/30'}
          transition-colors duration-150
        `}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-4 h-12 flex items-center justify-center rounded
            ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            transition-opacity duration-150
          `}
        >
          <GripVertical className="w-3 h-3 text-[--color-text-tertiary]" />
        </div>
      </div>

      {/* Right Panel: Monaco Diff Editor */}
      <div className="flex-1 min-w-0 flex flex-col bg-[--git-panel-bg]">
        <MonacoDiffEditor
          filePath={selectedFile}
          fileStatus={selectedFileInfo?.status}
          isStaged={isStaged}
        />
      </div>
    </div>
  );
}
