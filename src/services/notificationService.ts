import axios from 'axios';

export interface NotificationEvent {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high';
  status: 'queued' | 'processing' | 'delivered' | 'failed';
  deliveryAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
  deliveredAt?: Date;
}

export type NotificationType = 
  | 'profile_update'
  | 'security_alert'
  | 'connection_request'
  | 'message_received'
  | 'task_assigned'
  | 'reminder'
  | 'system_update'
  | 'achievement_earned';

export interface NotificationQueue {
  id: string;
  name: string;
  type: 'realtime' | 'scheduled' | 'batch';
  status: 'active' | 'paused' | 'stopped';
  events: NotificationEvent[];
  processingRate: number; // events per second
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryStatus {
  eventId: string;
  userId: string;
  channel: 'email' | 'push' | 'in_app';
  status: 'delivered' | 'failed' | 'pending';
  attempts: number;
  lastAttempt?: Date;
  error?: string;
}

class NotificationService {
  private baseUrl = '/api/notifications';
  private queues: Map<string, NotificationQueue> = new Map();
  private eventHandlers: Map<NotificationType, ((event: NotificationEvent) => Promise<void>)[]> = new Map();
  private deliveryTracking: Map<string, DeliveryStatus[]> = new Map();

  // Event Handling
  async publishEvent(event: Omit<NotificationEvent, 'id' | 'status' | 'deliveryAttempts' | 'createdAt' | 'updatedAt'>): Promise<NotificationEvent> {
    try {
      const response = await axios.post<NotificationEvent>(`${this.baseUrl}/events`, event);
      const newEvent = response.data;
      
      // Process event through registered handlers
      const handlers = this.eventHandlers.get(event.type) || [];
      await Promise.all(handlers.map(handler => handler(newEvent)));
      
      return newEvent;
    } catch (error) {
      console.error('Failed to publish notification event:', error);
      throw error;
    }
  }

  registerEventHandler(type: NotificationType, handler: (event: NotificationEvent) => Promise<void>): void {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.push(handler);
    this.eventHandlers.set(type, handlers);
  }

  unregisterEventHandler(type: NotificationType, handler: (event: NotificationEvent) => Promise<void>): void {
    const handlers = this.eventHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(type, handlers);
    }
  }

  // Queue Management
  async createQueue(queue: Omit<NotificationQueue, 'id' | 'events' | 'createdAt' | 'updatedAt'>): Promise<NotificationQueue> {
    try {
      const response = await axios.post<NotificationQueue>(`${this.baseUrl}/queues`, queue);
      const newQueue = response.data;
      this.queues.set(newQueue.id, newQueue);
      return newQueue;
    } catch (error) {
      console.error('Failed to create notification queue:', error);
      throw error;
    }
  }

  async getQueue(queueId: string): Promise<NotificationQueue | undefined> {
    try {
      const response = await axios.get<NotificationQueue>(`${this.baseUrl}/queues/${queueId}`);
      const queue = response.data;
      this.queues.set(queue.id, queue);
      return queue;
    } catch (error) {
      console.error('Failed to fetch notification queue:', error);
      throw error;
    }
  }

  async updateQueueStatus(queueId: string, status: NotificationQueue['status']): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/queues/${queueId}/status`, { status });
      const queue = this.queues.get(queueId);
      if (queue) {
        queue.status = status;
        this.queues.set(queueId, queue);
      }
    } catch (error) {
      console.error('Failed to update queue status:', error);
      throw error;
    }
  }

  async addToQueue(queueId: string, event: NotificationEvent): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/queues/${queueId}/events`, event);
      const queue = this.queues.get(queueId);
      if (queue) {
        queue.events.push(event);
        this.queues.set(queueId, queue);
      }
    } catch (error) {
      console.error('Failed to add event to queue:', error);
      throw error;
    }
  }

  // Delivery Tracking
  async trackDelivery(status: Omit<DeliveryStatus, 'lastAttempt'>): Promise<DeliveryStatus> {
    try {
      const response = await axios.post<DeliveryStatus>(`${this.baseUrl}/delivery-tracking`, status);
      const deliveryStatus = response.data;
      
      const eventStatuses = this.deliveryTracking.get(status.eventId) || [];
      eventStatuses.push(deliveryStatus);
      this.deliveryTracking.set(status.eventId, eventStatuses);
      
      return deliveryStatus;
    } catch (error) {
      console.error('Failed to track notification delivery:', error);
      throw error;
    }
  }

  async getDeliveryStatus(eventId: string): Promise<DeliveryStatus[]> {
    try {
      const response = await axios.get<DeliveryStatus[]>(`${this.baseUrl}/delivery-tracking/${eventId}`);
      const statuses = response.data;
      this.deliveryTracking.set(eventId, statuses);
      return statuses;
    } catch (error) {
      console.error('Failed to get delivery status:', error);
      throw error;
    }
  }

  async retryFailedDeliveries(eventId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/delivery-tracking/${eventId}/retry`);
      // Refresh delivery status after retry
      await this.getDeliveryStatus(eventId);
    } catch (error) {
      console.error('Failed to retry failed deliveries:', error);
      throw error;
    }
  }

  // Analytics and Monitoring
  async getDeliveryStats(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    averageDeliveryTime: number;
    deliverySuccessRate: number;
  }> {
    try {
      const response = await axios.get<{
        total: number;
        delivered: number;
        failed: number;
        pending: number;
        averageDeliveryTime: number;
        deliverySuccessRate: number;
      }>(`${this.baseUrl}/analytics/delivery`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get delivery stats:', error);
      throw error;
    }
  }

  async getQueueMetrics(queueId: string): Promise<{
    size: number;
    processingRate: number;
    averageWaitTime: number;
    errorRate: number;
  }> {
    try {
      const response = await axios.get<{
        size: number;
        processingRate: number;
        averageWaitTime: number;
        errorRate: number;
      }>(`${this.baseUrl}/queues/${queueId}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get queue metrics:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService(); 