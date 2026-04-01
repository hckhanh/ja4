<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

# ja4

## Project Overview

**ja4** is a TypeScript library that parses [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects. It is published to npm as an ESM package.

A JA4 fingerprint has the format `{sectionA}_{sectionB}_{sectionC}` (e.g. `t13d1516h2_8daaf6152771_02713d6af862`), where section A is a human-readable descriptor and sections B/C are truncated SHA256 hashes.

## Tech Stack

- **Runtime**: Node.js 24.14.1 (pinned in `.node-version`)
- **Language**: TypeScript 6 (strict mode, ESNext target, NodeNext modules)
- **Package manager**: pnpm 10.33.0 (declared via `packageManager` field)
- **Build/test/lint toolchain**: [vite-plus](https://github.com/nicepkg/vite-plus) (`vp` CLI)
- **Type generation**: Uses `tsgo` via `@typescript/native-preview` for `.d.ts` generation
- **Version bumping**: Uses `bumpp` for version management

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

- **ESM only**: `"type": "module"`, exports only `.mjs`.
- **Imports use `.ts` extensions**: e.g. `from "./parser.ts"`, enabled by `allowImportingTsExtensions`.
- **Verbatim module syntax**: All type-only imports/exports use the `type` keyword.
- **Strict TypeScript**: `noUnusedLocals`, `strict`, `isolatedModules` enabled. No `any` types.
- **Error handling**: Throws `JA4ParseError` (extends `Error`) for invalid inputs. All validation is in `parser.ts`.
- **This is a library**: Always use `vp pack` for building, not `vp build`.
- All configuration lives in `vite.config.ts` using `defineConfig` from `"vite-plus"`.

## Agent Skills

[skills-npm](https://github.com/antfu/skills-npm) discovers agent skills bundled in npm packages and symlinks them for coding agents. It runs automatically during `prepare` (after `vp install`). Skills from installed packages appear under `skills/npm-*`.

## Pre-commit Hook

A git pre-commit hook runs `vp staged` which executes `vp check --fix` on staged files (configured in `vite.config.ts` under `staged`).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to `main` using `voidzero-dev/setup-vp@v1`:

1. Lint & format check (`vp check`)
2. Tests (`vp test`)
3. Build (`vp pack`)
