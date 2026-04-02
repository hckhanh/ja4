# GitHub Actions

- **Pin third-party actions to commit SHAs**: Use the full 40-character SHA, not a version tag. Add a version comment after the SHA for readability (e.g., `uses: actions/checkout@<sha> # v4`).
- **Set top-level `permissions`**: Every workflow must have a top-level `permissions` block. Use `contents: read` for CI workflows. Use `permissions: {}` (empty) for workflows that grant permissions at the job level.
- **Job-level permissions for elevated access**: If a job needs more than read access, declare `permissions` on the job, not the workflow. Only grant what is needed (e.g., `contents: write` and `id-token: write` for npm provenance publishing).
- **No inline scripts with untrusted context**: Never use `${{ github.event.pull_request.title }}` or similar untrusted inputs directly in `run:` blocks. Pass them through environment variables first.
- **Supply chain protection**: Both workflows use [Aikido safe-chain](https://github.com/AikidoSec/safe-chain) before `vp install` to scan dependencies for malware during installation.
- **Renovate for action updates**: `renovate.json` is configured to auto-update dependencies including GitHub Actions. When reviewing Renovate PRs for actions, verify the new SHA matches the expected release tag.
- **Double quotes in YAML**: Use double quotes for all string values (enforced by the formatter).
- **GitHub Copilot reviews have high hallucination**: Always verify each Copilot review suggestion against the actual code and workflow logic before acting on it. Do not blindly trust Copilot's suggestions — cross-check claims about missing functionality, incorrect commands, or broken behavior.
