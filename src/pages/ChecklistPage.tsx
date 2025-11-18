import { ChecklistContent } from '../components/ChecklistContent';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useChecklist } from '../hooks/useChecklist';

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

