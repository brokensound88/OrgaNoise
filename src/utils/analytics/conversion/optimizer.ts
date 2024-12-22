import { ConversionGoal } from '../revenue/types';

export class ConversionOptimizer {
  private goals: Map<string, ConversionGoal> = new Map();

  createGoal(goal: ConversionGoal): void {
    this.goals.set(goal.id, goal);
  }

  updateGoal(goalId: string, progress: number): void {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.current = progress;
    }
  }

  getGoal(goalId: string): ConversionGoal | undefined {
    return this.goals.get(goalId);
  }

  listGoals(): ConversionGoal[] {
    return Array.from(this.goals.values());
  }

  getRecommendations(goalId: string): string[] {
    const goal = this.goals.get(goalId);
    if (!goal) return [];

    const progress = (goal.current / goal.target) * 100;
    
    if (progress < 50) {
      return [
        'Optimize call-to-action placement',
        'Improve page load performance',
        'Implement A/B testing'
      ];
    } else if (progress < 80) {
      return [
        'Fine-tune user journey',
        'Enhance mobile experience',
        'Personalize content'
      ];
    } else {
      return [
        'Maintain current optimizations',
        'Focus on retention',
        'Explore new opportunities'
      ];
    }
  }
}

export const conversionOptimizer = new ConversionOptimizer();