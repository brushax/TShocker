import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

import api from '@/api';
import { normalizeServerUrl } from '@/lib/auth-credentials';
import { loadSecureCredentials } from '@/lib/secure-storage';
import { type AppAction, type AppState, appReducer, initialState } from '@/context/app-state';

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: '' });

      try {
        const storedCredentials = await loadSecureCredentials();

        if (!storedCredentials || cancelled) {
          return;
        }

        const serverUrl = normalizeServerUrl(storedCredentials.serverUrl);
        dispatch({
          type: 'SET_CREDENTIALS',
          payload: {
            serverUrl,
            username: storedCredentials.username,
            password: storedCredentials.password,
          },
        });
        if (storedCredentials.token) {
          dispatch({ type: 'SET_TOKEN', payload: storedCredentials.token });
        }
      } catch (error) {
        if (!cancelled) {
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          dispatch({ type: 'SET_TOKEN', payload: '' });
          dispatch({
            type: 'SET_ERROR',
            payload: error instanceof Error ? error.message : String(error),
          });
        }
      } finally {
        if (!cancelled) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, [state.theme]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
