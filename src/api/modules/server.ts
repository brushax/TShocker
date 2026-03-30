import {
  ApiResponse,
  ServerStatus,
  ServerMotdResponse,
  ServerRulesResponse,
  MessageResponse,
  CommandResult,
  TokenTestResponse,
} from '@/types';
import { TShockClient } from '@/api/client';

export class ServerModule {
  constructor(private client: TShockClient) {}

  async getStatus(
    includePlayers: boolean = false,
    includeRules: boolean = false
  ): Promise<ApiResponse<ServerStatus>> {
    return this.client.request<ServerStatus>('/v2/server/status', {
      players: includePlayers,
      rules: includeRules,
    });
  }

  async getMotd(): Promise<ApiResponse<ServerMotdResponse>> {
    return this.client.request<ServerMotdResponse>('/v3/server/motd');
  }

  async getRules(): Promise<ApiResponse<ServerRulesResponse>> {
    return this.client.request<ServerRulesResponse>('/v3/server/rules');
  }

  async broadcast(message: string): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/server/broadcast', { msg: message });
  }

  async executeRawCommand(command: string): Promise<ApiResponse<CommandResult>> {
    return this.client.request<CommandResult>('/v3/server/rawcmd', { cmd: command });
  }

  async reload(): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v3/server/reload');
  }

  async shutdown(
    confirm: boolean,
    message?: string,
    nosave?: boolean
  ): Promise<ApiResponse<MessageResponse>> {
    return this.client.request<MessageResponse>('/v2/server/off', {
      confirm,
      message,
      nosave,
    });
  }

  async validateToken(): Promise<ApiResponse<TokenTestResponse>> {
    return this.client.request<TokenTestResponse>('/tokentest');
  }
}
