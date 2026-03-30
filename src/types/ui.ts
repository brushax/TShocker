import { ReactNode } from 'react';
import { User } from './user';
import { ServerStatus } from './server';

export interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  path: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  serverUrl: string | null;
  loading: boolean;
  serverStatus?: ServerStatus | null;
  username?: string | null;
}

export interface ApiError {
  status: string;
  error: string;
}
