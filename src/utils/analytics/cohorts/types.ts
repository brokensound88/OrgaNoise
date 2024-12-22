export interface CohortDefinition {
  id: string;
  name: string;
  criteria: {
    startDate: string;
    endDate?: string;
    filters?: Record<string, any>;
  };
}

export interface CohortMetrics {
  cohortId: string;
  period: string;
  metrics: {
    retention: number;
    engagement: number;
    conversion: number;
  };
}

export interface CohortAnalysis {
  definition: CohortDefinition;
  metrics: CohortMetrics[];
}