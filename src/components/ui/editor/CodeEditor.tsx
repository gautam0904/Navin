import React, { useRef } from 'react';
import Editor, { OnMount, EditorProps } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Loader2 } from 'lucide-react';
import { commonEditorOptions } from './config';

export interface CodeEditorProps extends EditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  className,
  options,
  onMount,
  theme = 'vs-dark',
  loading,
  ...props
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const mergedOptions = {
    ...commonEditorOptions,
    ...options,
  };

  const defaultLoading = (
    <div className="flex items-center justify-center h-full w-full bg-[#1e1e1e]">
      <Loader2 className="w-6 h-6 text-white animate-spin" />
    </div>
  );

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-md border border-[#333] ${className || ''}`}
    >
      <Editor
        theme={theme}
        onMount={handleEditorDidMount}
        options={mergedOptions}
        loading={loading || defaultLoading}
        {...props}
      />
    </div>
  );
};
