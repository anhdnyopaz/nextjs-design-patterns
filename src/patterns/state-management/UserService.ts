import { User } from './provider/UserProvider';
import { IUserRepository, UserRepositoryFactory } from './repository/UserRepository';
import { GlobalStateObserver, StateEventFactory } from './observer/StateObserver';

// Service Layer integrating all State Management Patterns
export class UserService {
  private repository: IUserRepository;
  private observer: GlobalStateObserver;

  constructor(repositoryType: 'api' | 'mock' | 'localStorage' = 'mock') {
    this.repository = UserRepositoryFactory.create(repositoryType);
    this.observer = GlobalStateObserver.getInstance();
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.repository.getAll();
      
      // Emit event for successful fetch
      this.observer.emit(StateEventFactory.createEvent(
        'USERS_FETCHED',
        { count: users.length },
        'UserService'
      ));
      
      return users;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.repository.getById(id);
      
      if (user) {
        this.observer.emit(StateEventFactory.createEvent(
          'USER_FETCHED',
          user,
          'UserService'
        ));
      }
      
      return user;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Create new user
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const newUser = await this.repository.create(userData);
      
      // Emit user created event
      this.observer.emit(StateEventFactory.userCreated(newUser));
      
      return newUser;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.repository.update(id, userData);
      
      // Emit user updated event
      this.observer.emit(StateEventFactory.userUpdated(updatedUser));
      
      return updatedUser;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    try {
      const success = await this.repository.delete(id);
      
      if (success) {
        // Emit user deleted event
        this.observer.emit(StateEventFactory.userDeleted(id));
      }
      
      return success;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await this.repository.search(query);
      
      this.observer.emit(StateEventFactory.createEvent(
        'USERS_SEARCHED',
        { query, results: users.length },
        'UserService'
      ));
      
      return users;
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<User | null> {
    try {
      // Simulate authentication
      const users = await this.repository.getAll();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In real app, verify password here
        this.observer.emit(StateEventFactory.userLogin(user));
        return user;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      this.observer.emit(StateEventFactory.error(error as Error, 'UserService'));
      throw error;
    }
  }

  logout(): void {
    this.observer.emit(StateEventFactory.userLogout());
  }

  // Get service statistics
  getStatistics() {
    const history = this.observer.getHistory();
    const observers = this.observer.getObservers();
    
    const eventCounts = history.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: history.length,
      eventCounts,
      observers: observers.length,
      observerIds: observers,
    };
  }
}

// Singleton instance
let userServiceInstance: UserService | null = null;

export function getUserService(repositoryType?: 'api' | 'mock' | 'localStorage'): UserService {
  if (!userServiceInstance) {
    userServiceInstance = new UserService(repositoryType);
  }
  return userServiceInstance;
}

// Hook for using UserService in React components
export function useUserService() {
  return getUserService();
} 