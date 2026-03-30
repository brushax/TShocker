import { normalizeServerUrl } from '@/lib/auth-credentials';
import type { AppAction } from '@/context/app-state';

interface LoginContextApi {
  setBaseURL(url: string): void;
}

interface PrimeLoginContextOptions {
  api: LoginContextApi;
  dispatch: React.Dispatch<AppAction>;
  serverUrl: string;
  username: string;
}

export function primeLoginContext({
  api,
  dispatch,
  serverUrl,
  username,
}: PrimeLoginContextOptions): {
  serverUrl: string;
  username: string;
} {
  const normalizedServerUrl = normalizeServerUrl(serverUrl || '');
  const nextUsername = username.trim();

  api.setBaseURL(normalizedServerUrl);
  dispatch({ type: 'SET_SERVER_URL', payload: normalizedServerUrl });

  return {
    serverUrl: normalizedServerUrl,
    username: nextUsername,
  };
}
