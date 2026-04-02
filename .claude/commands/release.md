Prepare a new release using bumpp.

Steps:

1. Run `vp check` and `vp test` to ensure everything passes
2. Run `vp pack` to verify the build succeeds
3. Run `vp exec bumpp` to bump the version (will prompt for version type). `bump.config.ts` includes `skills/ja4-parsing/SKILL.md` so `library_version` is updated automatically.
4. Report the new version
