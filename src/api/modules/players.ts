import { ApiResponse, PlayersResponse, PlayerDetail, MessageResponse } from '@/types';
import { TShockClient } from '@/api/client';
import type { TShockAPI } from '@/api/index';

export class PlayerModule {
  constructor(
    private client: TShockClient,
    private api: TShockAPI
  ) {}

  async list(
    filterParams: Record<string, string | number | boolean> = {}
  ): Promise<ApiResponse<PlayersResponse>> {
    return this.client.request<PlayersResponse>('/v2/players/list', filterParams);
  }

  async read(player: string): Promise<ApiResponse<PlayerDetail>> {
    return this.client.request<PlayerDetail>('/v3/players/read', { player });
  }

  async kick(player: string, reason?: string): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/players/kick', { player, reason });
  }

  async ban(params: {
    name?: string;
    ip?: string;
    reason?: string;
  }): Promise<ApiResponse<MessageResponse>> {
    const identifier = params.ip ? `ip:${params.ip}` : `name:${params.name}`;
    if (!params.ip && !params.name) {
      throw new Error('Ban player requires an identification (Name or IP)');
    }
    return this.api.bans.create({
      identifier,
      reason: params.reason,
    });
  }

  async kill(player: string, from: string = 'Server Admin'): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/players/kill', { player, from });
  }

  async mute(player: string): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/players/mute', { player });
  }

  async unmute(player: string): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/players/unmute', { player });
  }
}
