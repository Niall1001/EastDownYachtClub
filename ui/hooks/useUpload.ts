import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { ApiResponse, UploadResponse } from '../types/api';

interface UseUploadReturn {
  uploadFile: (file: File) => Promise<UploadResponse | null>;
  uploadEventDocument: (eventId: string, file: File) => Promise<UploadResponse | null>;
  isUploading: boolean;
  error: string | null;
  uploadProgress: number;
}

export const useUpload = (): UseUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Note: The uploadProgress isn't fully implemented in the basic version
      // You could enhance this with XMLHttpRequest to track progress
      const response: ApiResponse<UploadResponse> = await apiClient.upload('/upload', formData);

      if (response.success && response.data) {
        setUploadProgress(100);
        return response.data;
      } else {
        setError(response.error || 'Failed to upload file');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadEventDocument = useCallback(async (eventId: string, file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: ApiResponse<UploadResponse> = await apiClient.upload(`/upload/events/${eventId}/documents`, formData);

      if (response.success && response.data) {
        setUploadProgress(100);
        return response.data;
      } else {
        setError(response.error || 'Failed to upload event document');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload event document';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    uploadFile,
    uploadEventDocument,
    isUploading,
    error,
    uploadProgress,
  };
};

// Enhanced upload hook with progress tracking
export const useUploadWithProgress = (): UseUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadWithProgress = useCallback(async (
    endpoint: string, 
    formData: FormData
  ): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        setIsUploading(false);
        setUploadProgress(0);

        try {
          const response = JSON.parse(xhr.responseText) as ApiResponse<UploadResponse>;
          if (xhr.status >= 200 && xhr.status < 300 && response.success && response.data) {
            resolve(response.data);
          } else {
            setError(response.error || `HTTP error! status: ${xhr.status}`);
            resolve(null);
          }
        } catch (err) {
          setError('Failed to parse response');
          resolve(null);
        }
      });

      xhr.addEventListener('error', () => {
        setIsUploading(false);
        setUploadProgress(0);
        setError('Upload failed');
        resolve(null);
      });

      xhr.addEventListener('abort', () => {
        setIsUploading(false);
        setUploadProgress(0);
        setError('Upload aborted');
        resolve(null);
      });

      // Set up the request
      const baseUrl = import.meta.env.MODE === 'development' 
        ? 'http://localhost:3001/api'
        : import.meta.env.VITE_API_URL || '/api';
      
      xhr.open('POST', `${baseUrl}${endpoint}`);

      // Add authorization header if token exists
      const token = localStorage.getItem('yacht_club_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<UploadResponse | null> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadWithProgress('/upload', formData);
  }, [uploadWithProgress]);

  const uploadEventDocument = useCallback(async (eventId: string, file: File): Promise<UploadResponse | null> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadWithProgress(`/upload/events/${eventId}/documents`, formData);
  }, [uploadWithProgress]);

  return {
    uploadFile,
    uploadEventDocument,
    isUploading,
    error,
    uploadProgress,
  };
};