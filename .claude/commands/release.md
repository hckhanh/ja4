Prepare a new release using bumpp.

Steps:

1. Run `vp check` and `vp test` to ensure everything passes
2. Run `vp pack` to verify the build succeeds
3. Run `vp exec bumpp skills/ja4-parsing/SKILL.md` to bump the version (will prompt for version type). Passing the SKILL.md file tells bumpp to also update `library_version` in it.
4. Report the new version
