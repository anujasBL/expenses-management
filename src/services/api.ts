/**
 * Generic API service for handling CRUD operations on any entity type
 * Implements the standard API endpoints: GET_ALL, GET_BY_ID, SAVE_NEW, UPDATE, DELETE
 */

import { ApiConfig, ApiRequestOptions, ApiResponse, PaginatedResponse, BaseEntity, EntityCreateData, EntityUpdateData } from '@/types';
import { APP_CONFIG } from '@/constants';

class ApiService {
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseUrl: APP_CONFIG.apiBaseUrl,
      timeout: APP_CONFIG.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
  }

  /**
   * Generic method to make HTTP requests
   */
  private async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const requestOptions: RequestInit = {
      method: options.method,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout),
    };

    if (options.body && options.method !== 'GET') {
      requestOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generic GET_ALL operation for any entity
   * GET /{entity}
   */
  async getAll<T extends BaseEntity>(
    entity: string,
    params?: Record<string, string | number | boolean>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.makeRequest<PaginatedResponse<T>>(
      `/${entity}`,
      {
        method: 'GET',
        params,
      }
    );
    return response.data;
  }

  /**
   * Generic GET_BY_ID operation for any entity
   * GET /{entity}/{item_id}
   */
  async getById<T extends BaseEntity>(
    entity: string,
    id: string
  ): Promise<T> {
    const response = await this.makeRequest<T>(
      `/${entity}/${id}`,
      {
        method: 'GET',
      }
    );
    return response.data;
  }

  /**
   * Generic SAVE_NEW operation for any entity
   * POST /{entity}
   */
  async saveNew<T extends BaseEntity>(
    entity: string,
    data: EntityCreateData<T>
  ): Promise<T> {
    const response = await this.makeRequest<T>(
      `/${entity}`,
      {
        method: 'POST',
        body: data,
      }
    );
    return response.data;
  }

  /**
   * Generic UPDATE operation for any entity
   * PUT /{entity}/{item_id}
   */
  async update<T extends BaseEntity>(
    entity: string,
    data: EntityUpdateData<T>
  ): Promise<T> {
    const { id, ...updateData } = data;
    const response = await this.makeRequest<T>(
      `/${entity}/${id}`,
      {
        method: 'PUT',
        body: updateData,
      }
    );
    return response.data;
  }

  /**
   * Generic DELETE operation for any entity
   * DELETE /{entity}/{item_id}
   */
  async delete(entity: string, id: string): Promise<void> {
    await this.makeRequest(
      `/${entity}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Generic PATCH operation for partial updates
   * PATCH /{entity}/{item_id}
   */
  async patch<T extends BaseEntity>(
    entity: string,
    data: EntityUpdateData<T>
  ): Promise<T> {
    const { id, ...patchData } = data;
    const response = await this.makeRequest<T>(
      `/${entity}/${id}`,
      {
        method: 'PATCH',
        body: patchData,
      }
    );
    return response.data;
  }

  /**
   * Set custom headers for authentication or other purposes
   */
  setHeaders(headers: Record<string, string>): void {
    this.config.headers = { ...this.config.headers, ...headers };
  }

  /**
   * Update base URL (useful for environment switching)
   */
  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  /**
   * Update timeout configuration
   */
  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export { ApiService };

// Convenience functions for common operations
export const api = {
  // Expense operations
  expenses: {
    getAll: (params?: Record<string, string | number | boolean>) =>
      apiService.getAll('expenses', params),
    getById: (id: string) => apiService.getById('expenses', id),
    saveNew: (data: any) => apiService.saveNew('expenses', data),
    update: (data: any) => apiService.update('expenses', data),
    delete: (id: string) => apiService.delete('expenses', id),
    patch: (data: any) => apiService.patch('expenses', data),
  },

  // Category operations
  categories: {
    getAll: (params?: Record<string, string | number | boolean>) =>
      apiService.getAll('categories', params),
    getById: (id: string) => apiService.getById('categories', id),
    saveNew: (data: any) => apiService.saveNew('categories', data),
    update: (data: any) => apiService.update('categories', data),
    delete: (id: string) => apiService.delete('categories', id),
    patch: (data: any) => apiService.patch('categories', data),
  },

  // Generic entity operations
  entity: <T extends BaseEntity>(entityName: string) => ({
    getAll: (params?: Record<string, string | number | boolean>) =>
      apiService.getAll<T>(entityName, params),
    getById: (id: string) => apiService.getById<T>(entityName, id),
    saveNew: (data: EntityCreateData<T>) => apiService.saveNew<T>(entityName, data),
    update: (data: EntityUpdateData<T>) => apiService.update<T>(entityName, data),
    delete: (id: string) => apiService.delete(entityName, id),
    patch: (data: EntityUpdateData<T>) => apiService.patch<T>(entityName, data),
  }),
};
