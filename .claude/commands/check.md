Run lint, format check, and tests to verify everything passes before committing.

Steps:
1. Run `vp check` to lint and format check
2. If it fails with fixable issues, run `vp check --fix` then re-run `vp check`
3. Run `vp test` to ensure all tests pass
4. Report results summary
