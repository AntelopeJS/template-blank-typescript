---
covers:
  - README.md
  - CONTRIBUTING.md
  - AGENTS.md
  - LICENSE
docs:
  - README.md
journeys:
  - scaffold-docs
---

# Docs

The pages the user reads first.

## Sub-features

- `scaffold-docs`: every `pnpm` command the README names exists as a script, it names dev, build and test, it points at `antelope.config.ts`, and CONTRIBUTING, AGENTS.md and the license are in the scaffold.

## How to get to it (user POV)

- Opening the README of a new project.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" docs
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
