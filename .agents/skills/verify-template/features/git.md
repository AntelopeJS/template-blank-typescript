---
covers:
  - .gitignore
docs:
  - README.md
journeys:
  - scaffold-gitignore
---

# Git

What git leaves out of every project scaffolded from the template; a dropped line commits secrets or build output.

## Sub-features

- `scaffold-gitignore`: `.env`, `.env.local`, `node_modules`, `dist`, `coverage` and `.antelope/cache` are ignored, sources are not, and after install and build no secret, dependency or build file is left untracked. This is the Exposure door's journey.

## How to get to it (user POV)

- `git status` in a new project.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" git
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
