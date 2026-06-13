'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  /** Content to render when there is no error. */
  children: ReactNode;
  /**
   * Optional custom fallback. Receives the caught error so the UI can display
   * a contextual message. When omitted, a generic recovery prompt is shown.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Class-based error boundary that catches unhandled render errors in its subtree
 * and displays a graceful fallback instead of a blank screen.
 *
 * React requires error boundaries to be class components (hooks cannot catch
 * render errors). This is the only class component in the codebase.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <MyUnstableWidget />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console in development; swap for a real error reporter in production.
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);

      return (
        <div
          role="alert"
          className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center"
        >
          <p className="font-semibold text-red-700">Something went wrong</p>
          <p className="mt-1 text-sm text-red-600">
            An unexpected error occurred. Your data is safe — try refreshing the page.
          </p>
          <button
            onClick={this.reset}
            className="mt-4 rounded-2xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}
