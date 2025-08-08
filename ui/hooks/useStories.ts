import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { 
  ApiResponse, 
  Story, 
  CreateStoryData, 
  UpdateStoryData,
  QueryParams 
} from '../types/api';

interface UseStoriesReturn {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  fetchStories: (params?: QueryParams) => Promise<void>;
  createStory: (data: CreateStoryData) => Promise<Story | null>;
  updateStory: (id: string, data: UpdateStoryData) => Promise<Story | null>;
  deleteStory: (id: string) => Promise<boolean>;
  refreshStories: () => Promise<void>;
}

export const useStories = (initialParams?: QueryParams): UseStoriesReturn => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastParams, setLastParams] = useState<QueryParams | undefined>(initialParams);

  const fetchStories = useCallback(async (params?: QueryParams): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      
      const endpoint = `/stories${queryString ? `?${queryString}` : ''}`;
      const response: any = await apiClient.get(endpoint);
      
      if (response.success && response.data) {
        // Extract stories array from nested data structure
        const stories = response.data.stories || [];
        setStories(stories);
        
        // Calculate pagination from response data
        const total = response.data.total || 0;
        const limit = response.data.limit || 10;
        const offset = response.data.offset || 0;
        const currentPage = Math.floor(offset / limit) + 1;
        const totalPages = Math.ceil(total / limit);
        
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setTotal(total);
        setLastParams(params);
      } else {
        setError(response.error || 'Failed to fetch stories');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stories';
      // If it's an authentication error, provide a more helpful message
      if (errorMessage.includes('token') || errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setError('Authentication required. Please log in to view stories.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStory = useCallback(async (data: CreateStoryData): Promise<Story | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Story> = await apiClient.post('/stories', data);
      
      if (response.success && response.data) {
        // Refresh the stories list after creating
        await fetchStories(lastParams);
        return response.data;
      } else {
        setError(response.error || 'Failed to create story');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create story';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStories, lastParams]);

  const updateStory = useCallback(async (id: string, data: UpdateStoryData): Promise<Story | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Story> = await apiClient.put(`/stories/${id}`, data);
      
      if (response.success && response.data) {
        // Update the story in the local state
        setStories(prev => prev.map(story => 
          story.id === id ? response.data! : story
        ));
        return response.data;
      } else {
        setError(response.error || 'Failed to update story');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update story';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteStory = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse = await apiClient.delete(`/stories/${id}`);
      
      if (response.success) {
        // Remove the story from local state
        setStories(prev => prev.filter(story => story.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete story');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete story';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStories = useCallback(async (): Promise<void> => {
    await fetchStories(lastParams);
  }, [fetchStories, lastParams]);

  // Initial fetch - Fixed infinite loop by serializing params for comparison
  useEffect(() => {
    fetchStories(initialParams);
  }, [fetchStories, JSON.stringify(initialParams)]);

  return {
    stories,
    isLoading,
    error,
    totalPages,
    currentPage,
    total,
    fetchStories,
    createStory,
    updateStory,
    deleteStory,
    refreshStories,
  };
};

interface UseStoryReturn {
  story: Story | null;
  isLoading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  fetchStoryBySlug: (slug: string) => Promise<void>;
}

export const useStory = (id?: string): UseStoryReturn => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async (storyId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Story> = await apiClient.get(`/stories/${storyId}`);
      
      if (response.success && response.data) {
        setStory(response.data);
      } else {
        setError(response.error || 'Failed to fetch story');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch story';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStoryBySlug = useCallback(async (slug: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Search for story by slug using the search query param
      const response: any = await apiClient.get(`/stories?search=${encodeURIComponent(slug)}&limit=1`);
      
      if (response.success && response.data && response.data.stories && response.data.stories.length > 0) {
        // Find exact slug match from search results
        const matchingStory = response.data.stories.find((s: any) => s.slug === slug);
        if (matchingStory) {
          setStory(matchingStory);
        } else {
          setError('Story not found');
        }
      } else {
        setError('Story not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch story';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch if ID is provided
  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id, fetchStory]);

  return {
    story,
    isLoading,
    error,
    fetchStory,
    fetchStoryBySlug,
  };
};