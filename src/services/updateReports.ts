interface Report {
  id: string;
  title: string;
  content: string;
  projectId: string;
  department: string;
  type: 'manual' | 'automated';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

interface CreateReportDTO {
  title: string;
  content: string;
  projectId: string;
  department: string;
  type: 'manual' | 'automated';
  attachments?: string[];
}

export class UpdateReportsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '';
  }

  async createReport(report: CreateReportDTO): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async getReports(filters?: {
    projectId?: string;
    department?: string;
    type?: 'manual' | 'automated';
  }): Promise<Report[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.projectId) queryParams.append('projectId', filters.projectId);
      if (filters?.department) queryParams.append('department', filters.department);
      if (filters?.type) queryParams.append('type', filters.type);

      const response = await fetch(`${this.baseUrl}/api/reports?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<CreateReportDTO>): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
} 