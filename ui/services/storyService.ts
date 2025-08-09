import { apiClient } from './api';

export interface CreateStoryRequest {
  title: string;
  excerpt: string;
  content: string;
  storyType: string;
  authorName: string;
  featuredImageUrl?: string;
  published?: boolean;
  tags?: string[];
  eventId?: string;
}

export interface UpdateStoryRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  storyType?: string;
  authorName?: string;
  featuredImageUrl?: string;
  published?: boolean;
  tags?: string[];
  eventId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  story_type: string;
  author_name?: string;
  featured_image_url?: string;
  published: boolean;
  publish_date?: string;
  tags?: string[];
  event_id?: string;
  created_at: string;
  updated_at: string;
}

export const storyService = {
  async createStory(data: CreateStoryRequest): Promise<ApiResponse<Story>> {
    return apiClient.post<ApiResponse<Story>>('/stories', data);
  },

  async updateStory(id: string, data: UpdateStoryRequest): Promise<ApiResponse<Story>> {
    return apiClient.put<ApiResponse<Story>>(`/stories/${id}`, data);
  },

  async deleteStory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/stories/${id}`);
  },

  async getStory(id: string): Promise<ApiResponse<Story>> {
    return apiClient.get<ApiResponse<Story>>(`/stories/${id}`);
  },

  async getStoryBySlug(slug: string): Promise<ApiResponse<Story>> {
    return apiClient.get<ApiResponse<Story>>(`/stories/${slug}`);
  }
};