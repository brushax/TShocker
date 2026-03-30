import { invoke } from '@tauri-apps/api/core';

import { sanitizeStoredCredentials, type StoredCredentials } from '@/lib/auth-credentials';

function isUnavailableTauriBridge(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : error == null
          ? ''
          : String(error);

  const normalized = message.toLowerCase();

  return (
    normalized.includes('__tauri_internals__') ||
    normalized.includes("reading 'invoke'") ||
    normalized.includes("reading \"invoke\"") ||
    normalized.includes('is not a function')
  );
}

export async function loadSecureCredentials(): Promise<StoredCredentials | null> {
  try {
    const payload = await invoke<StoredCredentials | null>('load_credentials');
    return sanitizeStoredCredentials(payload);
  } catch (error) {
    if (isUnavailableTauriBridge(error)) {
      return null;
    }

    throw error;
  }
}

export async function saveSecureCredentials(credentials: StoredCredentials): Promise<void> {
  const sanitized = sanitizeStoredCredentials(credentials);
  if (!sanitized) {
    throw new Error('Invalid credential payload.');
  }

  try {
    await invoke('save_credentials', { credentials: sanitized });
  } catch (error) {
    if (isUnavailableTauriBridge(error)) {
      return;
    }

    throw error;
  }
}

export async function clearSecureCredentials(): Promise<void> {
  try {
    await invoke('clear_credentials');
  } catch (error) {
    if (isUnavailableTauriBridge(error)) {
      return;
    }

    throw error;
  }
}
