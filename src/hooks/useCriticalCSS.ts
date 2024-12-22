import { useEffect, useState } from 'react';
import { criticalCSSExtractor } from '../utils/performance/critical-css/extractor';
import { criticalCSSInjector } from '../utils/performance/critical-css/injector';
import { CriticalCSSResult } from '../utils/performance/critical-css/types';

export function useCriticalCSS() {
  const [criticalCSS, setCriticalCSS] = useState<CriticalCSSResult | null>(null);

  useEffect(() => {
    const extractAndInject = async () => {
      try {
        const result = await criticalCSSExtractor.extract(document.documentElement.outerHTML);
        criticalCSSInjector.inject(result);
        setCriticalCSS(result);
      } catch (error) {
        console.error('Error extracting critical CSS:', error);
      }
    };

    extractAndInject();
  }, []);

  return criticalCSS;
}