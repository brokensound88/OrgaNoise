import { useState, useEffect } from 'react';
import { CohortDefinition, CohortAnalysis } from '../utils/analytics/cohorts/types';
import { cohortAnalyzer } from '../utils/analytics/cohorts/analyzer';

export function useCohortAnalysis() {
  const [cohorts, setCohorts] = useState<CohortDefinition[]>([]);

  useEffect(() => {
    setCohorts(cohortAnalyzer.listCohorts());
  }, []);

  const createCohort = (definition: CohortDefinition) => {
    cohortAnalyzer.createCohort(definition);
    setCohorts(cohortAnalyzer.listCohorts());
  };

  const analyzeCohort = (cohortId: string, period: string) => {
    return cohortAnalyzer.analyzeCohort(cohortId, period);
  };

  const getCohortAnalysis = (cohortId: string): CohortAnalysis | undefined => {
    return cohortAnalyzer.getCohortAnalysis(cohortId);
  };

  return {
    cohorts,
    createCohort,
    analyzeCohort,
    getCohortAnalysis
  };
}