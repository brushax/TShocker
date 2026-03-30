import { ApiResponse, BansResponse, MessageResponse } from '@/types';
import { TShockClient } from '@/api/client';

export class BanModule {
  constructor(private client: TShockClient) {}

  async list(): Promise<ApiResponse<BansResponse>> {
    return this.client.request<BansResponse>('/v3/bans/list');
  }

  async read(ticketNumber: number): Promise<ApiResponse<unknown>> {
    return this.client.request<unknown>('/v3/bans/read', { ticketNumber });
  }

  async create(params: {
    identifier: string;
    reason?: string;
    start?: string;
    end?: string;
  }): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v3/bans/create', params);
  }

  async destroy(
    ticketNumber: number,
    fullDelete: boolean = false
  ): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v3/bans/destroy', { ticketNumber, fullDelete });
  }
}
