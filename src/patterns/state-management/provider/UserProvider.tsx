'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

// Types
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

// Initial state
const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

// Reducer
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
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    default:
      return state;
  }
}

// Context
interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  // Action helpers
  login: (user: User) => void;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  fetchUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Action helpers with useCallback to prevent infinite re-renders
  const login = useCallback((user: User) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const deleteUser = useCallback((id: string) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  }, []);

  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    state,
    dispatch,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Export types for external use
export type { User, UserState }; 