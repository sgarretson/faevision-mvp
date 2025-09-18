/**
 * Client-Side Error Handler
 *
 * Comprehensive error monitoring and handling for FAEVision MVP.
 * Handles browser extension conflicts, message port errors, and runtime exceptions.
 *
 * **JORDAN LEE (CURSOR EXPERT)** + **ALEX THOMPSON (LEAD DEVELOPER)**
 * Executive-grade client-side stability
 */

export interface ErrorEvent {
  type: 'javascript' | 'promise' | 'resource' | 'network';
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

class ClientErrorHandler {
  private errors: ErrorEvent[] = [];
  private maxErrors = 50; // Prevent memory leaks
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    this.initializeErrorHandlers();
  }

  private initializeErrorHandlers() {
    // Global JavaScript error handler
    window.addEventListener('error', this.handleGlobalError.bind(this));

    // Unhandled promise rejection handler
    window.addEventListener(
      'unhandledrejection',
      this.handleUnhandledRejection.bind(this)
    );

    // Handle browser extension message port errors
    this.setupMessagePortErrorHandler();
  }

  private handleGlobalError(event: globalThis.ErrorEvent) {
    const errorEvent: ErrorEvent = {
      type: 'javascript',
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logError(errorEvent);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const errorEvent: ErrorEvent = {
      type: 'promise',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      error: event.reason,
      stack: event.reason?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logError(errorEvent);

    // Prevent the default browser error handling
    event.preventDefault();
  }

  private setupMessagePortErrorHandler() {
    // Override console.error to catch message port errors
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      const message = args.join(' ');

      // Check for message port errors
      if (
        message.includes('message port closed') ||
        message.includes('runtime.lastError')
      ) {
        this.handleMessagePortError(message);

        // In production, suppress these noisy extension errors
        if (this.isProduction) {
          return; // Don't log to console in production
        }
      }

      // Call original console.error for other errors
      originalConsoleError.apply(console, args);
    };
  }

  private handleMessagePortError(message: string) {
    const errorEvent: ErrorEvent = {
      type: 'javascript',
      message: `Browser Extension Conflict: ${message}`,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log but don't display to user (extension conflicts are not our fault)
    this.logError(errorEvent, false);
  }

  private logError(errorEvent: ErrorEvent, displayToUser = true) {
    // Add to internal log
    this.errors.push(errorEvent);

    // Prevent memory leaks
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Development logging
    if (!this.isProduction) {
      console.group('🔍 FAEVision Client Error');
      console.error('Error Event:', errorEvent);
      console.error('Stack Trace:', errorEvent.stack);
      console.groupEnd();
    }

    // Production monitoring (could integrate with Sentry, LogRocket, etc.)
    if (this.isProduction) {
      this.sendToMonitoring(errorEvent);
    }

    // Show user-friendly error notification for critical errors
    if (displayToUser && this.shouldNotifyUser(errorEvent)) {
      this.showUserNotification(errorEvent);
    }
  }

  private shouldNotifyUser(errorEvent: ErrorEvent): boolean {
    // Don't notify for browser extension conflicts
    if (errorEvent.message.includes('Browser Extension Conflict')) {
      return false;
    }

    // Don't notify for network errors (handled by UI)
    if (errorEvent.type === 'network') {
      return false;
    }

    return true;
  }

  private showUserNotification(errorEvent: ErrorEvent) {
    // Create non-intrusive error notification
    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-sm';
    notification.innerHTML = `
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">An error occurred</p>
          <p class="text-xs mt-1">Our team has been notified. Please refresh if the issue persists.</p>
        </div>
        <div class="ml-auto pl-3">
          <button class="text-red-400 hover:text-red-600" onclick="this.parentElement.parentElement.parentElement.remove()">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  private sendToMonitoring(errorEvent: ErrorEvent) {
    // In a real production app, this would send to Sentry, LogRocket, etc.
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorEvent,
          sessionId: this.getSessionId(),
          buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
        }),
      }).catch(() => {
        // Silently fail - don't create error loops
      });
    } catch {
      // Silently fail - don't create error loops
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('faevision-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('faevision-session-id', sessionId);
    }
    return sessionId;
  }

  // Public methods for manual error reporting
  public reportError(error: Error, context?: string) {
    const errorEvent: ErrorEvent = {
      type: 'javascript',
      message: `Manual Report: ${error.message}`,
      error,
      stack: error.stack,
      source: context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logError(errorEvent);
  }

  public getErrorLog(): ErrorEvent[] {
    return [...this.errors]; // Return copy to prevent mutation
  }

  public clearErrorLog() {
    this.errors = [];
  }
}

// Global error handler instance
export const clientErrorHandler = new ClientErrorHandler();

// Export for React components
export const useErrorReporting = () => {
  return {
    reportError: clientErrorHandler.reportError.bind(clientErrorHandler),
    getErrors: clientErrorHandler.getErrorLog.bind(clientErrorHandler),
    clearErrors: clientErrorHandler.clearErrorLog.bind(clientErrorHandler),
  };
};
