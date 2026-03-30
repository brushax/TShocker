import { TShockResponse } from './api';

export interface WorldInfo extends TShockResponse {
  name: string;
  size: string;
  time: number;
  daytime: boolean;
  bloodmoon: boolean;
  invasionsize: number;
}

export interface NPC {
  id: number;
  name: string;
  internal_name: string;
}

export interface Item {
  id: number;
  name: string;
  internal_name: string;
}
