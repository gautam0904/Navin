import React from 'react';
import { CodeEditor as CommonCodeEditor } from '@/components/ui/editor/CodeEditor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  height = '400px',
  readOnly = false,
}) => {
  return (
    <CommonCodeEditor
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      options={{
        readOnly,
      }}
    />
  );
};
