import { ChecklistContent } from './components/ChecklistContent';
import { LoadingState } from '@components/ui/LoadingState';
import { ErrorState } from '@components/ui/ErrorState';
import { useChecklist } from './hooks/useChecklist';

export const ChecklistPage = () => {
  const { isLoading, error } = useChecklist();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return <ChecklistContent />;
};

