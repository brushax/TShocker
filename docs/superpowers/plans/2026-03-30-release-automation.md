# Release Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reliable GitHub Actions CI and release pipeline for TShocker, then publish one real tagged release to verify the end-to-end chain.

**Architecture:** Keep the release model simple and tag-driven. Use one workflow for routine frontend validation on pushes and pull requests, and one workflow for signed-off release tags that verifies version consistency before delegating packaging and GitHub Release creation to the official Tauri action.

**Tech Stack:** GitHub Actions, pnpm, Node.js, Tauri 2, Rust toolchain, official `tauri-apps/tauri-action`

---

### Task 1: Add continuous integration workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `.github/workflows/release.yml`
- Test: local command verification via `pnpm test` and `pnpm build`

- [ ] **Step 1: Define the CI trigger and runtime**

Create a workflow that runs on pushes to `main` and on pull requests, uses Ubuntu for fast feedback, and checks out the repository with full history only where needed.

- [ ] **Step 2: Install Node and pnpm with cache**

Use `pnpm/action-setup@v4` and `actions/setup-node@v4` with `cache: pnpm` so lockfile-based installs stay deterministic and fast.

- [ ] **Step 3: Run frontend verification**

Execute:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

The workflow should fail immediately if any command exits non-zero.

- [ ] **Step 4: Re-run the same commands locally**

Run:

```bash
pnpm test
pnpm build
```

Expected: both commands pass in the local workspace before moving on.

### Task 2: Harden the tag-driven release workflow

**Files:**
- Modify: `.github/workflows/release.yml`
- Test: syntax review plus push of a real `v*` tag

- [ ] **Step 1: Keep release trigger tag-only**

The workflow should trigger only on tags that match `v*` and on manual dispatch. This keeps release creation explicit and aligned with git tags.

- [ ] **Step 2: Add version consistency checks**

Before packaging, verify that:

```bash
TAG_VERSION="${GITHUB_REF_NAME#v}"
PACKAGE_VERSION=$(node -p "require('./package.json').version")
TAURI_VERSION=$(node -p "require('./src-tauri/tauri.conf.json').version")
CARGO_VERSION=$(node -p "require('fs').readFileSync('./src-tauri/Cargo.toml','utf8').match(/^version\\s*=\\s*\"([^\"]+)\"/m)[1]")
```

All four values must match or the workflow exits with an error.

- [ ] **Step 3: Use current official Tauri action setup**

Use:

```yaml
uses: tauri-apps/tauri-action@v1
```

with Windows and macOS matrix builds, Rust stable, pnpm install, and GitHub release publishing enabled.

- [ ] **Step 4: Improve release behavior**

Set:

```yaml
releaseDraft: false
prerelease: false
includeDebug: false
generateReleaseNotes: true
```

This keeps releases official, public-ready, and lets GitHub produce sane notes from merged history.

### Task 3: Add a local release helper and perform one real release

**Files:**
- Modify: `package.json`
- Create: `scripts/release-prepare.js`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Test: local helper execution, git commit, tag, and remote push

- [ ] **Step 1: Add a release helper script**

Create a Node script that:

```text
1. Validates a version argument
2. Runs `pnpm version:bump <version>`
3. Runs `pnpm test`
4. Runs `pnpm build`
5. Creates commit `chore: release v<version>`
6. Creates annotated tag `v<version>`
```

It must stop on the first failing command.

- [ ] **Step 2: Expose the helper in package.json**

Add a script:

```json
"release:prepare": "node scripts/release-prepare.js"
```

- [ ] **Step 3: Document the release flow**

Add a short release section to both READMEs:

```bash
pnpm release:prepare 0.x.y
git push origin main --follow-tags
```

Clarify that the pushed `v*` tag triggers GitHub Actions to build and publish the release.

- [ ] **Step 4: Execute the real release**

Run the helper for the chosen version, push the commit and tag, then monitor GitHub Actions until the release workflow either succeeds or returns a concrete error that can be fixed in-repo.

### Task 4: Verify the published chain

**Files:**
- No file changes required unless follow-up fixes are needed
- Test: remote workflow run and release state

- [ ] **Step 1: Confirm CI workflow success**

Check the new CI workflow run for the release commit on `main`.

- [ ] **Step 2: Confirm release workflow success**

Check the tag-triggered workflow for both matrix targets.

- [ ] **Step 3: Confirm GitHub Release output**

Verify that a non-draft GitHub Release exists for the new tag and contains packaged assets for the supported targets.

- [ ] **Step 4: If the workflow fails, fix and re-run**

Use the failure logs to make the minimum required repo changes, then amend by a new commit and replacement tag only if necessary.
