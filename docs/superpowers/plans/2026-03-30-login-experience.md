# Login Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add password reveal and a persisted auto-login toggle while making startup auto-login use the same visible path as manual login.

**Architecture:** Keep credential restoration in `AppContext`, but move the actual startup login attempt into `LoginPage`. Introduce a small pure helper to decide when auto-login should run so the decision logic can be tested directly.

**Tech Stack:** React 19, TypeScript, Vitest, existing Tauri/TShock login flow

---

### Task 1: Add and test auto-login preference state

**Files:**
- Modify: `src/context/app-state.ts`
- Modify: `src/context/app-state.test.ts`

- [ ] **Step 1: Write failing reducer expectations for auto-login**
- [ ] **Step 2: Run `pnpm test src/context/app-state.test.ts` and confirm the new assertions fail**
- [ ] **Step 3: Implement `autoLogin` state, default persistence, and reducer action**
- [ ] **Step 4: Re-run `pnpm test src/context/app-state.test.ts` and confirm it passes**

### Task 2: Add and test startup auto-login decision logic

**Files:**
- Create: `src/pages/login-auto.ts`
- Create: `src/pages/login-auto.test.ts`

- [ ] **Step 1: Write failing tests for the auto-login guard function**
- [ ] **Step 2: Run `pnpm test src/pages/login-auto.test.ts` and confirm failure**
- [ ] **Step 3: Implement the guard helper**
- [ ] **Step 4: Re-run `pnpm test src/pages/login-auto.test.ts` and confirm pass**

### Task 3: Move startup login execution into the login page

**Files:**
- Modify: `src/context/AppContext.tsx`
- Modify: `src/pages/LoginPage.tsx`

- [ ] **Step 1: Stop `AppContext` from silently authenticating during restore**
- [ ] **Step 2: Keep restored credentials and token available in memory**
- [ ] **Step 3: Add one-shot auto-login effect in `LoginPage`**
- [ ] **Step 4: Ensure restore failures and auto-login failures surface in the login UI**

### Task 4: Add the new login form controls

**Files:**
- Modify: `src/pages/LoginPage.tsx`
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Add show/hide password button**
- [ ] **Step 2: Add auto-login switch and labels**
- [ ] **Step 3: Persist toggle changes through app state**
- [ ] **Step 4: Keep styling aligned with the current login card**

### Task 5: Verify end to end

**Files:**
- No additional file changes unless fixes are required

- [ ] **Step 1: Run `pnpm test`**
- [ ] **Step 2: Run `pnpm build`**
- [ ] **Step 3: Manually review the login flow logic diff**
