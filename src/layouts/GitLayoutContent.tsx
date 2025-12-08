import { useState, useEffect } from 'react';
import { DiffViewer } from '../features/git/components/DiffViewer';
import {
  ChangesPanel,
  CommitHistory,
  BranchPanel,
  StashPanel,
  RemotePanel,
  CommitComposer,
} from '../features/git';
import { RecentCommits } from '../features/git/components/RecentCommits';
import { GitService } from '../services/gitService';
import { useGit } from '../contexts/GitContext';
import type { FileDiff } from '../features/git/types/diff';
import { type Toast } from '../features/git/components/Toast';

type GitView = 'changes' | 'history' | 'branches' | 'stash' | 'remotes';

interface MainContentProps {
  activeView: GitView;
  selectedFile: string | null;
  onFileSelect: (path: string | null) => void;
  onToast?: (toast: Toast) => void;
  isReviewMode?: boolean;
}

export function MainContent({
  activeView,
  selectedFile,
  onFileSelect,
  onToast,
  isReviewMode = false,
}: MainContentProps) {
  const [diff, setDiff] = useState<FileDiff | null>(null);
  const { status } = useGit();

  useEffect(() => {
    const loadDiff = async () => {
      if (!selectedFile) {
        setDiff(null);
        return;
      }

      try {
        const isStaged = status?.staged.some((f) => f.path === selectedFile) ?? false;
        const rawDiff = isStaged
          ? await GitService.getFileDiffStaged(selectedFile)
          : await GitService.getFileDiffUnstaged(selectedFile);

        const fileDiff: FileDiff = {
          path: selectedFile,
          oldPath: rawDiff.old_path || selectedFile,
          status: 'modified',
          hunks: (rawDiff.hunks || []).map((hunk) => ({
            header: hunk.header || '',
            lines: (hunk.lines || []).map((line) => {
              const origin = 'origin' in line ? line.origin : 'Context';
              const lineType =
                origin === 'Addition' ? 'add' : origin === 'Deletion' ? 'del' : 'context';
              return {
                type: lineType,
                content: 'content' in line ? String(line.content || '') : '',
                oldLineNumber:
                  'old_lineno' in line && typeof line.old_lineno === 'number'
                    ? line.old_lineno
                    : undefined,
                newLineNumber:
                  'new_lineno' in line && typeof line.new_lineno === 'number'
                    ? line.new_lineno
                    : undefined,
              };
            }),
            oldStart: hunk.old_start || 0,
            oldCount: hunk.old_lines || 0,
            newStart: hunk.new_start || 0,
            newCount: hunk.new_lines || 0,
          })),
          additions: rawDiff.additions || 0,
          deletions: rawDiff.deletions || 0,
        };
        setDiff(fileDiff);
      } catch (error) {
        console.error('Failed to load diff:', error);
        setDiff(null);
      }
    };

    loadDiff();
  }, [selectedFile, status]);

  const handleSelectCommit = (sha: string) => {
    console.log('Selected commit:', sha);
  };

  switch (activeView) {
    case 'changes':
      return (
        <div className="flex flex-1 min-h-0">
          <div
            className={`${isReviewMode ? 'w-[420px]' : 'w-80'} border-r border-[--git-panel-border] flex flex-col bg-[--git-panel-bg] transition-all`}
          >
            <div className="bg-[--git-panel-header] shrink-0">
              <CommitComposer onToast={onToast} />
            </div>
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ChangesPanel selectedFile={selectedFile} onFileSelect={onFileSelect} />
            </div>
            <div className="shrink-0">
              <RecentCommits />
            </div>
          </div>
          <div className="flex-1 min-w-0 bg-[--git-panel-bg] relative">
            <DiffViewer diff={diff} />
          </div>
        </div>
      );

    case 'history':
      return (
        <div className="flex flex-1 min-h-0">
          <div className="w-96 border-r border-[--git-panel-border]">
            <CommitHistory onSelectCommit={handleSelectCommit} />
          </div>
          <div className="flex-1 min-w-0">
            <DiffViewer diff={null} />
          </div>
        </div>
      );

    case 'branches':
      return <BranchPanel />;

    case 'stash':
      return <StashPanel />;

    case 'remotes':
      return <RemotePanel />;

    default:
      return null;
  }
}
