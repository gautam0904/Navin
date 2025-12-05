export interface DiffLine {
  type: 'add' | 'del' | 'context' | 'hunk';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
}

export interface FileDiff {
  path: string;
  oldPath?: string; // For renames
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

// Quality hint types for inline annotations
export interface QualityHint {
  lineNumber: number;
  type: 'warning' | 'suggestion' | 'error' | 'info';
  rule: string;
  message: string;
  autoFixable?: boolean;
  suggestedFix?: string;
}
