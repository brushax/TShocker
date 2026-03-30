import { describe, expect, it } from 'vitest';

import { isCredentialError, normalizeServerUrl, sanitizeStoredCredentials } from './auth-credentials';

describe('normalizeServerUrl', () => {
  it('adds a default protocol and trims trailing slashes', () => {
    expect(normalizeServerUrl('example.com///')).toBe('http://example.com');
  });

  it('preserves an explicit protocol', () => {
    expect(normalizeServerUrl('https://example.com/server/')).toBe('https://example.com/server');
  });
});

describe('sanitizeStoredCredentials', () => {
  it('returns a normalized credential payload when all required fields are present', () => {
    expect(
      sanitizeStoredCredentials({
        serverUrl: 'demo.example.com/',
        username: 'owner',
        password: 'secret',
        token: 'cached-token',
      })
    ).toEqual({
      serverUrl: 'http://demo.example.com',
      username: 'owner',
      password: 'secret',
      token: 'cached-token',
    });
  });

  it('rejects malformed payloads', () => {
    expect(
      sanitizeStoredCredentials({
        serverUrl: 'demo.example.com',
        username: 'owner',
        password: '',
      })
    ).toBeNull();
  });
});

describe('isCredentialError', () => {
  it('detects credential-related TShock errors', () => {
    expect(
      isCredentialError(
        new Error('Username or password may be incorrect or this account may not have sufficient privileges.')
      )
    ).toBe(true);
    expect(isCredentialError('Not authorized. The specified API endpoint requires a token.')).toBe(
      true
    );
  });

  it('ignores network failures', () => {
    expect(isCredentialError(new Error('Failed to fetch'))).toBe(false);
  });
});
