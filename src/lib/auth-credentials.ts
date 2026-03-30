export interface StoredCredentials {
  serverUrl: string;
  username: string;
  password: string;
  token?: string | null;
}

const hasProtocol = (value: string) => /^https?:\/\//i.test(value);

const credentialErrorPatterns = [
  'username or password may be incorrect',
  'invalid username or password',
  'insufficient permissions',
  'insufficient privileges',
  'not authorized',
  'token was not valid',
  'provided token became invalid',
  '用户名或密码错误',
  '权限不足',
];

export function normalizeServerUrl(input: string): string {
  const trimmed = input.trim();
  const withProtocol = hasProtocol(trimmed) ? trimmed : `http://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

export function isCredentialError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : error == null
          ? ''
          : String(error);

  const normalized = message.toLowerCase();
  return credentialErrorPatterns.some((pattern) => normalized.includes(pattern));
}

export function sanitizeStoredCredentials(value: unknown): StoredCredentials | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const serverUrl = typeof candidate.serverUrl === 'string' ? normalizeServerUrl(candidate.serverUrl) : '';
  const username = typeof candidate.username === 'string' ? candidate.username.trim() : '';
  const password = typeof candidate.password === 'string' ? candidate.password : '';
  const token =
    candidate.token == null
      ? null
      : typeof candidate.token === 'string'
        ? candidate.token.trim() || null
        : null;

  if (!serverUrl || !username || !password) {
    return null;
  }

  return {
    serverUrl,
    username,
    password,
    token,
  };
}
