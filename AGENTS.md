# AI Agent & Contributor Guide (AGENTS.md)

This document provides essential context and instructions for AI coding agents and human contributors working on the **TShocker** project.

`README.md` and `README.zh-CN.md` are user-facing documents. Keep them concise and attractive: badges, screenshots, installation, requirements, key features, data attribution, and brief local development commands are appropriate. Release workflows, CI internals, and other maintainer-only details belong in `AGENTS.md` or other developer docs unless the user explicitly asks to surface them in the README.

## 1. Project Overview

TShocker is a cross-platform desktop management client for **TShock for Terraria** servers, built on top of the TShock REST API.

- **Frontend**: React 19 + TypeScript + Vite.
- **Desktop Wrapper**: Tauri 2.0 (Rust).
- **Communication**: Interacts with TShock via `@tauri-apps/plugin-http` to bypass CORS and leverage native networking.

## 2. Core Architecture

- **API Layer (`src/api/`)**: Centralized `TShockClient` that handles token injection and URL construction. API logic is modularized under `src/api/modules/`.
- **UI Components (`src/components/ui/`)**: Reusable primitives based on Radix UI and Tailwind CSS.
- **State Management (`src/context/`)**: `AppContext` handles global state like authentication, theme, and `devMode`.
- **Internationalization (`src/i18n/`)**: Dual-language support (English/Chinese) managed via `react-i18next`.

## 3. Critical Workflows

### Setup & Development

```bash
pnpm install          # Install dependencies
pnpm tauri dev        # Start development mode (Vite + Tauri)
pnpm build            # Build frontend only
pnpm tauri build      # Build full desktop bundle
```

### Versioning

Use the custom script to sync versions across `package.json`, `tauri.conf.json`, and `Cargo.toml`:

```bash
pnpm version:bump <new-version>
```

### Release Workflow

Use the release helper to prepare a versioned commit and annotated tag:

```bash
pnpm release:prepare <new-version>
git push origin main --follow-tags
```

The pushed `v<new-version>` tag triggers `.github/workflows/release.yml`, which runs validation and publishes the GitHub Release assets.

### macOS Development

If the `.app` bundle shows as "damaged" after a local build or download, run:

```bash
sudo xattr -rd com.apple.quarantine /Applications/TShocker.app
```

## 4. Coding Standards & Conventions

- **Path Aliases**: Use `@/` to reference the `src/` directory (configured in `vite.config.ts` and `tsconfig.json`).
- **REST API**: TShock REST API usually expects the `token` as a query parameter (`?token=...`). Do not assume Bearer tokens unless the endpoint explicitly requires it.
- **Dev Mode**: The `devMode` flag in `AppContext` (persisted in `localStorage` as `tshock_dev_mode`) toggles the blocking of `F12` and `F5` in production builds.
- **Native APIs**: Always prefer `@tauri-apps/api` and its plugins for networking, file system, and window management to ensure cross-platform compatibility.

## 5. Deployment (GitHub Actions)

- **Workflow**: `.github/workflows/release.yml` handles automated builds for Windows and macOS.
- **Changelog**: The release body is automatically generated from Git commit logs between tags.
- **Signing**: macOS builds use **Ad-hoc signing (`-`)** to reduce Gatekeeper interference for unsigned apps.

## 6. Security Mandates

- **No Secrets**: Never hardcode or log TShock tokens, server URLs, or user passwords.
- **Credential Protection**: Ensure `.env` files and sensitive build artifacts are excluded via `.gitignore`.
