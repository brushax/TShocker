import { describe, expect, it } from 'vitest';

import { canAttemptAutoLogin } from './login-auto';

describe('canAttemptAutoLogin', () => {
  it('allows one startup login attempt when credentials and preference are present', () => {
    expect(
      canAttemptAutoLogin({
        loading: false,
        isAuthenticated: false,
        autoLogin: true,
        hasAttempted: false,
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      })
    ).toBe(true);
  });

  it('rejects attempts when auto-login is disabled', () => {
    expect(
      canAttemptAutoLogin({
        loading: false,
        isAuthenticated: false,
        autoLogin: false,
        hasAttempted: false,
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      })
    ).toBe(false);
  });

  it('rejects attempts after one startup try has already happened', () => {
    expect(
      canAttemptAutoLogin({
        loading: false,
        isAuthenticated: false,
        autoLogin: true,
        hasAttempted: true,
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      })
    ).toBe(false);
  });

  it('rejects attempts when auto-login is suppressed for the current session', () => {
    expect(
      canAttemptAutoLogin({
        loading: false,
        isAuthenticated: false,
        autoLogin: true,
        hasAttempted: false,
        autoLoginSuppressed: true,
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      })
    ).toBe(false);
  });
});
