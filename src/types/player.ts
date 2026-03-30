import { TShockResponse } from './api';

export interface Player {
  nickname: string;
  username: string;
  group: string;
  active: boolean;
  muted?: boolean;
  state: number;
  team: number;
  ip?: string;
}

export interface PlayersResponse extends TShockResponse {
  players: Player[];
}

export interface PlayerDetail extends TShockResponse {
  status: string;
  nickname: string;
  username: string | null;
  ip?: string;
  group: string;
  registered: string | null;
  muted: boolean;
  position: string;
  inventory: string;
  armor: string;
  dyes: string;
  buffs: string;
}
