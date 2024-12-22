import React, { useState } from 'react';
import { usePerformanceBudgets } from '../../hooks/usePerformanceBudgets';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function BudgetDashboard() {
  const { budgets, getReports } = usePerformanceBudgets();
  const [selectedBudget, setSelectedBudget] = useState(budgets[0]?.id);

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Performance Budgets
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {budgets.map((budget) => (
              <Card
                key={budget.id}
                hover
                className={`cursor-pointer ${
                  selectedBudget === budget.id
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedBudget(budget.id)}
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {budget.name}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedBudget && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Performance Metrics
              </h3>
              
              {getReports(selectedBudget).map((report) => (
                <div key={report.id} className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Report from {new Date(report.timestamp).toLocaleString()}
                    </p>
                    <p className="text-lg font-semibold">
                      Score: {report.score.toFixed(1)}%
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {report.metrics.map((metric) => (
                      <div
                        key={metric.name}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(metric.status)}
                          <span className="font-medium">{metric.name}</span>
                        </div>
                        <span>{metric.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </Section>
  );
}