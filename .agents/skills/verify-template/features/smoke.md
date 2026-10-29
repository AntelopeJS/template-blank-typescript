---
covers:
docs:
  - README.md
journeys:
  - scaffold-dev
---

# Smoke

The fixed journey every verdict runs, whatever the diff touches, and the one the core and dms release canaries run: scaffold through `ajs` from an offline manifest, install, `ajs project dev`, stop.

## Sub-features

- `scaffold-dev`: as in [module](module.md).

## How to get to it (user POV)

- `ajs project init my-app --template "Blank Typescript"`.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" smoke
```

## Gotchas

- The smoke feature covers no glob, so it never marks a file as mapped.
- `pnpm run checks` is in the `tooling` feature, not here, because it fails on a fresh scaffold until `ajs project init` writes a formatted `antelope.config.ts`.
