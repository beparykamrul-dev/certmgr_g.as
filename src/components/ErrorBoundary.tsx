import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isProvider = this.props.fallbackName === 'Traffic Providers' || this.props.fallbackName === 'Traffic Map';
      return (
        <div className="p-6 h-full min-h-[200px] w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500 dark:text-red-400" size={24} />
          </div>
          <h3 className="text-red-800 dark:text-red-300 font-bold mb-2 tracking-tight">
            {isProvider ? 'Provider Offline' : `${this.props.fallbackName || 'Component'} Error`}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 max-w-xs mb-4">
            {isProvider 
              ? 'Failed to fetch provider status due to a timeout. The rest of the dashboard remains fully operational.' 
              : 'Failed to fetch or render this module. The rest of the dashboard remains fully operational.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 rounded-xl text-sm font-semibold transition-colors"
          >
            <RefreshCw size={14} /> Retry Fetch
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
