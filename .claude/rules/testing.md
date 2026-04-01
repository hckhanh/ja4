# Testing

- Run tests with `vp test` (Vitest under the hood).
- Test config is in `vite.config.ts` under `test` (`include: ["tests/**/*.test.ts"]`).
- Import test utilities from `"vite-plus/test"` (not from `vitest` directly):
  ```ts
  import { describe, expect, test } from "vite-plus/test";
  ```
- Import source code from `../src/index.ts` in tests.
- **Error handling**: The library throws `JA4ParseError` (extends `Error`) for invalid inputs. All validation is in `parser.ts`. Test both happy paths and error cases.
- Always run `vp test` before committing to ensure all tests pass.
