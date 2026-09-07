import React, { useState } from 'react';

// Skeleton Component
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`} />
);

// Graceful Error Boundary Wrapper
export const withErrorHandling = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackName: string
) => {
  return (props: P) => {
    const [hasError, setHasError] = useState(false);
    
    if (hasError) {
      return (
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center">
          <p className="text-sm text-red-500 font-medium">Failed to load {fallbackName}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      );
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      setHasError(true);
      return null;
    }
  };
};
