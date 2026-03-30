import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

import { invoke } from '@tauri-apps/api/core';

import { loadSecureCredentials, saveSecureCredentials } from './secure-storage';

const mockedInvoke = vi.mocked(invoke);

describe('saveSecureCredentials', () => {
  beforeEach(() => {
    mockedInvoke.mockReset();
  });

  it('attempts secure storage writes without relying on a global tauri flag', async () => {
    mockedInvoke.mockResolvedValue(undefined);

    await saveSecureCredentials({
      serverUrl: 'demo.example.com/',
      username: 'owner',
      password: 'secret',
      token: 'cached-token',
    });

    expect(mockedInvoke).toHaveBeenCalledWith('save_credentials', {
      credentials: {
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
        token: 'cached-token',
      },
    });
  });

  it('treats a missing Tauri bridge as unavailable secure storage', async () => {
    mockedInvoke.mockRejectedValue(new TypeError("Cannot read properties of undefined (reading 'invoke')"));

    await expect(loadSecureCredentials()).resolves.toBeNull();
  });
});
