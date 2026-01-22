import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  customer: { id: '1', email: 'customer@grocerai.com', name: 'John Doe', role: 'customer' },
  store_owner: { id: '2', email: 'store@grocerai.com', name: 'Sarah Smith', role: 'store_owner' },
  delivery: { id: '3', email: 'delivery@grocerai.com', name: 'Alex Driver', role: 'delivery' },
  admin: { id: '4', email: 'admin@grocerai.com', name: 'Admin User', role: 'admin' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock login - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
