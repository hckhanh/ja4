Prepare a new release using bumpp.

Steps:

1. Run `vp check` and `vp test` to ensure everything passes
2. Run `vp pack` to verify the build succeeds
3. Run `vp exec bumpp` to bump the version (will prompt for version type). The `execute` hook in `bump.config.ts` runs `scripts/bump-skill-version.mjs` to update `library_version` in `skills/ja4-parsing/SKILL.md` automatically.
4. Report the new version
