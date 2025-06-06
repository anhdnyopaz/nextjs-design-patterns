// Observer Pattern Implementation for State Changes

// Event Types
export interface StateChangeEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

// Observer Interface
export interface IObserver<T = any> {
  id: string;
  update(event: StateChangeEvent<T>): void;
}

// Subject Interface
export interface ISubject<T = any> {
  subscribe(observer: IObserver<T>): void;
  unsubscribe(observerId: string): void;
  notify(event: StateChangeEvent<T>): void;
}

// Base Observer Class
export abstract class BaseObserver<T = any> implements IObserver<T> {
  public readonly id: string;

  constructor(id?: string) {
    this.id = id || `observer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract update(event: StateChangeEvent<T>): void;
}

// State Observer Subject
export class StateObserverSubject<T = any> implements ISubject<T> {
  private observers: Map<string, IObserver<T>> = new Map();
  private eventHistory: StateChangeEvent<T>[] = [];
  private maxHistorySize: number = 100;

  subscribe(observer: IObserver<T>): void {
    this.observers.set(observer.id, observer);
    console.log(`Observer ${observer.id} subscribed`);
  }

  unsubscribe(observerId: string): void {
    const removed = this.observers.delete(observerId);
    if (removed) {
      console.log(`Observer ${observerId} unsubscribed`);
    }
  }

  notify(event: StateChangeEvent<T>): void {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify all observers
    this.observers.forEach(observer => {
      try {
        observer.update(event);
      } catch (error) {
        console.error(`Error notifying observer ${observer.id}:`, error);
      }
    });
  }

  getObservers(): string[] {
    return Array.from(this.observers.keys());
  }

  getEventHistory(): StateChangeEvent<T>[] {
    return [...this.eventHistory];
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}

// Concrete Observer Implementations

// Logger Observer - Logs all state changes
export class LoggerObserver extends BaseObserver {
  constructor(private logLevel: 'info' | 'debug' | 'warn' = 'info') {
    super('logger_observer');
  }

  update(event: StateChangeEvent): void {
    const message = `[${new Date(event.timestamp).toISOString()}] ${event.source}: ${event.type}`;
    
    switch (this.logLevel) {
      case 'debug':
        console.debug(message, event.payload);
        break;
      case 'warn':
        console.warn(message, event.payload);
        break;
      case 'info':
      default:
        console.info(message, event.payload);
        break;
    }
  }
}

// Analytics Observer - Tracks user interactions for analytics
export class AnalyticsObserver extends BaseObserver {
  private analytics: Array<{ event: string; timestamp: number; data: any }> = [];

  constructor() {
    super('analytics_observer');
  }

  update(event: StateChangeEvent): void {
    // Only track certain types of events
    const trackableEvents = ['USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED'];
    
    if (trackableEvents.includes(event.type)) {
      this.analytics.push({
        event: event.type,
        timestamp: event.timestamp,
        data: event.payload,
      });

      // Simulate sending to analytics service
      this.sendToAnalytics(event);
    }
  }

  private sendToAnalytics(event: StateChangeEvent): void {
    // Simulate API call to analytics service
    console.log('📊 Analytics:', {
      event: event.type,
      timestamp: event.timestamp,
      source: event.source,
    });
  }

  getAnalyticsData() {
    return [...this.analytics];
  }
}

// Persistence Observer - Saves state changes to storage
export class PersistenceObserver extends BaseObserver {
  constructor(private storageKey: string = 'app_state_history') {
    super('persistence_observer');
  }

  update(event: StateChangeEvent): void {
    try {
      const history = this.getStoredHistory();
      history.push(event);

      // Keep only last 50 events
      if (history.length > 50) {
        history.splice(0, history.length - 50);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to persist state change:', error);
    }
  }

  private getStoredHistory(): StateChangeEvent[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getPersistedHistory(): StateChangeEvent[] {
    return this.getStoredHistory();
  }
}

// Notification Observer - Shows user notifications for important events
export class NotificationObserver extends BaseObserver {
  constructor() {
    super('notification_observer');
  }

  update(event: StateChangeEvent): void {
    // Show notifications for specific events
    switch (event.type) {
      case 'USER_CREATED':
        this.showNotification('success', 'Người dùng mới đã được tạo thành công!');
        break;
      case 'USER_UPDATED':
        this.showNotification('info', 'Thông tin người dùng đã được cập nhật!');
        break;
      case 'USER_DELETED':
        this.showNotification('warning', 'Người dùng đã được xóa!');
        break;
      case 'ERROR':
        this.showNotification('error', `Lỗi: ${event.payload.message}`);
        break;
    }
  }

  private showNotification(type: 'success' | 'info' | 'warning' | 'error', message: string): void {
    // In a real app, this would integrate with a toast/notification library
    console.log(`🔔 ${type.toUpperCase()}: ${message}`);
    
    // Simulate browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message);
    }
  }
}

// State Change Event Factory
export class StateEventFactory {
  static createEvent<T>(
    type: string,
    payload: T,
    source: string = 'unknown'
  ): StateChangeEvent<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
      source,
    };
  }

  // Predefined event creators
  static userCreated(user: any): StateChangeEvent {
    return this.createEvent('USER_CREATED', user, 'UserService');
  }

  static userUpdated(user: any): StateChangeEvent {
    return this.createEvent('USER_UPDATED', user, 'UserService');
  }

  static userDeleted(userId: string): StateChangeEvent {
    return this.createEvent('USER_DELETED', { id: userId }, 'UserService');
  }

  static userLogin(user: any): StateChangeEvent {
    return this.createEvent('USER_LOGIN', user, 'AuthService');
  }

  static userLogout(): StateChangeEvent {
    return this.createEvent('USER_LOGOUT', {}, 'AuthService');
  }

  static error(error: Error, source: string = 'Application'): StateChangeEvent {
    return this.createEvent('ERROR', { 
      message: error.message,
      stack: error.stack,
    }, source);
  }
}

// Global State Observer Manager
export class GlobalStateObserver {
  private static instance: GlobalStateObserver;
  private subject: StateObserverSubject;

  private constructor() {
    this.subject = new StateObserverSubject();
    this.setupDefaultObservers();
  }

  static getInstance(): GlobalStateObserver {
    if (!GlobalStateObserver.instance) {
      GlobalStateObserver.instance = new GlobalStateObserver();
    }
    return GlobalStateObserver.instance;
  }

  private setupDefaultObservers(): void {
    // Setup default observers
    this.subject.subscribe(new LoggerObserver('info'));
    this.subject.subscribe(new AnalyticsObserver());
    this.subject.subscribe(new PersistenceObserver());
    this.subject.subscribe(new NotificationObserver());
  }

  emit<T>(event: StateChangeEvent<T>): void {
    this.subject.notify(event);
  }

  subscribe(observer: IObserver): void {
    this.subject.subscribe(observer);
  }

  unsubscribe(observerId: string): void {
    this.subject.unsubscribe(observerId);
  }

  getHistory(): StateChangeEvent[] {
    return this.subject.getEventHistory();
  }

  getObservers(): string[] {
    return this.subject.getObservers();
  }
} 