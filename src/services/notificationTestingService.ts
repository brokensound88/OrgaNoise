import axios from 'axios';

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  type: 'unit' | 'integration' | 'load';
  config: {
    notification: {
      type: string;
      template?: string;
      data: Record<string, unknown>;
    };
    recipients?: Array<{
      type: 'user' | 'group' | 'test';
      id: string;
    }>;
    expectations: Array<{
      assertion: string;
      expected: unknown;
      timeout?: number;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastRun?: Date;
  };
}

export interface TestRun {
  id: string;
  testCaseId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  results: Array<{
    assertion: string;
    success: boolean;
    actual: unknown;
    expected: unknown;
    error?: string;
  }>;
  performance?: {
    duration: number;
    memory: number;
    cpu: number;
  };
  error?: string;
}

export interface LoadTest {
  id: string;
  name: string;
  config: {
    duration: number;
    users: number;
    rampUp: number;
    scenario: Array<{
      action: string;
      params: Record<string, unknown>;
      thinkTime?: number;
    }>;
    thresholds: {
      responseTime: number;
      errorRate: number;
      throughput: number;
    };
  };
  results?: {
    summary: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageResponseTime: number;
      p95ResponseTime: number;
      throughput: number;
      errorRate: number;
    };
    timeSeries: Array<{
      timestamp: Date;
      metrics: Record<string, number>;
    }>;
    errors: Array<{
      count: number;
      type: string;
      message: string;
    }>;
  };
}

export class NotificationTestingService {
  private baseUrl = '/api/notifications/testing';

  // Test Case Management
  async createTestCase(testCase: Omit<TestCase, 'id' | 'metadata'>): Promise<TestCase> {
    try {
      const response = await axios.post<TestCase>(`${this.baseUrl}/cases`, testCase);
      return response.data;
    } catch (error) {
      console.error('Failed to create test case:', error);
      throw error;
    }
  }

  async updateTestCase(testCaseId: string, updates: Partial<Omit<TestCase, 'id' | 'metadata'>>): Promise<TestCase> {
    try {
      const response = await axios.put<TestCase>(`${this.baseUrl}/cases/${testCaseId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update test case:', error);
      throw error;
    }
  }

  async deleteTestCase(testCaseId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/cases/${testCaseId}`);
    } catch (error) {
      console.error('Failed to delete test case:', error);
      throw error;
    }
  }

  async listTestCases(filters?: {
    type?: TestCase['type'];
    search?: string;
  }): Promise<TestCase[]> {
    try {
      const response = await axios.get<TestCase[]>(`${this.baseUrl}/cases`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list test cases:', error);
      throw error;
    }
  }

  // Test Execution
  async runTest(testCaseId: string): Promise<TestRun> {
    try {
      const response = await axios.post<TestRun>(`${this.baseUrl}/run/${testCaseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to run test:', error);
      throw error;
    }
  }

  async runAllTests(type?: TestCase['type']): Promise<TestRun[]> {
    try {
      const response = await axios.post<TestRun[]>(`${this.baseUrl}/run-all`, { type });
      return response.data;
    } catch (error) {
      console.error('Failed to run all tests:', error);
      throw error;
    }
  }

  async getTestStatus(testRunId: string): Promise<TestRun> {
    try {
      const response = await axios.get<TestRun>(`${this.baseUrl}/runs/${testRunId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get test status:', error);
      throw error;
    }
  }

  // Load Testing
  async createLoadTest(loadTest: Omit<LoadTest, 'id' | 'results'>): Promise<LoadTest> {
    try {
      const response = await axios.post<LoadTest>(`${this.baseUrl}/load-tests`, loadTest);
      return response.data;
    } catch (error) {
      console.error('Failed to create load test:', error);
      throw error;
    }
  }

  async startLoadTest(loadTestId: string): Promise<{
    runId: string;
    status: 'started' | 'queued';
    estimatedDuration: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/load-tests/${loadTestId}/start`);
      return response.data;
    } catch (error) {
      console.error('Failed to start load test:', error);
      throw error;
    }
  }

  async stopLoadTest(loadTestId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/load-tests/${loadTestId}/stop`);
    } catch (error) {
      console.error('Failed to stop load test:', error);
      throw error;
    }
  }

  async getLoadTestResults(loadTestId: string): Promise<LoadTest['results']> {
    try {
      const response = await axios.get(`${this.baseUrl}/load-tests/${loadTestId}/results`);
      return response.data;
    } catch (error) {
      console.error('Failed to get load test results:', error);
      throw error;
    }
  }

  // Test Environment
  async setupTestEnvironment(): Promise<{
    status: 'success' | 'failed';
    endpoints: Record<string, string>;
    testUsers: Array<{
      id: string;
      email: string;
      token: string;
    }>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/environment/setup`);
      return response.data;
    } catch (error) {
      console.error('Failed to setup test environment:', error);
      throw error;
    }
  }

  async cleanupTestEnvironment(): Promise<{
    status: 'success' | 'failed';
    details: Record<string, unknown>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/environment/cleanup`);
      return response.data;
    } catch (error) {
      console.error('Failed to cleanup test environment:', error);
      throw error;
    }
  }

  // Test Reports
  async generateTestReport(filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: TestCase['type'];
  }): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      duration: number;
    };
    testCases: Array<{
      name: string;
      type: string;
      status: string;
      duration: number;
      failureReason?: string;
    }>;
    trends: {
      passRate: number[];
      executionTime: number[];
      errorTypes: Record<string, number>;
    };
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/reports`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate test report:', error);
      throw error;
    }
  }
}

export const notificationTestingService = new NotificationTestingService(); 