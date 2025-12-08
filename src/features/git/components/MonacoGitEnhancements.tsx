import { useEffect, useRef } from 'react';
import type { editor } from 'monaco-editor';
import { useGit } from '@/contexts/GitContext';

interface MonacoGitEnhancementsProps {
  editor: editor.IStandaloneCodeEditor | null;
  filePath: string | null;
}

export function useMonacoGitEnhancements({ editor, filePath }: MonacoGitEnhancementsProps) {
  const { status } = useGit();
  const gutterDecorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!editor || !filePath || !status) return;

    // Add gutter decorations for uncommitted changes
    const fileStatus = [...(status.staged || []), ...(status.unstaged || []), ...(status.untracked || [])].find(
      (f) => f.path === filePath
    );

    if (!fileStatus) {
      editor.deltaDecorations(gutterDecorationsRef.current, []);
      gutterDecorationsRef.current = [];
      return;
    }

    const statusType = fileStatus.status;
    let color = '#6b7280';

    if ('Modified' in statusType) color = '#f59e0b';
    else if ('Added' in statusType) color = '#10b981';
    else if ('Deleted' in statusType) color = '#ef4444';
    else if ('Untracked' in statusType) color = '#6b7280';

    // Add decoration for the entire file
    const decorations: editor.IModelDeltaDecoration[] = [{
      range: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      },
      options: {
        glyphMarginClassName: 'git-change-indicator',
        glyphMarginHoverMessage: { value: 'Uncommitted changes' },
        minimap: {
          color: color,
          position: 1,
        },
      },
    }];

    gutterDecorationsRef.current = editor.deltaDecorations(gutterDecorationsRef.current, decorations);

    return () => {
      editor.deltaDecorations(gutterDecorationsRef.current, []);
    };
  }, [editor, filePath, status]);
}

