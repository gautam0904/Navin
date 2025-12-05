import { DiffHunk, FileDiff, DiffLine } from '../types/diff';

interface DiffState {
  path: string;
  oldPath: string | undefined;
  status: FileDiff['status'];
  hunks: DiffHunk[];
  currentHunk: DiffHunk | null;
  additions: number;
  deletions: number;
}

function parseHunkHeader(line: string): DiffHunk | null {
  const match = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
  if (!match) return null;

  return {
    header: line,
    lines: [],
    oldStart: parseInt(match[1]),
    oldCount: parseInt(match[2] || '1'),
    newStart: parseInt(match[3]),
    newCount: parseInt(match[4] || '1'),
  };
}

function processLine(
  line: string,
  currentHunk: DiffHunk
): { lineObj: DiffLine; isAddition: boolean; isDeletion: boolean } | null {
  if (line.startsWith('+') && !line.startsWith('+++')) {
    const newLineNumber =
      currentHunk.newStart + currentHunk.lines.filter((l) => l.type !== 'del').length;
    return {
      lineObj: {
        type: 'add',
        content: line.slice(1),
        newLineNumber,
      },
      isAddition: true,
      isDeletion: false,
    };
  }

  if (line.startsWith('-') && !line.startsWith('---')) {
    const oldLineNumber =
      currentHunk.oldStart + currentHunk.lines.filter((l) => l.type !== 'add').length;
    return {
      lineObj: {
        type: 'del',
        content: line.slice(1),
        oldLineNumber,
      },
      isAddition: false,
      isDeletion: true,
    };
  }

  if (line.startsWith(' ') || line === '') {
    const contextLines = currentHunk.lines.filter((l) => l.type !== 'del');
    const oldContextLines = currentHunk.lines.filter((l) => l.type !== 'add');
    return {
      lineObj: {
        type: 'context',
        content: line.slice(1) || '',
        oldLineNumber: currentHunk.oldStart + oldContextLines.length,
        newLineNumber: currentHunk.newStart + contextLines.length,
      },
      isAddition: false,
      isDeletion: false,
    };
  }

  return null;
}

function parseGitHeader(line: string) {
  const match = line.match(/diff --git a\/(.*) b\/(.*)/);
  if (!match) return null;

  return {
    path: match[2],
    oldPath: match[1] !== match[2] ? match[1] : undefined,
    status: match[1] !== match[2] ? ('renamed' as const) : undefined,
  };
}

function processMetadataLine(
  line: string,
  currentPath: string,
  currentOldPath: string | undefined,
  currentStatus: FileDiff['status']
): { path: string; oldPath: string | undefined; status: FileDiff['status']; handled: boolean } {
  if (line.startsWith('diff --git')) {
    const header = parseGitHeader(line);
    if (header) {
      return {
        path: header.path,
        oldPath: header.oldPath,
        status: header.status ?? currentStatus,
        handled: true,
      };
    }
  }
  if (line.startsWith('new file')) {
    return {
      path: currentPath,
      oldPath: currentOldPath,
      status: 'added',
      handled: true,
    };
  }
  if (line.startsWith('deleted file')) {
    return {
      path: currentPath,
      oldPath: currentOldPath,
      status: 'deleted',
      handled: true,
    };
  }
  return {
    path: currentPath,
    oldPath: currentOldPath,
    status: currentStatus,
    handled: false,
  };
}

function updateStateWithMetadata(line: string, state: DiffState): boolean {
  const meta = processMetadataLine(line, state.path, state.oldPath, state.status);
  if (meta.handled) {
    state.path = meta.path;
    state.oldPath = meta.oldPath;
    state.status = meta.status;
    return true;
  }
  return false;
}

function updateStateWithHunk(line: string, state: DiffState): boolean {
  if (line.startsWith('@@')) {
    const hunk = parseHunkHeader(line);
    if (hunk) {
      state.currentHunk = hunk;
      state.hunks.push(state.currentHunk);
    }
    return true;
  }
  return false;
}

function updateStateWithContent(line: string, state: DiffState): void {
  if (state.currentHunk) {
    const processed = processLine(line, state.currentHunk);
    if (processed) {
      state.currentHunk.lines.push(processed.lineObj);
      state.additions += Number(processed.isAddition);
      state.deletions += Number(processed.isDeletion);
    }
  }
}

export function parseDiffOutput(diffText: string): FileDiff | null {
  if (!diffText) return null;

  const state: DiffState = {
    path: '',
    oldPath: undefined,
    status: 'modified',
    hunks: [],
    currentHunk: null,
    additions: 0,
    deletions: 0,
  };

  const lines = diffText.split('\n');
  for (const line of lines) {
    if (updateStateWithMetadata(line, state)) continue;
    if (updateStateWithHunk(line, state)) continue;
    updateStateWithContent(line, state);
  }

  return {
    path: state.path,
    oldPath: state.oldPath,
    status: state.status,
    hunks: state.hunks,
    additions: state.additions,
    deletions: state.deletions,
  };
}
