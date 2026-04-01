# CLAUDE.md

## Project Overview

**ja4** is a TypeScript library that parses [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects. It is published to npm as an ESM package.

A JA4 fingerprint has the format `{sectionA}_{sectionB}_{sectionC}` (e.g. `t13d1516h2_8daaf6152771_02713d6af862`), where section A is a human-readable descriptor and sections B/C are truncated SHA256 hashes.

## Tech Stack

- **Runtime**: Node.js 24.14.1 (pinned in `.node-version`)
- **Language**: TypeScript 6 (strict mode, ESNext target, NodeNext modules)
- **Package manager**: pnpm 10.33.0 (declared via `packageManager` field)
- **Build/test/lint toolchain**: [vite-plus](https://github.com/nicepkg/vite-plus) (`vp` CLI) — wraps Vite, Vitest, and ESLint
- **Type generation**: Uses `tsgo` (TypeScript native preview) for `.d.ts` generation

## Commands

```bash
pnpm install          # Install dependencies
pnpm test             # Run tests (vitest via vp)
pnpm run check        # Lint + format check (eslint + prettier via vp)
pnpm run build        # Build library to dist/ (vp pack)
```

All `vp` commands can also be run directly: `pnpm exec vp test`, `pnpm exec vp check`, `pnpm exec vp check --fix`.

## Project Structure

```
src/
  index.ts      # Public API — re-exports parseJA4 and types
  parser.ts     # Core parsing logic (parseJA4 function)
  types.ts      # Type definitions (JA4Fingerprint, JA4SectionA, JA4ParseError)
tests/
  parser.test.ts  # Vitest test suite
```

## Key Conventions

- **ESM only**: The package uses `"type": "module"` and exports only `.mjs`.
- **Imports use `.ts` extensions**: Internal imports include the `.ts` extension (e.g. `from "./parser.ts"`), enabled by `allowImportingTsExtensions`.
- **Verbatim module syntax**: All type-only imports/exports use the `type` keyword (`import type`, `export type`).
- **Strict TypeScript**: `noUnusedLocals`, `strict`, `isolatedModules` are all enabled. No `any` types.
- **Error handling**: The library throws `JA4ParseError` (extends `Error`) for invalid inputs. All validation is in `parser.ts`.
- **Test imports**: Tests import from `"vite-plus/test"` for `describe`, `expect`, `test`.

## Pre-commit Hook

A git pre-commit hook runs `vp staged` which executes `vp check --fix` on staged files (configured in `vite.config.ts` under `staged`). This runs linting and formatting automatically before commits.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to `main`:
1. Lint & format check (`vp check`)
2. Tests (`vp test`)
3. Build (`vp pack`)
