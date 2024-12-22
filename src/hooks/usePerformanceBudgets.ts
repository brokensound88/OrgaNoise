import { useState, useEffect } from 'react';
import { PerformanceBudget, PerformanceReport } from '../utils/performance/types';
import { performanceBudgetManager } from '../utils/performance/budgets';

export function usePerformanceBudgets() {
  const [budgets, setBudgets] = useState<PerformanceBudget[]>([]);

  useEffect(() => {
    setBudgets(performanceBudgetManager.listBudgets());
  }, []);

  const createBudget = (budget: Omit<PerformanceBudget, 'id'>) => {
    const newBudget = performanceBudgetManager.createBudget(budget);
    setBudgets(performanceBudgetManager.listBudgets());
    return newBudget;
  };

  const checkMetrics = (budgetId: string, metrics: Record<string, number>) => {
    return performanceBudgetManager.checkMetrics(budgetId, metrics);
  };

  const getReports = (budgetId: string): PerformanceReport[] => {
    return performanceBudgetManager.getReports(budgetId);
  };

  return {
    budgets,
    createBudget,
    checkMetrics,
    getReports
  };
}