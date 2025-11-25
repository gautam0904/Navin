interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p className="text-red-800 font-semibold mb-2">Error loading data</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

