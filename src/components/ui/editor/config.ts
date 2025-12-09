import type { editor } from 'monaco-editor';

export const commonEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
  lineNumbers: 'on',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  padding: { top: 10, bottom: 10 },
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  theme: 'vs-dark',
};

export const commonDiffEditorOptions: editor.IDiffEditorConstructionOptions = {
  ...commonEditorOptions,
  enableSplitViewResizing: true,
  renderSideBySide: true,
  readOnly: false,
  originalEditable: true,
  diffWordWrap: 'off',
  renderOverviewRuler: false,
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
};
