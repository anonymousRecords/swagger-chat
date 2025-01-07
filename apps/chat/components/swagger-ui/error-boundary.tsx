import { Component, ErrorInfo, ReactNode, useCallback, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

// Error Boundary Component (required class component)
class ErrorBoundaryComponent extends Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Swagger UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div className="p-4">Failed to load Swagger UI. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

// Hook for easier usage in functional components
export const useErrorBoundary = () => {
  const [key, setKey] = useState(0);

  const reset = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  const ErrorBoundary = useCallback(({ children, fallback }: Props) => (
    <ErrorBoundaryComponent key={key} fallback={fallback}>
      {children}
    </ErrorBoundaryComponent>
  ), [key]);

  return { ErrorBoundary, reset };
};