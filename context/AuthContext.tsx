
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (userData: Omit<User, 'id' | 'credits' | 'passwordHash'> & { password: string }) => Promise<boolean>;
  signOut: () => void;
  addCredits: (amount: number) => void;
  useCredit: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy password hashing function for simulation
const simpleHash = (password: string) => `hashed_${password}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const parsedUser: User = JSON.parse(loggedInUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncUserStorage = useCallback((updatedUser: User | null) => {
    if (updatedUser) {
      // Update the master list of users
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex > -1) {
        users[userIndex] = updatedUser;
      }
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update the currently logged-in user
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.passwordHash === simpleHash(password));

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signUp = async (userData: Omit<User, 'id' | 'credits' | 'passwordHash'> & { password: string }): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === userData.username)) {
      return false; // Username exists
    }
    
    const newUser: User = {
      id: new Date().toISOString(),
      ...userData,
      passwordHash: simpleHash(userData.password),
      credits: 5 // 5 free credits on signup
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('loggedInUser');
  };

  const addCredits = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, credits: user.credits + amount };
      setUser(updatedUser);
      syncUserStorage(updatedUser);
    }
  };

  const useCredit = () => {
    if (user && user.credits > 0) {
      const updatedUser = { ...user, credits: user.credits - 1 };
      setUser(updatedUser);
      syncUserStorage(updatedUser);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, signIn, signUp, signOut, addCredits, useCredit }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
