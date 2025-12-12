'use client';

import { Component, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Card className="coastal-shadow max-w-md border-0 p-8 text-center">
            <h2 className="elegant-serif text-foreground mb-4 text-2xl">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              We encountered an unexpected error. Please try again.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button onClick={this.handleRetry}>Try Again</Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
