// Types
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  category: string;
  tags: string[];
  createdAt: string;
  likes: number;
  views: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}

// Mock data generators
const generatePosts = (count: number, offset = 0): Post[] => {
  const categories = ['Technology', 'Design', 'Programming', 'Tutorial', 'News'];
  const tags = ['React', 'NextJS', 'TypeScript', 'JavaScript', 'CSS', 'Performance', 'SEO'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    title: `Awesome Post Title ${offset + i + 1}`,
    body: `This is the body content for post ${offset + i + 1}. It contains interesting information about ${categories[i % categories.length].toLowerCase()}.`,
    userId: Math.floor(Math.random() * 10) + 1,
    category: categories[i % categories.length],
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    likes: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 1000)
  }));
};

const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    bio: `Bio for user ${i + 1}. I love coding and sharing knowledge!`,
    followers: Math.floor(Math.random() * 1000),
    following: Math.floor(Math.random() * 500)
  }));
};

// Mock databases
let mockPosts = generatePosts(1000);
let mockUsers = generateUsers(50);

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldFail = (failureRate = 0.1) => Math.random() < failureRate;

// API functions
export const api = {
  // Posts
  async getPosts(page = 1, limit = 10): Promise<ApiResponse<Post[]>> {
    await delay(Math.random() * 1000 + 500); // 500-1500ms delay
    
    if (shouldFail(0.05)) { // 5% failure rate
      throw new Error('Failed to fetch posts');
    }
    
    const offset = (page - 1) * limit;
    const data = mockPosts.slice(offset, offset + limit);
    
    return {
      data,
      total: mockPosts.length,
      page,
      limit
    };
  },

  async getPost(id: number): Promise<Post> {
    await delay(Math.random() * 500 + 200);
    
    if (shouldFail(0.03)) {
      throw new Error(`Failed to fetch post ${id}`);
    }
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error(`Post ${id} not found`);
    }
    
    return post;
  },

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<Post> {
    await delay(Math.random() * 800 + 300);
    
    if (shouldFail(0.08)) {
      throw new Error('Failed to create post');
    }
    
    const newPost: Post = {
      ...postData,
      id: Math.max(...mockPosts.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0
    };
    
    mockPosts.unshift(newPost);
    return newPost;
  },

  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    await delay(Math.random() * 600 + 200);
    
    if (shouldFail(0.06)) {
      throw new Error(`Failed to update post ${id}`);
    }
    
    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Post ${id} not found`);
    }
    
    mockPosts[index] = { ...mockPosts[index], ...updates };
    return mockPosts[index];
  },

  async deletePost(id: number): Promise<boolean> {
    await delay(Math.random() * 400 + 200);
    
    if (shouldFail(0.04)) {
      throw new Error(`Failed to delete post ${id}`);
    }
    
    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Post ${id} not found`);
    }
    
    mockPosts.splice(index, 1);
    return true;
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay(Math.random() * 800 + 300);
    
    if (shouldFail(0.03)) {
      throw new Error('Failed to fetch users');
    }
    
    return [...mockUsers];
  },

  async getUser(id: number): Promise<User> {
    await delay(Math.random() * 400 + 200);
    
    if (shouldFail(0.02)) {
      throw new Error(`Failed to fetch user ${id}`);
    }
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    
    return user;
  },

  // Search
  async searchPosts(query: string): Promise<Post[]> {
    await delay(Math.random() * 600 + 400);
    
    if (shouldFail(0.04)) {
      throw new Error('Search failed');
    }
    
    const lowercaseQuery = query.toLowerCase();
    return mockPosts.filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.body.toLowerCase().includes(lowercaseQuery) ||
      post.category.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Analytics
  async getAnalytics(): Promise<{
    totalPosts: number;
    totalUsers: number;
    totalViews: number;
    totalLikes: number;
    popularCategories: Array<{ category: string; count: number }>;
  }> {
    await delay(Math.random() * 1200 + 800);
    
    if (shouldFail(0.02)) {
      throw new Error('Failed to fetch analytics');
    }
    
    const categoryCount = mockPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalPosts: mockPosts.length,
      totalUsers: mockUsers.length,
      totalViews: mockPosts.reduce((sum, post) => sum + post.views, 0),
      totalLikes: mockPosts.reduce((sum, post) => sum + post.likes, 0),
      popularCategories: Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
    };
  }
};

// Fetcher functions for SWR
export const fetchers = {
  posts: (page: number = 1, limit: number = 10) => api.getPosts(page, limit),
  post: (id: number) => api.getPost(id),
  users: () => api.getUsers(),
  user: (id: number) => api.getUser(id),
  search: (query: string) => api.searchPosts(query),
  analytics: () => api.getAnalytics()
}; 