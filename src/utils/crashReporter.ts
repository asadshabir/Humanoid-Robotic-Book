/**
 * Crash Reporting Configuration for Physical AI & Humanoid Robotics Book
 * Provides crash detection and reporting capabilities for enhanced stability
 */

interface CrashReport {
  timestamp: string;
  error: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  additionalInfo?: Record<string, any>;
}

class CrashReporter {
  private static instance: CrashReporter;
  private reports: CrashReport[] = [];
  private maxReports: number = 100;
  private reportingEnabled: boolean = true;

  // Singleton pattern
  public static getInstance(): CrashReporter {
    if (!CrashReporter.instance) {
      CrashReporter.instance = new CrashReporter();
    }
    return CrashReporter.instance;
  }

  private constructor() {
    this.initializeCrashReporting();
  }

  private initializeCrashReporting(): void {
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => this.handleGlobalError(event));
      window.addEventListener('unhandledrejection', (event) => this.handleUnhandledRejection(event));
    }
  }

  public enableReporting(): void {
    this.reportingEnabled = true;
  }

  public disableReporting(): void {
    this.reportingEnabled = false;
  }

  public isEnabled(): boolean {
    return this.reportingEnabled;
  }

  public async reportError(
    error: Error | string,
    additionalInfo?: Record<string, any>
  ): Promise<void> {
    if (!this.reportingEnabled) {
      return;
    }

    const report: CrashReport = {
      timestamp: new Date().toISOString(),
      error: typeof error === 'string' ? error : error.toString(),
      stack: typeof error !== 'string' ? error.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
      additionalInfo,
    };

    // Add component stack if available
    if (additionalInfo && additionalInfo.componentStack) {
      report.componentStack = additionalInfo.componentStack;
    }

    this.reports.push(report);

    // Keep only the last maxReports to prevent storage bloat
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports);
    }

    // Store in localStorage for later retrieval
    this.storeReports();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Crash Report');
      console.error('Error:', report.error);
      console.error('Stack:', report.stack);
      console.error('URL:', report.url);
      console.error('Timestamp:', report.timestamp);
      if (report.additionalInfo) {
        console.log('Additional Info:', report.additionalInfo);
      }
      console.groupEnd();
    }
  }

  public getReports(): CrashReport[] {
    return [...this.reports]; // Return a copy
  }

  public clearReports(): void {
    this.reports = [];
    this.storeReports();
  }

  public async sendReportsToServer(endpoint?: string): Promise<void> {
    if (!this.reportingEnabled || this.reports.length === 0) {
      return;
    }

    const reportsToSend = [...this.reports]; // Copy current reports
    const serverEndpoint = endpoint || '/api/crash-reports';

    try {
      // In a real application, you would send this to your server
      // For now, we'll just log it
      console.log('Sending crash reports to:', serverEndpoint, reportsToSend);

      // Clear reports after sending
      this.clearReports();
    } catch (sendError) {
      console.error('Failed to send crash reports:', sendError);
    }
  }

  private handleGlobalError(event: ErrorEvent): void {
    if (!this.reportingEnabled) {
      return;
    }

    const error = event.error || new Error(event.message);
    this.reportError(error, {
      type: 'global-error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    if (!this.reportingEnabled) {
      return;
    }

    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    this.reportError(error, {
      type: 'unhandled-promise-rejection',
    });
  }

  private storeReports(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('crashReports', JSON.stringify(this.reports));
      } catch (e) {
        console.error('Failed to store crash reports in localStorage:', e);
      }
    }
  }

  public loadStoredReports(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('crashReports');
        if (stored) {
          const reports = JSON.parse(stored);
          if (Array.isArray(reports)) {
            this.reports = reports;
          }
        }
      } catch (e) {
        console.error('Failed to load crash reports from localStorage:', e);
      }
    }
  }
}

// Initialize crash reporter and load any stored reports
const crashReporter = CrashReporter.getInstance();
crashReporter.loadStoredReports();

export { crashReporter, CrashReport };