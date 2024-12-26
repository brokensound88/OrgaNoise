import axios from 'axios';

export interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic' | 'smart';
  rules?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'in' | 'not_in';
    value: unknown;
  }>;
  members: string[]; // User IDs
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastSync?: Date;
    memberCount: number;
  };
}

export interface GroupPermission {
  id: string;
  groupId: string;
  role: 'admin' | 'moderator' | 'member';
  permissions: Array<'view' | 'edit' | 'delete' | 'manage_members' | 'send_notifications'>;
  userId: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface BulkOperation {
  id: string;
  type: 'add_members' | 'remove_members' | 'send_notification' | 'update_permissions';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export class NotificationGroupsService {
  private baseUrl = '/api/notifications/groups';

  // Group Management
  async createGroup(group: Omit<NotificationGroup, 'id' | 'metadata'>): Promise<NotificationGroup> {
    try {
      const response = await axios.post<NotificationGroup>(`${this.baseUrl}/groups`, group);
      return response.data;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  }

  async updateGroup(groupId: string, updates: Partial<Omit<NotificationGroup, 'id' | 'metadata'>>): Promise<NotificationGroup> {
    try {
      const response = await axios.put<NotificationGroup>(`${this.baseUrl}/groups/${groupId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    }
  }

  async listGroups(filters?: {
    type?: NotificationGroup['type'];
    search?: string;
    sortBy?: 'name' | 'memberCount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<NotificationGroup[]> {
    try {
      const response = await axios.get<NotificationGroup[]>(`${this.baseUrl}/groups`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list groups:', error);
      throw error;
    }
  }

  // Member Management
  async addMembers(groupId: string, memberIds: string[]): Promise<BulkOperation> {
    try {
      const response = await axios.post<BulkOperation>(`${this.baseUrl}/groups/${groupId}/members`, {
        memberIds
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add members:', error);
      throw error;
    }
  }

  async removeMembers(groupId: string, memberIds: string[]): Promise<BulkOperation> {
    try {
      const response = await axios.delete<BulkOperation>(`${this.baseUrl}/groups/${groupId}/members`, {
        data: { memberIds }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to remove members:', error);
      throw error;
    }
  }

  async getMembers(groupId: string, options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    members: Array<{
      id: string;
      name: string;
      email: string;
      joinedAt: Date;
      role: GroupPermission['role'];
    }>;
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/groups/${groupId}/members`, {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get members:', error);
      throw error;
    }
  }

  // Permission Management
  async setPermissions(groupId: string, permissions: Array<Omit<GroupPermission, 'id' | 'groupId' | 'grantedAt'>>): Promise<GroupPermission[]> {
    try {
      const response = await axios.put<GroupPermission[]>(`${this.baseUrl}/groups/${groupId}/permissions`, {
        permissions
      });
      return response.data;
    } catch (error) {
      console.error('Failed to set permissions:', error);
      throw error;
    }
  }

  async getPermissions(groupId: string, userId?: string): Promise<GroupPermission[]> {
    try {
      const response = await axios.get<GroupPermission[]>(`${this.baseUrl}/groups/${groupId}/permissions`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get permissions:', error);
      throw error;
    }
  }

  // Bulk Operations
  async getBulkOperationStatus(operationId: string): Promise<BulkOperation> {
    try {
      const response = await axios.get<BulkOperation>(`${this.baseUrl}/operations/${operationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get bulk operation status:', error);
      throw error;
    }
  }

  async sendGroupNotification(groupId: string, notification: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<BulkOperation> {
    try {
      const response = await axios.post<BulkOperation>(`${this.baseUrl}/groups/${groupId}/notify`, notification);
      return response.data;
    } catch (error) {
      console.error('Failed to send group notification:', error);
      throw error;
    }
  }

  // Smart Groups
  async syncSmartGroup(groupId: string): Promise<{
    added: number;
    removed: number;
    total: number;
    lastSync: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/groups/${groupId}/sync`);
      return response.data;
    } catch (error) {
      console.error('Failed to sync smart group:', error);
      throw error;
    }
  }

  async validateGroupRules(rules: NotificationGroup['rules']): Promise<{
    isValid: boolean;
    errors?: Array<{
      field: string;
      message: string;
    }>;
    estimatedMembers: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/validate-rules`, { rules });
      return response.data;
    } catch (error) {
      console.error('Failed to validate group rules:', error);
      throw error;
    }
  }
}

export const notificationGroupsService = new NotificationGroupsService(); 