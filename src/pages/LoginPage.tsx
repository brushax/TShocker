import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserIcon,
  LockIcon,
  LinkIcon,
  AlertCircleIcon,
  TreePineIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/AppContext';
import api from '@/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Titlebar from '@/components/Titlebar';
import { Spinner } from '@/components/ui/spinner';
import { isCredentialError } from '@/lib/auth-credentials';
import { saveSecureCredentials } from '@/lib/secure-storage';
import { Switch } from '@/components/ui/switch';
import { canAttemptAutoLogin } from './login-auto';
import { primeLoginContext } from './login-context';

interface LoginForm {
  serverUrl: string;
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [serverUrl, setServerUrl] = useState(state.serverUrl || '');
  const [username, setUsername] = useState(state.username || '');
  const [password, setPassword] = useState(state.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const autoLoginAttempted = useRef(false);

  useEffect(() => {
    setServerUrl(state.serverUrl || '');
  }, [state.serverUrl]);

  useEffect(() => {
    setUsername(state.username || '');
  }, [state.username]);

  useEffect(() => {
    setPassword(state.password || '');
  }, [state.password]);

  useEffect(() => {
    if (!state.loading && state.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate, state.isAuthenticated, state.loading]);

  useEffect(() => {
    if (
      !canAttemptAutoLogin({
        loading: state.loading || loading,
        isAuthenticated: state.isAuthenticated,
        autoLogin: state.autoLogin,
        autoLoginSuppressed: state.autoLoginSuppressed,
        hasAttempted: autoLoginAttempted.current,
        serverUrl: state.serverUrl,
        username: state.username,
        password: state.password,
      })
    ) {
      return;
    }

    autoLoginAttempted.current = true;
    void handleLogin(undefined, {
      serverUrl: state.serverUrl,
      username: state.username,
      password: state.password,
    });
  }, [
    loading,
    state.autoLogin,
    state.autoLoginSuppressed,
    state.isAuthenticated,
    state.loading,
    state.password,
    state.serverUrl,
    state.username,
  ]);

  const handleLogin = async (e?: React.FormEvent, values?: LoginForm) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    dispatch({ type: 'SET_ERROR', payload: '' });
    const vals = values || { serverUrl, username, password };

    try {
      const { serverUrl: url, username: nextUsername } = primeLoginContext({
        api,
        dispatch,
        serverUrl: vals.serverUrl,
        username: vals.username,
      });

      const token = await api.login(nextUsername, vals.password);

      if (token) {
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({
          type: 'SET_CREDENTIALS',
          payload: {
            serverUrl: url,
            username: nextUsername,
            password: vals.password,
          },
        });

        const response = await api.server.validateToken();

        if (response.status === '200') {
          try {
            await saveSecureCredentials({
              serverUrl: url,
              username: nextUsername,
              password: vals.password,
              token,
            });
          } catch {
            console.error('Failed to save credentials securely.');
          }

          dispatch({ type: 'SET_ERROR', payload: '' });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          navigate('/', { replace: true });
        } else {
          dispatch({ type: 'SET_TOKEN', payload: '' });
          setError(t('login.errors.token_validation_failed'));
        }
      } else {
        setError(t('login.errors.login_failed'));
      }
    } catch (err) {
      let errorMessage = t('login.errors.connection_failed');

      const errorStr = (err instanceof Error ? err.message : String(err)).toLowerCase();

      if (isCredentialError(err)) {
        errorMessage = t('login.errors.invalid_credentials');
      } else if (errorStr.includes('权限不足') || errorStr.includes('insufficient permissions')) {
        errorMessage = t('login.errors.insufficient_permissions');
      } else if (errorStr.includes('failed to fetch') || errorStr.includes('network error')) {
        errorMessage = t('login.errors.server_unreachable');
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const visibleError = error || state.error;

  if (state.loading) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        <Titlebar />
        <div className="bg-background flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-6 text-blue-500" />
            <span className="text-muted-foreground text-sm">{t('login.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Titlebar />
      <div className="bg-background relative flex flex-1 items-center justify-center p-6 transition-colors duration-500">
        {/* Background decorative elements - Ambient light */}
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-500/10 blur-[120px] duration-[10s] dark:bg-blue-600/10"></div>
        <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-cyan-500/10 blur-[120px] delay-1000 duration-[12s] dark:bg-cyan-600/10"></div>
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-600/10"></div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>

        {/* Noise overlay layer */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-[0.1] dark:opacity-20"></div>

        <Card className="animate-in fade-in zoom-in-95 border-border bg-card/50 relative z-10 w-full max-w-md gap-0 overflow-hidden rounded-xl p-0 shadow-2xl backdrop-blur-xl duration-700 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"></div>
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
                <TreePineIcon className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="m-0 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-300">
                {t('login.title')}
              </h2>
              <div className="text-muted-foreground mt-2 text-sm">{t('login.subtitle')}</div>
            </div>

            {visibleError && (
              <Alert variant={'destructive'}>
                <AlertCircleIcon />
                <AlertTitle>{t('login.alert_title')}</AlertTitle>
                <AlertDescription>{visibleError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={(e) => handleLogin(e)}>
              <div className="mb-3">
                <Label className="mb-1 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>{t('login.serverUrl')}</span>
                </Label>
                <Input
                  placeholder={t('login.placeholder.server')}
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <Label className="mb-1 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{t('login.username')}</span>
                </Label>
                <Input
                  placeholder={t('login.placeholder.username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <Label className="mb-1 flex items-center gap-2">
                  <LockIcon className="h-4 w-4" />
                  <span>{t('login.password')}</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.placeholder.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? t('login.hide_password') : t('login.show_password')}
                    title={showPassword ? t('login.hide_password') : t('login.show_password')}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="border-border/50 bg-background/40 mb-4 flex items-center justify-between rounded-lg border px-3 py-2">
                <div className="pr-3">
                  <div className="text-sm font-medium">{t('login.auto_login')}</div>
                  <div className="text-muted-foreground text-xs">{t('login.auto_login_hint')}</div>
                </div>
                <Switch
                  checked={state.autoLogin}
                  onCheckedChange={(checked) =>
                    dispatch({ type: 'SET_AUTO_LOGIN', payload: checked })
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="mt-4">
                <Button
                  size={'lg'}
                  loading={loading}
                  type="submit"
                  className="w-full"
                  icon={<LinkIcon className="h-4 w-4" />}
                >
                  {t('login.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
