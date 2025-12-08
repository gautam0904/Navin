import { useState, useEffect } from 'react';
import { DiffEditor, loader } from '@monaco-editor/react';

import { GitService } from '@/services/gitService';
import { useGit } from '@/contexts/GitContext';
import { EditorToolbar } from './EditorToolbar';
import { FileCode, Loader2 } from 'lucide-react';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import type { FileStatusType } from '@/types/git';

// Configure Monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
  },
});

interface MonacoDiffEditorProps {
  filePath: string | null;
  fileStatus?: FileStatusType;
  isStaged?: boolean;
}
import {
  getStatusString,
  getLanguageFromPath,
  processHunks,
  readFallbackContent,
} from '../utils/diffEditorUtils';

function EmptyState() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-6 p-5 bg-[--color-bg-surface-2] rounded-xl inline-block">
          <FileCode className="w-14 h-14 text-[--color-text-tertiary] opacity-40" />
        </div>
        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-3">
          Select a file to view changes
        </h3>
        <p className="text-sm text-[--color-text-secondary] leading-relaxed mb-8">
          Click any file from the changes list to see its diff in a side-by-side comparison
        </p>
        <div className="border-t border-[--git-panel-border] pt-6">
          <KeyboardShortcuts />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full bg-[--git-panel-bg]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[--color-primary] animate-spin" />
        <span className="text-sm text-[--color-text-secondary]">Loading diff...</span>
      </div>
    </div>
  );
}

export function MonacoDiffEditor({
  filePath,
  fileStatus,
  isStaged = false,
}: MonacoDiffEditorProps) {
  const { repository } = useGit();
  const [originalContent, setOriginalContent] = useState<string>('');
  const [modifiedContent, setModifiedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [additions, setAdditions] = useState(0);
  const [deletions, setDeletions] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setOriginalContent('');
      setModifiedContent('');
      setAdditions(0);
      setDeletions(0);
      return;
    }

    // eslint-disable-next-line complexity
    const loadDiff = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if file is untracked (new file)
        const statusStr = getStatusString(fileStatus);
        const isUntracked = statusStr === 'untracked' || statusStr === 'added';

        console.log(
          '[MonacoDiffEditor] Loading diff for:',
          filePath,
          'isStaged:',
          isStaged,
          'status:',
          statusStr
        );

        // For untracked files, we can't get a diff since there's no previous version
        if (isUntracked && !isStaged) {
          console.log('[MonacoDiffEditor] Untracked file - cannot show diff');
          setOriginalContent('');
          setModifiedContent('(New file - no previous version to compare)');
          setAdditions(0);
          setDeletions(0);
          setIsLoading(false);
          return;
        }

        // Get diff from git service
        const diff = isStaged
          ? await GitService.getFileDiffStaged(filePath)
          : await GitService.getFileDiffUnstaged(filePath);

        console.log('[MonacoDiffEditor] Received diff:', diff);

        // Extract original and modified content from hunks
        let adds = 0;
        let dels = 0;

        if (diff && diff.hunks && diff.hunks.length > 0) {
          const result = processHunks(diff.hunks);
          setOriginalContent(result.original.trimEnd());
          setModifiedContent(result.modified.trimEnd());
          adds = result.additions;
          dels = result.deletions;
        } else {
          const content = await readFallbackContent(repository?.path, filePath);
          setOriginalContent('');
          setModifiedContent(content);
        }

        setAdditions(diff?.additions || adds);
        setDeletions(diff?.deletions || dels);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        // Handle specific error cases - show new file message or error
        if (errMsg.includes('not found') || errMsg.includes('Untracked')) {
          setOriginalContent('');
          setModifiedContent('(New file - no previous version to compare)');
          setError(null);
        } else {
          setError(`Failed to load diff`);
          setOriginalContent('');
          setModifiedContent('');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDiff();
  }, [filePath, isStaged, fileStatus, repository?.path]);

  if (!filePath) {
    return <EmptyState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[--color-error]">{error}</p>
      </div>
    );
  }

  const language = getLanguageFromPath(filePath);
  const fileName = filePath.split('/').pop() || filePath;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <EditorToolbar
        fileName={fileName}
        filePath={filePath}
        fileStatus={getStatusString(fileStatus)}
        additions={additions}
        deletions={deletions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Monaco Diff Editor */}
      <div className="flex-1 min-h-0">
        <DiffEditor
          original={originalContent}
          modified={modifiedContent}
          language={language}
          theme="vs-dark"
          options={{
            readOnly: true,
            renderSideBySide: viewMode === 'split',
            enableSplitViewResizing: true,
            renderIndicators: true,
            originalEditable: false,
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'off',
            diffWordWrap: 'off',
            renderOverviewRuler: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          loading={<LoadingState />}
        />
      </div>
    </div>
  );
}
