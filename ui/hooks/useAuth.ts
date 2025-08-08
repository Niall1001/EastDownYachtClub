import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  User 
} from '../types/api';

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  getCurrentUser: () => Promise<User | null>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Store the token
        localStorage.setItem('yacht_club_token', response.data.token);
        localStorage.setItem('yacht_club_user', JSON.stringify(response.data.user));
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Even if logout fails on server, we still clear local storage
      console.error('Logout error:', err);
    } finally {
      // Always clear local storage
      localStorage.removeItem('yacht_club_token');
      localStorage.removeItem('yacht_club_user');
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post('/auth/refresh');
      
      if (response.success && response.data) {
        localStorage.setItem('yacht_club_token', response.data.token);
        localStorage.setItem('yacht_club_user', JSON.stringify(response.data.user));
        return true;
      } else {
        setError(response.error || 'Token refresh failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<User> = await apiClient.get('/auth/me');
      
      if (response.success && response.data) {
        localStorage.setItem('yacht_club_user', JSON.stringify(response.data));
        return response.data;
      } else {
        setError(response.error || 'Failed to get current user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    logout,
    refreshToken,
    getCurrentUser,
    isLoading,
    error,
  };
};