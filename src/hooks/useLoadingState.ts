import { useState, useCallback } from 'react';
import { useLoading } from '../components/ui/loading/LoadingProvider';

export function useLoadingState(initialState = false) {
  const [localLoading, setLocalLoading] = useState(initialState);
  const { setLoading, setLoadingMessage } = useLoading();

  const startLoading = useCallback((message?: string) => {
    setLocalLoading(true);
    setLoading(true);
    if (message) setLoadingMessage(message);
  }, [setLoading, setLoadingMessage]);

  const stopLoading = useCallback(() => {
    setLocalLoading(false);
    setLoading(false);
    setLoadingMessage(undefined);
  }, [setLoading, setLoadingMessage]);

  return {
    isLoading: localLoading,
    startLoading,
    stopLoading
  };
}