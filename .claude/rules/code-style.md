# Code Style

- **ESM only**: The package uses `"type": "module"` and exports only `.mjs`.
- **Imports use `.ts` extensions**: Internal imports must include the `.ts` extension (e.g. `from "./parser.ts"`), enabled by `allowImportingTsExtensions`.
- **Verbatim module syntax**: All type-only imports/exports must use the `type` keyword (`import type`, `export type`).
- **Strict TypeScript**: `noUnusedLocals`, `strict`, `isolatedModules` are all enabled. Never use `any` types.
- **Double quotes** are required in YAML and JSON files (enforced by the formatter).
- **No `any` types**: Use `unknown` or proper typing instead.
