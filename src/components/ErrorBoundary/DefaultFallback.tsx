import React from 'react';

interface DefaultFallbackProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error, errorInfo }) => {
  return (
    <div className="error-fallback-container">
      <div className="error-fallback-content">
        <h1 className="error-fallback-title">🤖 Something went wrong</h1>
        <p className="error-fallback-message">
          We've encountered an issue with the Physical AI & Humanoid Robotics Book platform.
        </p>
        <div className="error-fallback-actions">
          <button
            className="error-fallback-retry-button"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          <a
            className="error-fallback-home-button"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
          >
            Return to Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-fallback-details">
            <summary>Technical Details</summary>
            <div className="error-fallback-stack">
              <h4>Error:</h4>
              <pre>{error.toString()}</pre>
              <h4>Stack Trace:</h4>
              <pre>{error.stack}</pre>
              {errorInfo?.componentStack && (
                <>
                  <h4>Component Stack:</h4>
                  <pre>{errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default DefaultFallback;