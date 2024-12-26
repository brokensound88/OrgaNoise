import axios from 'axios';

export type ConnectionType = 'friend' | 'follow';
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface Connection {
  id: string;
  userId: string;
  targetUserId: string;
  type: ConnectionType;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionRequest {
  userId: string;
  type: ConnectionType;
  message?: string;
}

export interface BlockedUser {
  userId: string;
  targetUserId: string;
  reason?: string;
  createdAt: Date;
}

export interface MutedUser {
  userId: string;
  targetUserId: string;
  duration?: number; // Duration in days, undefined means indefinite
  createdAt: Date;
  expiresAt?: Date;
}

class SocialConnectionsService {
  private baseUrl = '/api/social-connections';

  // Connection Management
  async getConnections(userId: string, type?: ConnectionType): Promise<Connection[]> {
    try {
      const params = type ? { type } : {};
      const response = await axios.get<Connection[]>(`${this.baseUrl}/${userId}`, { params });
      return response.data.map(connection => ({
        ...connection,
        createdAt: new Date(connection.createdAt),
        updatedAt: new Date(connection.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      throw error;
    }
  }

  async sendConnectionRequest(userId: string, request: ConnectionRequest): Promise<Connection> {
    try {
      const response = await axios.post<Connection>(`${this.baseUrl}/${userId}/request`, request);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to send connection request:', error);
      throw error;
    }
  }

  async respondToRequest(userId: string, connectionId: string, accept: boolean): Promise<Connection> {
    try {
      const response = await axios.put<Connection>(
        `${this.baseUrl}/${userId}/request/${connectionId}`,
        { accept }
      );
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to respond to connection request:', error);
      throw error;
    }
  }

  async removeConnection(userId: string, connectionId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/connection/${connectionId}`);
    } catch (error) {
      console.error('Failed to remove connection:', error);
      throw error;
    }
  }

  // Block Management
  async blockUser(userId: string, targetUserId: string, reason?: string): Promise<BlockedUser> {
    try {
      const response = await axios.post<BlockedUser>(`${this.baseUrl}/${userId}/block`, {
        targetUserId,
        reason,
      });
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error('Failed to block user:', error);
      throw error;
    }
  }

  async unblockUser(userId: string, targetUserId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/block/${targetUserId}`);
    } catch (error) {
      console.error('Failed to unblock user:', error);
      throw error;
    }
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    try {
      const response = await axios.get<BlockedUser[]>(`${this.baseUrl}/${userId}/blocked`);
      return response.data.map(blocked => ({
        ...blocked,
        createdAt: new Date(blocked.createdAt),
      }));
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
      throw error;
    }
  }

  // Mute Management
  async muteUser(
    userId: string,
    targetUserId: string,
    duration?: number
  ): Promise<MutedUser> {
    try {
      const response = await axios.post<MutedUser>(`${this.baseUrl}/${userId}/mute`, {
        targetUserId,
        duration,
      });
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : undefined,
      };
    } catch (error) {
      console.error('Failed to mute user:', error);
      throw error;
    }
  }

  async unmuteUser(userId: string, targetUserId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/mute/${targetUserId}`);
    } catch (error) {
      console.error('Failed to unmute user:', error);
      throw error;
    }
  }

  async getMutedUsers(userId: string): Promise<MutedUser[]> {
    try {
      const response = await axios.get<MutedUser[]>(`${this.baseUrl}/${userId}/muted`);
      return response.data.map(muted => ({
        ...muted,
        createdAt: new Date(muted.createdAt),
        expiresAt: muted.expiresAt ? new Date(muted.expiresAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch muted users:', error);
      throw error;
    }
  }

  // Connection Suggestions
  async getConnectionSuggestions(userId: string, limit = 10): Promise<Connection[]> {
    try {
      const response = await axios.get<Connection[]>(
        `${this.baseUrl}/${userId}/suggestions`,
        { params: { limit } }
      );
      return response.data.map(connection => ({
        ...connection,
        createdAt: new Date(connection.createdAt),
        updatedAt: new Date(connection.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch connection suggestions:', error);
      throw error;
    }
  }
}

export const socialConnectionsService = new SocialConnectionsService(); 