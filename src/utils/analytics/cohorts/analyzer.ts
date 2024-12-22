import { CohortDefinition, CohortMetrics, CohortAnalysis } from './types';

export class CohortAnalyzer {
  private cohorts: Map<string, CohortAnalysis> = new Map();

  createCohort(definition: CohortDefinition): void {
    this.cohorts.set(definition.id, {
      definition,
      metrics: []
    });
  }

  analyzeCohort(cohortId: string, period: string): CohortMetrics {
    const metrics: CohortMetrics = {
      cohortId,
      period,
      metrics: {
        retention: Math.random() * 100,
        engagement: Math.random() * 100,
        conversion: Math.random() * 100
      }
    };

    const cohort = this.cohorts.get(cohortId);
    if (cohort) {
      cohort.metrics.push(metrics);
    }

    return metrics;
  }

  getCohortAnalysis(cohortId: string): CohortAnalysis | undefined {
    return this.cohorts.get(cohortId);
  }

  listCohorts(): CohortDefinition[] {
    return Array.from(this.cohorts.values()).map(cohort => cohort.definition);
  }
}

export const cohortAnalyzer = new CohortAnalyzer();