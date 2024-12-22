import React, { useEffect } from 'react';
import { analytics } from '../../utils/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  siteId: string;
  debug?: boolean;
}

export function AnalyticsProvider({ 
  children, 
  siteId,
  debug = false 
}: AnalyticsProviderProps) {
  useEffect(() => {
    analytics.initialize({
      enabled: true,
      siteId,
      debug
    });
  }, [siteId, debug]);

  return <>{children}</>;
}