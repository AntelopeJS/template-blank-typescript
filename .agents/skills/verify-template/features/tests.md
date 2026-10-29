---
covers:
  - antelope.test.ts
  - test/**
docs:
  - README.md
journeys:
  - scaffold-test
  - scaffold-test-fails
---

# Tests

The module's test setup: `antelope.test.ts` and `test/example.test.ts`, run by `pnpm test`.

## Sub-features

- `scaffold-test`: `pnpm test` passes and the output names the lifecycle test and `1 passing`.
- `scaffold-test-fails`: a test that throws, added to the scaffold, makes `pnpm test` fail with its message and `1 failing`.

## How to get to it (user POV)

- `pnpm test` in the scaffolded project.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" tests
```

## Gotchas

- Every journey scaffolds from an offline manifest of this working tree and installs with `pnpm install --frozen-lockfile`; nothing reaches GitHub.
