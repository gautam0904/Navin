import { GitService } from '@/services/gitService';
import { processHunks, readFallbackContent, getStatusString } from '../utils/diffEditorUtils';

export function handleUntrackedFile(
  setOriginalContent: (content: string) => void,
  setModifiedContent: (content: string) => void,
  setAdditions: (count: number) => void,
  setDeletions: (count: number) => void,
  setIsLoading: (loading: boolean) => void
) {
  setOriginalContent('');
  setModifiedContent('(New file - no previous version to compare)');
  setAdditions(0);
  setDeletions(0);
  setIsLoading(false);
}

function hasValidHunks(diff: unknown): diff is { hunks: unknown[] } {
  return (
    diff !== null &&
    typeof diff === 'object' &&
    'hunks' in diff &&
    Array.isArray(diff.hunks) &&
    diff.hunks.length > 0
  );
}

function extractDiffStats(diff: unknown, adds: number, dels: number) {
  if (diff && typeof diff === 'object') {
    const additions =
      'additions' in diff && typeof diff.additions === 'number' ? diff.additions : adds;
    const deletions =
      'deletions' in diff && typeof diff.deletions === 'number' ? diff.deletions : dels;
    return { additions, deletions };
  }
  return { additions: adds, deletions: dels };
}

export async function processDiffResult(
  diff: unknown,
  filePath: string,
  repoPath: string | undefined,
  setOriginalContent: (content: string) => void,
  setModifiedContent: (content: string) => void,
  setAdditions: (count: number) => void,
  setDeletions: (count: number) => void
) {
  let adds = 0;
  let dels = 0;

  if (hasValidHunks(diff)) {
    const result = processHunks(diff.hunks);
    setOriginalContent(result.original.trimEnd());
    setModifiedContent(result.modified.trimEnd());
    adds = result.additions;
    dels = result.deletions;
  } else {
    const content = await readFallbackContent(repoPath, filePath);
    setOriginalContent('');
    setModifiedContent(content);
  }

  const stats = extractDiffStats(diff, adds, dels);
  setAdditions(stats.additions);
  setDeletions(stats.deletions);
}

export function handleDiffError(
  err: unknown,
  setOriginalContent: (content: string) => void,
  setModifiedContent: (content: string) => void,
  setError: (error: string | null) => void
) {
  const errMsg = err instanceof Error ? err.message : String(err);
  if (errMsg.includes('not found') || errMsg.includes('Untracked')) {
    setOriginalContent('');
    setModifiedContent('(New file - no previous version to compare)');
    setError(null);
  } else {
    setError('Failed to load diff');
    setOriginalContent('');
    setModifiedContent('');
  }
}

export async function loadFileDiff(
  filePath: string,
  fileStatus: unknown,
  isStaged: boolean,
  repoPath: string | undefined,
  setOriginalContent: (content: string) => void,
  setModifiedContent: (content: string) => void,
  setAdditions: (count: number) => void,
  setDeletions: (count: number) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) {
  setIsLoading(true);
  setError(null);

  try {
    const statusStr = getStatusString(fileStatus) || 'clean';
    const isUntracked = statusStr === 'untracked' || statusStr === 'added';

    if (isUntracked && !isStaged) {
      handleUntrackedFile(
        setOriginalContent,
        setModifiedContent,
        setAdditions,
        setDeletions,
        setIsLoading
      );
      return;
    }

    const diff = isStaged
      ? await GitService.getFileDiffStaged(filePath)
      : await GitService.getFileDiffUnstaged(filePath);

    await processDiffResult(
      diff,
      filePath,
      repoPath,
      setOriginalContent,
      setModifiedContent,
      setAdditions,
      setDeletions
    );
  } catch (err: unknown) {
    handleDiffError(err, setOriginalContent, setModifiedContent, setError);
  } finally {
    setIsLoading(false);
  }
}
