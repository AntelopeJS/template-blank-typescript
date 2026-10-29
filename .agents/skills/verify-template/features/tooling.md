---
covers:
  - tsconfig.json
  - oxlint.config.ts
  - oxfmt.config.ts
  - knip.config.ts
  - guardrails.suppressions.json
  - renovate.json
docs:
  - CONTRIBUTING.md
  - AGENTS.md
journeys:
  - scaffold-lint
  - scaffold-lint-rejects
  - scaffold-checks
---

# Tooling

The guardrail configuration the user inherits: TypeScript, lint, format, knip, the suppression budget and Renovate.

## Sub-features

- `scaffold-lint`: `typecheck`, `lint` and `knip` pass in the scaffold.
- `scaffold-lint-rejects`: an unused local fails the typecheck and a `debugger` statement fails lint, so the configs are live.
- `scaffold-checks`: `pnpm run checks` passes before the user changes anything. **This journey fails on head**: `ajs project init` writes an `antelope.config.ts` that `oxfmt --check` rejects (draft: antelopejs-init-config-fails-format-check.md).

## How to get to it (user POV)

- `pnpm run checks` before opening a pull request.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" tooling
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
