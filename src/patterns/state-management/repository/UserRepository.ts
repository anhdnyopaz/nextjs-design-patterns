import { User } from '../provider/UserProvider';

// Repository Interface - Contract for data access
export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<User[]>;
}

// API Repository Implementation
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

  async getById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
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

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async search(query: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

// Mock Repository Implementation (for development/testing)
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

  async getById(id: string): Promise<User | null> {
    await this.delay(200);
    return this.users.find(user => user.id === id) || null;
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

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.delay(300);
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
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

// Local Storage Repository Implementation
export class LocalStorageUserRepository implements IUserRepository {
  private storageKey = 'users';

  async getAll(): Promise<User[]> {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  async getById(id: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find(user => user.id === id) || null;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const users = await this.getAll();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    users.push(newUser);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return newUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const users = await this.getAll();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...userData };
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return users[index];
  }

  async delete(id: string): Promise<boolean> {
    const users = await this.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
    return true;
  }

  async search(query: string): Promise<User[]> {
    const users = await this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Repository Factory - Strategy Pattern for choosing repository
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
} 