import CodeExample from './CodeExample';

export default function LearningSection() {
  const providerCode = `// Provider Pattern - UserProvider.tsx
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

// Types Definition
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string };

// Reducer Function
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    default:
      return state;
  }
}

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Action helpers với useCallback để tránh re-render
  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const mockUsers: User[] = [
        { id: '1', name: 'Nguyễn Văn A', email: 'a@example.com', role: 'admin' },
        { id: '2', name: 'Trần Thị B', email: 'b@example.com', role: 'user' },
        { id: '3', name: 'Lê Văn C', email: 'c@example.com', role: 'guest' },
      ];
      dispatch({ type: 'SET_USERS', payload: mockUsers });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch users' });
    }
  }, []);

  const value: UserContextType = {
    state, dispatch, fetchUsers, login, logout, addUser, updateUser, deleteUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}`;

  const repositoryCode = `// Repository Pattern - UserRepository.ts
import { User } from './UserProvider';

// Repository Interface - Contract for data access
export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<User[]>;
}

// Mock Implementation cho development/testing
export class MockUserRepository implements IUserRepository {
  private users: User[] = [
    { id: '1', name: 'Nguyễn Văn A', email: 'a@example.com', role: 'admin' },
    { id: '2', name: 'Trần Thị B', email: 'b@example.com', role: 'user' },
    { id: '3', name: 'Lê Văn C', email: 'c@example.com', role: 'guest' },
  ];

  async getAll(): Promise<User[]> {
    // Simulate network delay
    await this.delay(500);
    return [...this.users];
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    await this.delay(300);
    const newUser: User = {
      ...userData,
      id: (this.users.length + 1).toString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  async search(query: string): Promise<User[]> {
    await this.delay(400);
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// API Implementation cho production
export class ApiUserRepository implements IUserRepository {
  private baseUrl = '/api/users';

  async getAll(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  // ... other methods
}

// Factory Pattern để choose repository
export class UserRepositoryFactory {
  static create(type: 'api' | 'mock' | 'localStorage' = 'mock'): IUserRepository {
    switch (type) {
      case 'api':
        return new ApiUserRepository();
      case 'localStorage':
        return new LocalStorageUserRepository();
      case 'mock':
      default:
        return new MockUserRepository();
    }
  }
}`;

  const observerCode = `// Observer Pattern - StateObserver.ts
export interface StateChangeEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

export interface IObserver<T = any> {
  id: string;
  update(event: StateChangeEvent<T>): void;
}

export interface ISubject<T = any> {
  subscribe(observer: IObserver<T>): void;
  unsubscribe(observerId: string): void;
  notify(event: StateChangeEvent<T>): void;
}

// Base Observer Class
export abstract class BaseObserver<T = any> implements IObserver<T> {
  public readonly id: string;

  constructor(id?: string) {
    this.id = id || \`observer_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  abstract update(event: StateChangeEvent<T>): void;
}

// Concrete Observer - Logger
export class LoggerObserver extends BaseObserver {
  constructor(private logLevel: 'info' | 'debug' | 'warn' = 'info') {
    super('logger_observer');
  }

  update(event: StateChangeEvent): void {
    const message = \`[\${new Date(event.timestamp).toISOString()}] \${event.source}: \${event.type}\`;
    
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

// Global State Observer Manager - Singleton Pattern
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
}`;

  return (
    <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📚 Học tập Design Patterns
      </h2>
      
      <div className="prose max-w-none">
        <CodeExample
          title="1. 🏭 Provider Pattern"
          explanation="Provider Pattern sử dụng React Context API để quản lý global state. Nó cho phép chia sẻ dữ liệu giữa các component mà không cần prop drilling. Trong ví dụ này, chúng ta sử dụng useReducer để quản lý state phức tạp và useCallback để tối ưu performance."
          code={providerCode}
        />

        <CodeExample
          title="2. 🗄️ Repository Pattern"
          explanation="Repository Pattern trừu tượng hóa data access layer, cho phép chúng ta dễ dàng thay đổi implementation (API, LocalStorage, Mock) mà không ảnh hưởng đến business logic. Factory Pattern được sử dụng để tạo repository instance phù hợp."
          code={repositoryCode}
        />

        <CodeExample
          title="3. 👁️ Observer Pattern"
          explanation="Observer Pattern cho phép objects 'quan sát' và phản ứng với state changes. Khi có event xảy ra, tất cả observers sẽ được thông báo. Điều này rất hữu ích cho logging, analytics, notifications, và persistence."
          code={observerCode}
        />
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">🎯 Lợi ích của các Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">🏭 Provider Pattern</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Tránh prop drilling</li>
              <li>• Centralized state management</li>
              <li>• Type-safe với TypeScript</li>
              <li>• Performance optimization với useCallback</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">🗄️ Repository Pattern</h4>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Separation of concerns</li>
              <li>• Easy testing với mock implementations</li>
              <li>• Flexibility để switch data sources</li>
              <li>• Consistent interface cho data access</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-2">👁️ Observer Pattern</h4>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• Loose coupling between objects</li>
              <li>• Real-time notifications</li>
              <li>• Easy to add new observers</li>
              <li>• Event-driven architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 