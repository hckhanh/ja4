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

**ja4** is a TypeScript library that parses [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects. It is published to npm (`@hckhanh/ja4`) and JSR (`@hckhanh/ja4`) as an ESM package.

A JA4 fingerprint has the format `{sectionA}_{sectionB}_{sectionC}` (e.g. `t13d1516h2_8daaf6152771_02713d6af862`), where:

- **Section A** (10 chars): Human-readable descriptor encoding protocol, TLS version, SNI, cipher/extension counts, and ALPN.
- **Section B** (12 chars): Truncated SHA256 hash of sorted cipher suites.
- **Section C** (12 chars): Truncated SHA256 hash of sorted extensions + signature algorithms.

## Tech Stack

- **Runtime**: Node.js (pinned in `.node-version`)
- **Language**: TypeScript (strict mode, ESNext target, NodeNext modules)
- **Package manager**: pnpm (declared via `packageManager` field in `package.json`)
- **Build/test/lint toolchain**: [vite-plus](https://github.com/nicepkg/vite-plus) (`vp` CLI)
- **Type generation**: Uses `tsgo` via `@typescript/native-preview` for `.d.ts` generation
- **Version bumping**: Uses `bumpp` for version management
- **Dependency updates**: Renovate (configured in `renovate.json`)
- **Skills**: Uses `@tanstack/intent` and `skills-npm` for agent skill discovery

## Project Structure

```
src/
  index.ts        # Public API — re-exports parseJA4, JA4ParseError, and types
  parser.ts       # Core parsing logic (parseJA4 function, parseSectionA helper)
  types.ts        # Type definitions (JA4Fingerprint, JA4SectionA, JA4ParseError, Protocol, TLSVersion, SNI)
tests/
  parser.test.ts  # Vitest test suite (happy path + validation error cases)
skills/
  ja4-parsing/
    SKILL.md      # TanStack Intent skill definition for agent consumption
scripts/
  bump-skill-version.mjs  # Syncs version from package.json into SKILL.md during release
.claude/
  rules/          # Granular instructions for AI agents (code-style, testing, toolchain, setup, github-actions)
.github/
  workflows/
    ci.yml              # CI: lint, test, build on PRs and pushes to main
    release.yml         # Release: publish to npm + JSR on version tags
    check-skills.yml    # Post-release skill staleness check
    validate-skills.yml # PR validation for skills/ changes
    notify-intent.yml   # Triggers skill review on src/docs changes
```

## Key Conventions

- **ESM only**: `"type": "module"`, exports only `.mjs`.
- **Imports use `.ts` extensions**: e.g. `from "./parser.ts"`, enabled by `allowImportingTsExtensions`.
- **Verbatim module syntax**: All type-only imports/exports use the `type` keyword.
- **Strict TypeScript**: `noUnusedLocals`, `strict`, `isolatedModules` enabled. No `any` types.
- **Error handling**: Throws `JA4ParseError` (extends `Error`) for invalid inputs. All validation is in `parser.ts`.
- **This is a library**: Always use `vp pack` for building, not `vp build`.
- All configuration lives in `vite.config.ts` using `defineConfig` from `"vite-plus"`.

## Public API

The library exports one function and associated types from `src/index.ts`:

- `parseJA4(fingerprint: string): JA4Fingerprint` — parses a JA4 string, throws `JA4ParseError` on invalid input.
- `JA4ParseError` — error class for invalid fingerprints.
- Types: `JA4Fingerprint`, `JA4SectionA`, `Protocol` (`"TCP" | "QUIC" | "DTLS"`), `TLSVersion` (`"1.0" | "1.1" | "1.2" | "1.3"`), `SNI` (`"domain" | "ip"`).

## Development Workflow

### First-time Setup

```bash
vp install    # Install dependencies + run prepare (vp config && skills-npm)
```

Always run `vp install` before doing any other work.

### Day-to-day Commands

```bash
vp test       # Run tests (Vitest)
vp check      # Lint + format + type check
vp check --fix  # Auto-fix lint + format issues
vp pack       # Build library to dist/
```

### Before Every Commit

```bash
vp check      # Must pass
vp test       # Must pass
```

A git pre-commit hook runs `vp staged` which executes `vp check --fix` on staged files.

### Testing

- Tests live in `tests/` and use Vitest via `vp test`.
- Import test utilities from `"vite-plus/test"` (not `vitest`):
  ```ts
  import { describe, expect, test } from "vite-plus/test";
  ```
- Import source code from `"../src/index.ts"` in tests.
- Test both happy paths and error cases (JA4ParseError).

### Releasing

Releases use `bumpp` (configured in `bump.config.ts`):

1. `bumpp` bumps version in `package.json` and `jsr.json`.
2. Runs `scripts/bump-skill-version.mjs` to sync version into `skills/ja4-parsing/SKILL.md`.
3. Creates a signed, annotated git tag.
4. CI (`release.yml`) publishes to npm (with provenance) and JSR, then creates a GitHub Release.

### Validating Skills

```bash
vp exec intent validate skills  # Validate skill files
vp exec intent stale --json     # Check for stale skills
```

## Agent Skills

[skills-npm](https://github.com/antfu/skills-npm) discovers agent skills bundled in npm packages and symlinks them for coding agents. It runs automatically during `prepare` (after `vp install`). Skills from installed packages appear under `skills/npm-*`.

The `skills/ja4-parsing/SKILL.md` file is a [TanStack Intent](https://github.com/TanStack/intent) skill definition that describes the library's API for AI agent consumption. It is versioned alongside the library and checked for staleness after each release.

## CI / GitHub Actions

### Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | PRs + pushes to `main` | Lint, test, build |
| `release.yml` | Tags `v*` | Publish to npm + JSR, create GitHub Release |
| `check-skills.yml` | Release published, manual, `repository_dispatch` (`skill-check`) | Detect stale skills, open review PR |
| `validate-skills.yml` | PRs touching `skills/` | Validate skill file structure |
| `notify-intent.yml` | Pushes to `main` changing `src/` or `docs/` | Trigger skill staleness check |

### CI Conventions

- **Pin third-party actions to commit SHAs** with version comments (e.g. `# v6`).
- **Top-level `permissions`**: `contents: read` for CI, `permissions: {}` for workflows granting job-level permissions.
- **Supply chain protection**: Workflows that run `vp install` run [Aikido safe-chain](https://github.com/AikidoSec/safe-chain) first.
- **Renovate** manages dependency and GitHub Actions updates (`renovate.json`).

## pnpm Workspace

The project uses a `pnpm-workspace.yaml` with catalog overrides to alias `vite` and `vitest` to their Vite+ equivalents (`@voidzero-dev/vite-plus-core` and `@voidzero-dev/vite-plus-test`). This ensures all tools resolve through Vite+.
