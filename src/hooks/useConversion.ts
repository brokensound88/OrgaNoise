import { useState, useEffect } from 'react';
import { ConversionGoal } from '../utils/analytics/revenue/types';
import { conversionOptimizer } from '../utils/analytics/conversion/optimizer';

export function useConversion() {
  const [goals, setGoals] = useState<ConversionGoal[]>([]);

  useEffect(() => {
    setGoals(conversionOptimizer.listGoals());
  }, []);

  const createGoal = (goal: ConversionGoal) => {
    conversionOptimizer.createGoal(goal);
    setGoals(conversionOptimizer.listGoals());
  };

  const updateGoal = (goalId: string, progress: number) => {
    conversionOptimizer.updateGoal(goalId, progress);
    setGoals(conversionOptimizer.listGoals());
  };

  const getRecommendations = (goalId: string) => {
    return conversionOptimizer.getRecommendations(goalId);
  };

  return {
    goals,
    createGoal,
    updateGoal,
    getRecommendations
  };
}