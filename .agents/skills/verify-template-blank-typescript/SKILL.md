---
name: verify-template-blank-typescript
description: How to check a change in AntelopeJS/template-blank-typescript, the Blank Typescript module template, before you push it. The command for each kind of change, the tools, the services, how to scope a run to what you touched, and what CI and the merge queue run instead of you. Use after you edit the module, its tests, a config or a doc, before you commit or push.
---

# Verify template-blank-typescript

CI runs every check on every pull request, and the merge queue runs them again on the merged result. You check only what you changed. `ajs project init` copies every file of this repository except `.git` into a new project, so the checks below also cover what a new project inherits.

## Setup

Once per checkout: `pnpm install --frozen-lockfile`. It needs Node 24 (`.nvmrc`) and pnpm 10.34.9 (`packageManager` in `package.json`, through corepack). The install also installs the lefthook commit hook.

## What to run for your change

| You changed | Run |
| --- | --- |
| Any file | `pnpm exec oxlint <files>` and `pnpm exec oxfmt --check <files>` on the files you changed. |
| `src/` | `pnpm run typecheck`, which runs on the whole project in about a second, then `pnpm test -f test/example.test.ts`. |
| A test under `test/` | `pnpm test -f test/<name>.test.ts`. No type check covers `test/`, so read the test's output, not only its exit code. |
| `antelope.test.ts`, `tsconfig*.json`, `src/package.json` | `pnpm test -f test/example.test.ts`: it compiles the module, loads it in the core and runs the test against `dist`. |
| A dependency in `package.json` | `pnpm install`, commit `pnpm-lock.yaml`, then `pnpm run knip`. Keep every `@antelopejs/*` range below the next minor of its floor, as `AGENTS.md` says. |
| A lint directive, `@ts-expect-error` or `SAFETY:` comment | `pnpm run suppressions`. After you remove one, run `pnpm run suppressions:update` and commit `guardrails.suppressions.json`. |
| A file `antelopejs-sync` writes (`.github/workflows/ci.yml`, `lefthook.yml`, the Guardrails block of `AGENTS.md`, the `scripts` it owns, `.agents/skills/technical-writing`, `.agents/skills/unslop`) | Nothing by hand. Bump `@antelopejs/tooling-configs`, run `pnpm run sync`, then `pnpm run sync:check`. |
| `README.md` or another doc | The lint and format row. CI's `Check documentation` step checks the code blocks of `README.md`. |

## Tools

- Tests: mocha through `ajs module test` (`@antelopejs/core` from the devDependencies), configured by `antelope.test.ts`. `-f` takes one file under `test/` and runs it alone. Mocha runs the file in one process, so the run stays under the 4-worker cap with no flag. The `test` script sets `--timeout 30000`.
- Lint: oxlint with `oxlint.config.ts`. Format: oxfmt with `oxfmt.config.ts`. Dead code and dependencies: knip with `knip.config.ts`. All of them extend `@antelopejs/tooling-configs`.
- Type check: `tsc --noEmit` with `tsconfig.json`, which covers `src/` only.

## Services

No test needs a service: the module has no database, cache or mail dependency.

## Left to CI

Do not run these locally. `.github/workflows/ci.yml` calls `AntelopeJS/.github/.github/workflows/ci-node.yml@v2`, and its `ci / checks` and `verdict` jobs gate the merge:

- `pnpm run checks` and the full test suite: the `Node .nvmrc` job, on every pull request and in the merge queue.
- The steps that read the npm registry (`dependency:ranges`, `lockfile:module-peers`, `readme:version`, `published:types`): the merge queue and the nightly run only.
- The pull request title check, the documentation check of `README.md`, and the check that the module locks are committed.
- Windows (`Node .nvmrc on Windows`) and `Stress`: the nightly run, at 02:17 UTC.

When a CI job fails, read its log, reproduce that one check or test file with its row above, fix it, and push.

## Done

The change is checked when every row its diff touches passed, with each command and its output in your reply or pull request. Name the checks you left to CI.
