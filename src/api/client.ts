import { fetch } from '@tauri-apps/plugin-http';
import { ApiResponse } from '@/types';

/**
 * TShock API Client - Base request handler class
 */
export class TShockClient {
  private baseURL: string = '';
  private token: string = '';

  constructor(serverUrl: string = '', token: string = '') {
    this.baseURL = serverUrl;
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  getToken() {
    return this.token;
  }

  getBaseURL() {
    return this.baseURL;
  }

  /**
   * Generic request method with error handling and logging
   */
  async request<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined | null> = {},
    method: 'GET' | 'POST' = 'GET'
  ): Promise<ApiResponse<T>> {
    try {
      if (!this.baseURL) {
        throw new Error('Server URL not set');
      }

      const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
      const url = new URL(base + endpoint);

      if (this.token) {
        url.searchParams.append('token', this.token);
      }

      Object.keys(params).forEach((key) => {
        const val = params[key];
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, val.toString());
        }
      });

      const response = await fetch(url.toString(), {
        method,
        connectTimeout: 10000,
      });

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = (await response.json()) as T;
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text) as T;
        } catch {
          data = {
            status: response.status.toString(),
            error: text || `Server returned error status: ${response.status}`,
          } as unknown as T;
        }
      }

      return {
        status: response.status.toString(),
        data: data,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage || 'Unknown network error', { cause: error });
    }
  }
}
