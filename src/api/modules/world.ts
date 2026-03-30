import { ApiResponse, WorldInfo, MessageResponse } from '@/types';
import { TShockClient } from '@/api/client';

export class WorldModule {
  constructor(private client: TShockClient) {}

  async read(): Promise<ApiResponse<WorldInfo>> {
    return this.client.request<WorldInfo>('/world/read');
  }

  async save(): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/world/save');
  }

  async butcher(killfriendly: boolean = false): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/world/butcher', { killfriendly });
  }

  async meteor(): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/world/meteor');
  }

  async setBloodmoon(state: boolean): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v3/world/bloodmoon', { state });
  }

  async setAutosave(state: boolean): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v3/world/autosave', { state });
  }

  async triggerEvent(eventName: string): Promise<ApiResponse<MessageResponse>> {
    // We use v2/server/rawcmd as a fallback for world events if specific endpoints aren't used
    // But since we want to return a consistent response, we'll map it.
    return this.client.request<MessageResponse>('/v3/server/rawcmd', {
      cmd: `/worldevent ${eventName}`,
    });
  }
}
