interface AutoLoginConditions {
  loading: boolean;
  isAuthenticated: boolean;
  autoLogin: boolean;
  autoLoginSuppressed: boolean;
  hasAttempted: boolean;
  serverUrl: string;
  username: string;
  password: string;
}

export function canAttemptAutoLogin({
  loading,
  isAuthenticated,
  autoLogin,
  autoLoginSuppressed,
  hasAttempted,
  serverUrl,
  username,
  password,
}: AutoLoginConditions): boolean {
  if (loading || isAuthenticated || !autoLogin || autoLoginSuppressed || hasAttempted) {
    return false;
  }

  return Boolean(serverUrl.trim() && username.trim() && password);
}
