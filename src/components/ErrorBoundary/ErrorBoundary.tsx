import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; errorInfo?: ErrorInfo }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to crash reporting service
    this.logErrorToService(error, errorInfo);

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo): void => {
    // In a real application, you would send this to a crash reporting service
    console.group('Crash Detection Report');
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);
    console.error('Timestamp:', new Date().toISOString());
    console.error('User Agent:', typeof window !== 'undefined' ? navigator.userAgent : 'N/A');
    console.error('URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
    console.groupEnd();

    // Store error for potential reporting
    if (typeof window !== 'undefined') {
      const errors = JSON.parse(localStorage.getItem('crashReports') || '[]');
      errors.push({
        timestamp: new Date().toISOString(),
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      // Keep only the last 100 errors to prevent storage bloat
      if (errors.length > 100) {
        errors.splice(0, errors.length - 100);
      }

      localStorage.setItem('crashReports', JSON.stringify(errors));
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback component if provided, otherwise use default
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} errorInfo={this.state.errorInfo} />;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-container">
          <h2 className="error-boundary-title">Something went wrong</h2>
          <div className="error-boundary-message">
            <p>We've detected an issue and reported it to our team.</p>
            <button
              className="error-boundary-retry-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="error-boundary-details">
              <summary>Error details</summary>
              <pre>{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;