import axios from 'axios';

export interface Rule {
  id: string;
  name: string;
  description?: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: unknown;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array';
  }>;
  actions: Array<{
    type: 'send_notification' | 'update_status' | 'trigger_webhook' | 'add_tag' | 'remove_tag';
    config: Record<string, unknown>;
  }>;
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
  };
}

export interface RuleExecution {
  id: string;
  ruleId: string;
  notificationId: string;
  status: 'success' | 'failure' | 'partial';
  startTime: Date;
  endTime: Date;
  conditionsEvaluated: Array<{
    field: string;
    result: boolean;
    actualValue: unknown;
  }>;
  actionsExecuted: Array<{
    type: string;
    status: 'success' | 'failure';
    error?: string;
  }>;
}

export class NotificationRulesService {
  private baseUrl = '/api/notifications/rules';

  // Rule Management
  async createRule(rule: Omit<Rule, 'id' | 'metadata'>): Promise<Rule> {
    try {
      const response = await axios.post<Rule>(`${this.baseUrl}/rules`, rule);
      return response.data;
    } catch (error) {
      console.error('Failed to create rule:', error);
      throw error;
    }
  }

  async updateRule(ruleId: string, updates: Partial<Omit<Rule, 'id' | 'metadata'>>): Promise<Rule> {
    try {
      const response = await axios.put<Rule>(`${this.baseUrl}/rules/${ruleId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update rule:', error);
      throw error;
    }
  }

  async deleteRule(ruleId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/rules/${ruleId}`);
    } catch (error) {
      console.error('Failed to delete rule:', error);
      throw error;
    }
  }

  async listRules(filters?: {
    status?: Rule['status'];
    search?: string;
    sortBy?: 'priority' | 'name' | 'triggerCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Rule[]> {
    try {
      const response = await axios.get<Rule[]>(`${this.baseUrl}/rules`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list rules:', error);
      throw error;
    }
  }

  // Rule Execution
  async evaluateRules(notificationId: string, context: Record<string, unknown>): Promise<RuleExecution[]> {
    try {
      const response = await axios.post<RuleExecution[]>(`${this.baseUrl}/evaluate`, {
        notificationId,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Failed to evaluate rules:', error);
      throw error;
    }
  }

  async getRuleExecutionHistory(filters?: {
    ruleId?: string;
    notificationId?: string;
    status?: RuleExecution['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<RuleExecution[]> {
    try {
      const response = await axios.get<RuleExecution[]>(`${this.baseUrl}/executions`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get rule execution history:', error);
      throw error;
    }
  }

  // Condition Builder
  async validateCondition(condition: Rule['conditions'][0], testValue: unknown): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/validate-condition`, {
        condition,
        testValue
      });
      return response.data;
    } catch (error) {
      console.error('Failed to validate condition:', error);
      throw error;
    }
  }

  async getAvailableFields(): Promise<Array<{
    field: string;
    type: string;
    description: string;
    allowedOperators: string[];
    examples: unknown[];
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/fields`);
      return response.data;
    } catch (error) {
      console.error('Failed to get available fields:', error);
      throw error;
    }
  }

  // Action Management
  async validateAction(action: Rule['actions'][0]): Promise<{
    isValid: boolean;
    error?: string;
    requiredFields?: string[];
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/validate-action`, action);
      return response.data;
    } catch (error) {
      console.error('Failed to validate action:', error);
      throw error;
    }
  }

  async getAvailableActions(): Promise<Array<{
    type: string;
    description: string;
    configSchema: Record<string, unknown>;
    examples: Record<string, unknown>[];
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/actions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get available actions:', error);
      throw error;
    }
  }

  // Rule Testing
  async testRule(rule: Omit<Rule, 'id' | 'metadata'>, testData: Record<string, unknown>): Promise<{
    conditionResults: Array<{
      field: string;
      result: boolean;
      actualValue: unknown;
    }>;
    wouldTriggerActions: boolean;
    predictedActions: Array<{
      type: string;
      config: Record<string, unknown>;
    }>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/test`, {
        rule,
        testData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to test rule:', error);
      throw error;
    }
  }

  // Rule Analytics
  async getRuleAnalytics(ruleId: string, timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    triggersByHour: Record<string, number>;
    topFailureReasons: Array<{
      reason: string;
      count: number;
    }>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/analytics/${ruleId}`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get rule analytics:', error);
      throw error;
    }
  }
}

export const notificationRulesService = new NotificationRulesService(); 