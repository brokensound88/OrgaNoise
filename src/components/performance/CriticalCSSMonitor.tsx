import React from 'react';
import { useCriticalCSS } from '../../hooks/useCriticalCSS';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export function CriticalCSSMonitor() {
  const criticalCSS = useCriticalCSS();

  if (!criticalCSS) return null;

  const sizeInKB = criticalCSS.totalSize / 1024;
  const isOptimal = sizeInKB < 50; // 50KB threshold

  return (
    <Section className="py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Critical CSS Status
          </h2>
          {isOptimal ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          )}
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Total Size</span>
            </div>
            <span className={isOptimal ? 'text-green-500' : 'text-yellow-500'}>
              {sizeInKB.toFixed(2)}KB
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span>Included Selectors</span>
            <span>{criticalCSS.includedSelectors.length}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span>Excluded Selectors</span>
            <span>{criticalCSS.excludedSelectors.length}</span>
          </div>
        </div>

        {!isOptimal && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
            <p>Critical CSS size exceeds recommended limit of 50KB. Consider optimizing styles.</p>
          </div>
        )}
      </Card>
    </Section>
  );
}