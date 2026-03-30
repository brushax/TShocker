import { describe, expect, it } from 'vitest';

import { appReducer, initialState } from './app-state';

describe('appReducer credential state', () => {
  it('defaults auto-login to enabled', () => {
    expect(initialState.autoLogin).toBe(true);
  });

  it('retains restored credentials for login recovery flows', () => {
    const nextState = appReducer(initialState, {
      type: 'SET_CREDENTIALS',
      payload: {
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      },
    });

    expect(nextState.serverUrl).toBe('http://demo.example.com');
    expect(nextState.username).toBe('owner');
    expect(nextState.password).toBe('secret');
  });

  it('updates the auto-login preference', () => {
    const nextState = appReducer(initialState, {
      type: 'SET_AUTO_LOGIN',
      payload: false,
    });

    expect(nextState.autoLogin).toBe(false);
  });

  it('preserves saved credentials on logout while clearing the active session', () => {
    const nextState = appReducer(
      {
        ...initialState,
        isAuthenticated: true,
        token: 'cached-token',
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
      },
      { type: 'LOGOUT' }
    );

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.token).toBe('');
    expect(nextState.serverUrl).toBe('http://demo.example.com');
    expect(nextState.username).toBe('owner');
    expect(nextState.password).toBe('secret');
    expect(nextState.error).toBe('');
  });

  it('clears the in-memory password on reset', () => {
    const nextState = appReducer(
      {
        ...initialState,
        serverUrl: 'http://demo.example.com',
        username: 'owner',
        password: 'secret',
        autoLogin: false,
      },
      { type: 'RESET' }
    );

    expect(nextState.serverUrl).toBe('');
    expect(nextState.username).toBe('');
    expect(nextState.password).toBe('');
    expect(nextState.autoLogin).toBe(false);
  });
});
