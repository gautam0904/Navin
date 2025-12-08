import { invoke } from '@tauri-apps/api/core';
import type { FileStatusType } from '@/types/git';

// Helper interface for hunk line
export interface HunkLine {
  content?: string;
  origin: string;
}

// Helper interface for hunk
export interface Hunk {
  lines: HunkLine[];
}

// Convert FileStatusType to display string
export function getStatusString(status?: FileStatusType): string | undefined {
  if (!status || typeof status !== 'object') return undefined;
  if ('Added' in status) return 'added';
  if ('Modified' in status) return 'modified';
  if ('Deleted' in status) return 'deleted';
  if ('Renamed' in status) return 'renamed';
  if ('Copied' in status) return 'copied';
  if ('Untracked' in status) return 'untracked';
  if ('Conflicted' in status) return 'conflicted';
  return undefined;
}

// Map file extensions to Monaco languages
export function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    css: 'css',
    scss: 'scss',
    html: 'html',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    toml: 'ini',
    env: 'ini',
    gitignore: 'ini',
  };
  return languageMap[ext] || 'plaintext';
}

// Process diff hunks and extract original/modified content
export function processHunks(hunks: Hunk[]): {
  original: string;
  modified: string;
  additions: number;
  deletions: number;
} {
  let original = '';
  let modified = '';
  let additions = 0;
  let deletions = 0;

  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      const content = line.content || '';
      if (line.origin === 'Context') {
        original += content + '\n';
        modified += content + '\n';
      } else if (line.origin === 'Addition') {
        modified += content + '\n';
        additions++;
      } else if (line.origin === 'Deletion') {
        original += content + '\n';
        deletions++;
      }
    }
  }

  return { original, modified, additions, deletions };
}

// Read file content as fallback when no diff hunks available
export async function readFallbackContent(
  repoPath: string | undefined,
  filePath: string
): Promise<string> {
  try {
    const fullPath = `${repoPath}/${filePath}`;
    const fileContent = await invoke<string>('read_file_content', { path: fullPath });
    return fileContent;
  } catch (readErr) {
    console.warn('[MonacoDiffEditor] Could not read file content:', readErr);
    return '// Could not read file content';
  }
}
