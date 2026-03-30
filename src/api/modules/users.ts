import { ApiResponse, UsersResponse, UserInfoResponse, MessageResponse } from '@/types';
import { TShockClient } from '@/api/client';

export class UserModule {
  constructor(private client: TShockClient) {}

  async list(): Promise<ApiResponse<UsersResponse>> {
    return this.client.request<UsersResponse>('/v2/users/list');
  }

  async activeList(): Promise<ApiResponse<{ activeusers: string }>> {
    return this.client.request<{ activeusers: string }>('/v2/users/activelist');
  }

  async read(user: string, type: 'name' | 'id' = 'name'): Promise<ApiResponse<UserInfoResponse>> {
    return this.client.request<UserInfoResponse>('/v2/users/read', { user, type });
  }

  async create(
    user: string,
    password: string,
    group?: string
  ): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/users/create', { user, password, group });
  }

  async update(params: {
    user: string;
    type: 'name' | 'id';
    password?: string;
    group?: string;
  }): Promise<ApiResponse<Record<string, string>>> {
    return this.client.request<Record<string, string>>('/v2/users/update', params);
  }

  async destroy(user: string, type: 'name' | 'id' = 'name'): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/users/destroy', { user, type });
  }
}
