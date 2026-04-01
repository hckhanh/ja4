# CLAUDE.md

## Project Overview

**ja4** is a TypeScript library that parses [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects. It is published to npm as an ESM package.

A JA4 fingerprint has the format `{sectionA}_{sectionB}_{sectionC}` (e.g. `t13d1516h2_8daaf6152771_02713d6af862`), where section A is a human-readable descriptor and sections B/C are truncated SHA256 hashes.

## Tech Stack

- **Runtime**: Node.js 24.14.1 (pinned in `.node-version`)
- **Language**: TypeScript 6 (strict mode, ESNext target, NodeNext modules)
- **Package manager**: pnpm 10.33.0 (declared via `packageManager` field)
- **Build/test/lint toolchain**: [vite-plus](https://github.com/nicepkg/vite-plus) (`vp` CLI) — wraps Vite, Vitest, and ESLint
- **Linting**: Type-aware ESLint with type checking enabled (configured in `vite.config.ts` under `lint.options`)
- **Type generation**: Uses `tsgo` via `@typescript/native-preview` for `.d.ts` generation
- **Version bumping**: Uses `bumpp` for version management

## Commands

Use the `vp` CLI for all tasks:

```bash
vp install      # Install dependencies
vp test         # Run tests (vitest)
vp check        # Lint + format check (eslint + prettier)
vp check --fix  # Auto-fix lint + format issues
vp pack         # Build library to dist/
```

## Project Structure

```
src/
  index.ts      # Public API — re-exports parseJA4 and types
  parser.ts     # Core parsing logic (parseJA4 function)
  types.ts      # Type definitions (JA4Fingerprint, JA4SectionA, JA4ParseError)
tests/
  parser.test.ts  # Vitest test suite
```

## Vite-Plus (vp) Details

The `vp` CLI is the single entry point for all dev tasks. Key things to know:

- **`vp install`** — Installs dependencies (runs pnpm install under the hood), then runs `prepare` which calls `vp config && skills-npm`
- **`vp test`** — Runs Vitest. Test config is in `vite.config.ts` under `test` (e.g. `include: ["tests/**/*.test.ts"]`)
- **`vp check`** — Runs ESLint + Prettier. Uses type-aware linting with `typeCheck: true` and `typeAware: true`
- **`vp check --fix`** — Auto-fixes lint and formatting issues
- **`vp pack`** — Builds the library to `dist/`. Generates `.mjs` output and `.d.ts` types via `tsgo`
- **`vp staged`** — Runs on pre-commit hook; applies `vp check --fix` to staged files (configured via `staged` in `vite.config.ts`)
- **`vp config`** — Sets up project configuration (runs during `prepare`)
- Do NOT use `vp build` — this is a library, so always use `vp pack` for building
- All configuration lives in `vite.config.ts` using `defineConfig` from `"vite-plus"`

## Key Conventions

- **ESM only**: The package uses `"type": "module"` and exports only `.mjs`.
- **Imports use `.ts` extensions**: Internal imports include the `.ts` extension (e.g. `from "./parser.ts"`), enabled by `allowImportingTsExtensions`.
- **Verbatim module syntax**: All type-only imports/exports use the `type` keyword (`import type`, `export type`).
- **Strict TypeScript**: `noUnusedLocals`, `strict`, `isolatedModules` are all enabled. No `any` types.
- **Error handling**: The library throws `JA4ParseError` (extends `Error`) for invalid inputs. All validation is in `parser.ts`.
- **Test imports**: Tests import from `"vite-plus/test"` for `describe`, `expect`, `test`.

## Important: Always Run Linters

Before committing any changes, always run the linter and tests to verify everything passes:

```bash
vp check    # Must pass — lint + format check
vp test     # Must pass — all tests green
```

If `vp check` fails with formatting issues, run `vp check --fix` to auto-fix, then re-run to confirm.

## Agent Skills

[skills-npm](https://github.com/antfu/skills-npm) discovers agent skills bundled in npm packages and symlinks them for coding agents. It runs automatically during `prepare` (after `vp install`). Skills from installed packages appear under `skills/npm-*`.

## Pre-commit Hook

A git pre-commit hook runs `vp staged` which executes `vp check --fix` on staged files (configured in `vite.config.ts` under `staged`). This runs linting and formatting automatically before commits.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to `main` using `voidzero-dev/setup-vp@v1` (handles Node.js, pnpm, and caching):

1. Lint & format check (`vp check`)
2. Tests (`vp test`)
3. Build (`vp pack` — this is a library, not a web app, so use `vp pack` instead of `vp build`)

Double quotes are required in YAML and JSON files (enforced by the formatter).
