---
covers:
  - tsconfig.json
  - tsconfig.config.json
  - oxlint.config.ts
  - oxfmt.config.ts
  - knip.config.ts
  - guardrails.suppressions.json
  - renovate.json
docs:
  - CONTRIBUTING.md
  - AGENTS.md
journeys:
  - scaffold-lint-rejects
  - scaffold-checks
---

# Tooling

The guardrail configuration the user inherits: TypeScript, lint, format, knip, the suppression budget and Renovate.

## Sub-features

- `scaffold-lint-rejects`: an unused local fails the typecheck and a `debugger` statement fails lint, so the configs are live.
- `scaffold-checks`: `pnpm run checks` passes before the user changes anything, its summary skips no step, and no `typecheck`, `lint` or `knip` failure appears in its output, so those three read on their own even while another step fails. **This journey fails on head** for two reasons outside this repository. `ajs project init` writes an `antelope.config.ts` that `oxfmt --check` rejects (draft: antelopejs-init-config-fails-format-check.md). `ajs project init` also leaves out `.agents` and `.claude/skills`, so `sync:check` reports the synced agent skills as drift.

## How to get to it (user POV)

- `pnpm run checks` before opening a pull request.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" tooling
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
