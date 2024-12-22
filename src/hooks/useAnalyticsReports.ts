import { useState, useEffect } from 'react';
import { ReportConfig, Report } from '../utils/analytics/reports/types';
import { reportGenerator } from '../utils/analytics/reports/generator';

export function useAnalyticsReports() {
  const [reports, setReports] = useState<ReportConfig[]>([]);

  useEffect(() => {
    setReports(reportGenerator.listReports());
  }, []);

  const createReport = (config: ReportConfig) => {
    reportGenerator.createReport(config);
    setReports(reportGenerator.listReports());
  };

  const generateReport = async (reportId: string) => {
    return reportGenerator.generateReport(reportId);
  };

  const getReport = (reportId: string): Report | undefined => {
    return reportGenerator.getReport(reportId);
  };

  return {
    reports,
    createReport,
    generateReport,
    getReport
  };
}