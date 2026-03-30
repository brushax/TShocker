import { ApiResponse, GroupsResponse, GroupInfoResponse, MessageResponse } from '@/types';
import { TShockClient } from '@/api/client';

export class GroupModule {
  constructor(private client: TShockClient) {}

  async list(): Promise<ApiResponse<GroupsResponse>> {
    return this.client.request<GroupsResponse>('/v2/groups/list');
  }

  async read(group: string): Promise<ApiResponse<GroupInfoResponse>> {
    return this.client.request<GroupInfoResponse>('/v2/groups/read', { group });
  }

  async create(params: {
    group: string;
    parent?: string;
    permissions?: string;
    chatcolor?: string;
  }): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/groups/create', params);
  }

  async update(params: {
    group: string;
    parent?: string;
    chatcolor?: string;
    permissions?: string;
  }): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/groups/update', params);
  }

  async destroy(group: string): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/groups/destroy', { group });
  }
}
