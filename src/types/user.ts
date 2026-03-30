import { TShockResponse } from './api';

export interface User {
  id: number;
  name: string;
  group: string;
}

export interface UserInfoResponse extends User, TShockResponse {}

export interface UsersResponse extends TShockResponse {
  users: User[];
}

export interface Group {
  name: string;
  parent: string;
  chatcolor: string;
  permissions?: string[];
  negatedpermissions?: string[];
  totalpermissions?: string[];
}

export interface GroupInfoResponse extends Group, TShockResponse {}

export interface GroupsResponse extends TShockResponse {
  groups: Group[];
}

export interface Ban {
  ticket_number: number;
  identifier: string;
  reason: string;
  banning_user: string;
  start_date_ticks: number;
  end_date_ticks: number;
}

export interface BansResponse extends TShockResponse {
  bans: Ban[];
}
