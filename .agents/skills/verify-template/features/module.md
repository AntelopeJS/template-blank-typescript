---
covers:
  - src/**
  - package.json
  - pnpm-lock.yaml
  - .nvmrc
docs:
  - README.md
journeys:
  - scaffold-dev
  - scaffold-shape
  - module-exports
---

# Module

The module the user gets: the four lifecycle hooks in `src/index.ts`, the manifest that points the runtime at `dist`, and the lockfile.

## Sub-features

- `scaffold-dev`: `ajs project init`, `pnpm install --frozen-lockfile`, `ajs project dev --watch` until the modules are constructed and still running 3 seconds later, Ctrl+C exits 130.
- `scaffold-shape`: the scaffolded `package.json` names `antelopejs-module`, `dist/index.js`, `baseUrl` `dist` and the documented scripts; `antelope.config.ts` loads the module as `local`;.
- `module-exports`: `pnpm run build` writes `dist/index.js` and `dist/index.d.ts`, whose exports are exactly `construct,destroy,start,stop`, and each hook runs.

## How to get to it (user POV)

- `ajs project init my-app --template "Blank Typescript"`, then `ajs project dev --watch`.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" module
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
