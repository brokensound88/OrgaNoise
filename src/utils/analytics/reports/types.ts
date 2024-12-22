export interface ReportConfig {
  id: string;
  name: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  metrics: string[];
  filters?: Record<string, any>;
  recipients?: string[];
}

export interface ReportData {
  id: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface Report {
  config: ReportConfig;
  data: ReportData[];
}