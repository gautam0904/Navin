import { useState, useEffect } from 'react';
// import { loader } from '@monaco-editor/react'; // Removed loader config

import { useGit } from '@/contexts/GitContext';
import { EditorToolbar } from './EditorToolbar';
import { FileCode, Loader2 } from 'lucide-react';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import type { FileStatusType } from '@/types/git';

// Configure Monaco loader - Removed to fix loading issue (use default local)
/*
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
  },
});
*/

interface MonacoDiffEditorProps {
  filePath: string | null;
  fileStatus?: FileStatusType;
  isStaged?: boolean;
}
import { getStatusString, getLanguageFromPath } from '../utils/diffEditorUtils';
import { loadFileDiff } from './MonacoDiffEditorHelpers';
import { DiffEditor } from '@monaco-editor/react';

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

  // Reset state when filePath becomes null - using cleanup pattern
  useEffect(() => {
    if (!filePath) {
      const timeoutId = setTimeout(() => {
        setOriginalContent('');
        setModifiedContent('');
        setAdditions(0);
        setDeletions(0);
        setError(null);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [filePath]);

  useEffect(() => {
    if (!filePath) {
      return;
    }

    loadFileDiff(
      filePath,
      fileStatus,
      isStaged,
      repository?.path,
      setOriginalContent,
      setModifiedContent,
      setAdditions,
      setDeletions,
      setError,
      setIsLoading
    );
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
            // enderSideBySide: viewMode === 'split',
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
