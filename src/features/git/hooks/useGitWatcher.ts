import { useEffect, useRef, useCallback } from 'react';
import { RepositoryInfo } from '@/types/git';

interface UseGitWatcherProps {
  repository: RepositoryInfo | null;
  onRefresh: () => Promise<void>;
  interval?: number;
  enabled?: boolean;
}

export function useGitWatcher({
  repository,
  onRefresh,
  interval = 3000,
  enabled = true,
}: UseGitWatcherProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRefreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current || !repository || !enabled) return;

    isRefreshingRef.current = true;
    try {
      await onRefresh();
    } catch (error) {
      console.error('[GitWatcher] Refresh failed:', error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [repository, enabled, onRefresh]);

  useEffect(() => {
    if (!repository || !enabled) {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Initial refresh
    refresh();

    // Setup polling
    timeoutRef.current = setInterval(refresh, interval);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [repository, enabled, interval, refresh]);
}
