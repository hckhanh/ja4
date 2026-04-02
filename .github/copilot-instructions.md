# Copilot Code Review Instructions

## Project Overview

This is `@hckhanh/ja4`, a TypeScript library that parses JA4 TLS fingerprint strings into structured objects. It is published as an ESM-only npm package.

## Toolchain

This project uses **Vite+** (`vp` CLI) as its unified toolchain. For day-to-day development (install, check, test, build), use `vp` instead of `npm`, `pnpm`, `npx`, `vitest`, `eslint`, or `prettier`. The release workflow is an exception — it uses `npm publish` and `pnpm dlx` for publishing.

- `vp install` — Install dependencies
- `vp test` — Run tests (Vitest)
- `vp check` — Lint + format + type check
- `vp check --fix` — Auto-fix lint and format issues
- `vp pack` — Build the library (NOT `vp build`)

## TypeScript Conventions

- **Strict mode**: `strict`, `noUnusedLocals`, and `isolatedModules` are enabled. Never use `any` — use `unknown` or proper types.
- **Verbatim module syntax**: All type-only imports/exports must use the `type` keyword (`import type`, `export type`).
- **`.ts` extensions in imports**: Internal imports must include the `.ts` extension (e.g., `from "./parser.ts"`).
- **ESM only**: The package uses `"type": "module"` and its runtime entrypoints are `.mjs` (ESM-only).
- **Target**: ESNext with NodeNext module resolution.

## Code Style

- Import test utilities from `"vite-plus/test"`, not from `"vitest"`.
- Import source code from `"../src/index.ts"` in test files.
- Use `defineConfig` from `"vite-plus"` in `vite.config.ts`.
- Prefer double quotes in JSON and YAML, but YAML may use single quotes where needed (e.g., expression conditions).

## Error Handling

- The library throws `JA4ParseError` (extends `Error`) for invalid inputs.
- All validation logic lives in `src/parser.ts`.
- When reviewing changes to parsing logic, verify both happy-path and error-case coverage in tests.

## GitHub Actions

- **Pin third-party actions to full 40-character commit SHAs**, not version tags. Add a version comment after the SHA (e.g., `uses: actions/checkout@<sha> # v4`).
- Every workflow must have a top-level `permissions` block. Use `contents: read` for CI.
- Never use untrusted context (e.g., `${{ github.event.pull_request.title }}`) directly in `run:` blocks — pass through environment variables.
- Workflows that run `vp install` should install Aikido safe-chain first for supply chain protection.

## Review Checklist

When reviewing pull requests, verify:

- [ ] No `any` types — use `unknown` or proper typing
- [ ] Type-only imports use the `type` keyword
- [ ] Internal imports include `.ts` extensions
- [ ] Tests import from `"vite-plus/test"`, not `"vitest"`
- [ ] New parsing logic has corresponding test coverage (happy path + error cases)
- [ ] `JA4ParseError` is used for all validation errors, not generic `Error`
- [ ] No new direct use of `npm`, `pnpm`, `npx`, or raw tool commands in code/docs/workflows — use `vp` (existing release/publishing workflows that use `npm`/`pnpm dlx` are allowed)
- [ ] GitHub Actions pin third-party actions to commit SHAs
- [ ] No `vp build` for this library — only `vp pack`
- [ ] No direct installation of Vitest, Oxlint, Oxfmt, or tsdown — these are bundled in Vite+
