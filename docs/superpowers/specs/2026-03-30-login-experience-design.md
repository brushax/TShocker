# Login Experience Design

**Goal:** Improve the saved-credential experience on the login screen by supporting password reveal, an explicit auto-login preference, and a more transparent startup login flow.

## Scope

- Add a password visibility toggle to the login form.
- Add an auto-login toggle, defaulting to enabled.
- Persist the auto-login preference in local storage.
- Restore saved credentials into app state on startup.
- Run automatic login from the login page itself so it uses the same path as manual login and can show user-facing errors.

## Design

### Startup Flow

`AppContext` should only restore saved credentials and the cached token into memory. It should not silently authenticate in the background.

The login page becomes the single place that performs login attempts. After startup restoration completes, if these conditions are all true:

- auto-login is enabled
- server URL exists
- username exists
- password exists
- user is not already authenticated

then the login page should trigger one automatic login attempt.

This keeps the login flow consistent and avoids hidden background failures.

### User Interface

The password field gets an inline show/hide button.

The login form gets an auto-login switch below the password field. The switch updates application state and persists immediately via existing local preference behavior.

If automatic login fails during startup, the login page should show the same visible error state as a manual login failure instead of silently returning to an empty-looking form.

## Files

- Modify `src/context/app-state.ts`
- Modify `src/context/app-state.test.ts`
- Modify `src/context/AppContext.tsx`
- Modify `src/pages/LoginPage.tsx`
- Modify `src/i18n/locales/zh-CN.json`
- Modify `src/i18n/locales/en.json`
- Add `src/pages/login-auto.test.ts`
- Add `src/pages/login-auto.ts`

## Risks

- Auto-login must only fire once per restored session to avoid login loops.
- The login page must not overwrite a user-typed password with stale restored state after manual editing begins.
- The UI change should stay minimal and not disturb the existing visual style.
