import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useLoading } from './LoadingProvider';

interface LoadingOverlayProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingOverlay({ children, fallback }: LoadingOverlayProps) {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        {fallback || (
          <>
            <LoadingSpinner size="lg" />
            {loadingMessage && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {loadingMessage}
              </p>
            )}
          </>
        )}
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}