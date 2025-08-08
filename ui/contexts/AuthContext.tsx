import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const authHook = useAuthHook();

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('yacht_club_user');
      const savedToken = localStorage.getItem('yacht_club_token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Verify the user is still valid by fetching current user info
          try {
            const currentUser = await authHook.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
            }
          } catch (error) {
            // If verification fails, clear stored data
            console.error('Failed to verify stored user:', error);
            localStorage.removeItem('yacht_club_user');
            localStorage.removeItem('yacht_club_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('yacht_club_user');
          localStorage.removeItem('yacht_club_token');
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [authHook]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const success = await authHook.login({ username, password });
    if (success) {
      const savedUser = localStorage.getItem('yacht_club_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user after login:', error);
        }
      }
    }
    return success;
  };

  const logout = async (): Promise<void> => {
    await authHook.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const currentUser = await authHook.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading: isInitializing || authHook.isLoading,
    error: authHook.error,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};