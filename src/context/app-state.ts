import api from '@/api';
import { ServerStatus } from '@/types';

export interface AppState {
  isAuthenticated: boolean;
  token: string;
  username: string;
  password: string;
  autoLogin: boolean;
  autoLoginSuppressed: boolean;
  serverUrl: string;
  serverStatus: ServerStatus | null;
  theme: 'light' | 'dark';
  devMode: boolean;
  loading: boolean;
  error: string;
}

export type AppAction =
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_AUTO_LOGIN'; payload: boolean }
  | {
      type: 'SET_CREDENTIALS';
      payload: {
        serverUrl: string;
        username: string;
        password: string;
      };
    }
  | { type: 'SET_SERVER_URL'; payload: string }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_SERVER_STATUS'; payload: ServerStatus | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_DEV_MODE'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'RESET' };

const getStoredPreferences = (): Pick<AppState, 'theme' | 'devMode' | 'autoLogin'> => {
  if (typeof localStorage === 'undefined') {
    return {
      theme: 'light',
      devMode: false,
      autoLogin: true,
    };
  }

  try {
    const storedTheme = localStorage.getItem('tshock_theme');
    const storedDevMode = localStorage.getItem('tshock_dev_mode');
    const storedAutoLogin = localStorage.getItem('tshock_auto_login');

    return {
      theme: storedTheme === 'dark' ? 'dark' : 'light',
      devMode: storedDevMode === 'true',
      autoLogin: storedAutoLogin !== 'false',
    };
  } catch (error) {
    console.error('Failed to retrieve stored app preferences:', error);
    return {
      theme: 'light',
      devMode: false,
      autoLogin: true,
    };
  }
};

const storedPreferences = getStoredPreferences();

export const initialState: AppState = {
  isAuthenticated: false,
  token: '',
  username: '',
  password: '',
  autoLogin: storedPreferences.autoLogin,
  autoLoginSuppressed: false,
  serverUrl: '',
  serverStatus: null,
  theme: storedPreferences.theme,
  devMode: storedPreferences.devMode,
  loading: true,
  error: '',
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOKEN':
      api.setToken(action.payload);
      return {
        ...state,
        token: action.payload,
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
      };
    case 'SET_AUTO_LOGIN':
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tshock_auto_login', action.payload.toString());
      }
      return {
        ...state,
        autoLogin: action.payload,
      };
    case 'SET_CREDENTIALS':
      api.setBaseURL(action.payload.serverUrl);
      return {
        ...state,
        serverUrl: action.payload.serverUrl,
        username: action.payload.username,
        password: action.payload.password,
      };
    case 'SET_SERVER_URL':
      api.setBaseURL(action.payload);
      return {
        ...state,
        serverUrl: action.payload,
      };
    case 'SET_AUTHENTICATED':
      if (!action.payload) {
        api.setToken('');
      }
      return {
        ...state,
        isAuthenticated: action.payload,
        autoLoginSuppressed: action.payload ? false : state.autoLoginSuppressed,
      };
    case 'SET_SERVER_STATUS':
      return {
        ...state,
        serverStatus: action.payload,
      };
    case 'SET_THEME':
      try {
        localStorage.setItem('tshock_theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Failed to set theme:', error);
      }
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_DEV_MODE':
      localStorage.setItem('tshock_dev_mode', action.payload.toString());
      return {
        ...state,
        devMode: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      api.setToken('');
      return {
        ...state,
        isAuthenticated: false,
        token: '',
        autoLoginSuppressed: true,
        serverStatus: null,
        error: '',
        loading: false,
      };
    case 'RESET':
      api.setToken('');
      api.setBaseURL('');
      return {
        ...state,
        isAuthenticated: false,
        token: '',
        username: '',
        password: '',
        autoLoginSuppressed: false,
        serverUrl: '',
        serverStatus: null,
        error: '',
        loading: false,
      };
    default:
      return state;
  }
}
