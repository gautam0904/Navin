import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary dark:bg-bg-primary p-4">
          <div className="max-w-md w-full bg-bg-secondary dark:bg-bg-secondary rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary">
              Something went wrong
            </h2>
            <p className="text-text-secondary dark:text-text-secondary">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-sm text-text-tertiary dark:text-text-tertiary">
                <summary className="cursor-pointer hover:text-text-secondary">
                  Error details
                </summary>
                <pre className="mt-2 p-2 bg-bg-primary dark:bg-bg-primary rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button onClick={() => window.location.reload()} className="button-primary w-full">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
