import { describe, expect, it, vi } from 'vitest';

import { primeLoginContext } from './login-context';

describe('primeLoginContext', () => {
  it('sets the api base url immediately for the current login attempt', () => {
    const setBaseURL = vi.fn();
    const dispatch = vi.fn();

    const result = primeLoginContext({
      api: { setBaseURL },
      dispatch,
      serverUrl: 'demo.example.com/',
      username: ' owner ',
    });

    expect(result).toEqual({
      serverUrl: 'http://demo.example.com',
      username: 'owner',
    });
    expect(setBaseURL).toHaveBeenCalledWith('http://demo.example.com');
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_SERVER_URL',
      payload: 'http://demo.example.com',
    });
  });
});
