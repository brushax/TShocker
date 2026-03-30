import { TShockResponse } from './api';

export interface ServerStatus extends TShockResponse {
  name: string;
  serverversion: string;
  tshockversion: string;
  port: number;
  playercount: number;
  maxplayers: number;
  world: string;
  uptime: string;
  serverpassword: boolean;
}

export interface ServerMotdResponse extends TShockResponse {
  motd: string[];
}

export interface ServerRulesResponse extends TShockResponse {
  rules: string[];
}
