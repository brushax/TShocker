import { fetch } from '@tauri-apps/plugin-http';
import { TShockClient } from './client';
import { ServerModule } from './modules/server';
import { PlayerModule } from './modules/players';
import { UserModule } from './modules/users';
import { GroupModule } from './modules/groups';
import { BanModule } from './modules/bans';
import { WorldModule } from './modules/world';

/**
 * TShock API Main Entry class
 */
export class TShockAPI {
  private client: TShockClient;

  public readonly server: ServerModule;
  public readonly players: PlayerModule;
  public readonly users: UserModule;
  public readonly groups: GroupModule;
  public readonly bans: BanModule;
  public readonly world: WorldModule;

  constructor(serverUrl: string = '', token: string = '') {
    this.client = new TShockClient(serverUrl, token);

    this.server = new ServerModule(this.client);
    this.bans = new BanModule(this.client);
    this.players = new PlayerModule(this.client, this);
    this.users = new UserModule(this.client);
    this.groups = new GroupModule(this.client);
    this.world = new WorldModule(this.client);
  }

  setToken(token: string) {
    this.client.setToken(token);
  }

  setBaseURL(url: string) {
    this.client.setBaseURL(url);
  }

  /**
   * Attempt to login. If a valid token exists for the same user, reuse it to avoid server rate limits.
   */
  async login(username: string, password: string): Promise<string> {
    const baseURL = this.client.getBaseURL();
    if (!baseURL) throw new Error('Server URL not set');

    // 1. Check for existing token
    const currentToken = this.client.getToken();
    if (currentToken) {
      try {
        // Try to validate existing token
        const res = await this.server.validateToken();
        // If token is valid and associated user matches, reuse it
        if (res.status === '200' && res.data.associateduser === username) {
          return currentToken;
        }
      } catch {
        // Continue to create new token if validation fails
      }
    }

    // 2. Create new token if none exist or validation failed
    const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    const url = new URL(base + '/v2/token/create');
    url.searchParams.append('username', username);
    url.searchParams.append('password', password);

    const response = await fetch(url.toString(), {
      method: 'GET',
      connectTimeout: 10000,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server response format error: ${text.substring(0, 100)}`, { cause: e });
    }

    if (data.status === '200' && data.token) {
      this.setToken(data.token);
      return data.token;
    } else {
      throw new Error(data.error || data.status || 'Invalid username or password');
    }
  }
}

const api = new TShockAPI();
export default api;
