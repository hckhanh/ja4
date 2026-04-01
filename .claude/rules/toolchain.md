# Toolchain

Use the `vp` CLI for all tasks. Do NOT use `npm`, `npx`, or raw `vitest`/`eslint` commands.

- `vp install` — Install dependencies (pnpm install + prepare)
- `vp test` — Run tests
- `vp check` — Lint + format check (ESLint + Prettier, type-aware)
- `vp check --fix` — Auto-fix lint + format issues
- `vp pack` — Build library to dist/
- Do NOT use `vp build` — this is a library, always use `vp pack`

All configuration lives in `vite.config.ts` using `defineConfig` from `"vite-plus"`.

## Before Every Commit

```bash
vp check    # Must pass
vp test     # Must pass
```

If `vp check` fails with formatting issues, run `vp check --fix` first.
