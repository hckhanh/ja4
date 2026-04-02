Prepare a new release using bumpp.

Steps:

1. Run `vp check` and `vp test` to ensure everything passes
2. Run `vp pack` to verify the build succeeds
3. Run `vp exec bumpp` to bump the version (will prompt for version type)
4. Read the new version from `package.json` and update `library_version` in `skills/ja4-parsing/SKILL.md` to match
5. Stage the updated SKILL.md and amend the release commit with `git commit --amend --no-edit`
6. Report the new version
