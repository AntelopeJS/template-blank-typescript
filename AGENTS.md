# antelopejs-module

An AntelopeJS module in TypeScript, created from the Blank Typescript template (AntelopeJS/template-blank-typescript). `ajs project init` copies every file of the template except `.git` into the new project.

## Layout

- `src/index.ts` exports the `construct`, `start`, `stop` and `destroy` lifecycle hooks. `tsc` compiles `src/` into `dist/`, and `antelopeJs.baseUrl` in `package.json` points the runtime at `dist`.
- `antelope.config.ts` is written by `ajs project init` and loads the module from the project root. `antelope.test.ts` is the `antelopeJs.test` config. Both name the module `antelopejs-module`: rename it there too when you rename it in `package.json`.

## Versioning

Every `@antelopejs/*` range stops below the next minor of its floor: `>=0.5.1 <0.6.0` on a 0.x package, `~1.23.3` on a 1.x one. The core loads one copy of each interface and refuses to start a module whose range excludes it, so keep `@antelopejs/interface-core` on the minor `@antelopejs/core` requires. The `dependency:ranges` step of `pnpm run checks` enforces the ranges.

## Tests

- `pnpm test` runs `ajs module test` with `@antelopejs/core` from the devDependencies: it compiles the module with the project's own `tsc`, run by `node` without `npx` (the `installCommand` of `antelope.test.ts`), loads and starts it, then runs the `*.test.ts` and `*.spec.ts` files under `test/` with mocha against `dist`. `pnpm run checks` runs it.
- `typecheck` covers `src/` only. The tests run the files of `test/` and `antelope.test.ts` without a type check, so a type error there passes `checks`.
- `knip.config.ts` ignores `@types/mocha`, which only the test globals use.

## Guardrails setup

- `pnpm run checks` needs a git repository: its `size`, `suppressions` and `sync:check` steps fail outside one. `ajs project init` creates one unless you decline or pass `--no-git-init`; then run `git init` first.
- `guardrails.suppressions.json` caps the lint directives, `@ts-expect-error` and `SAFETY:` comments; its numbers only go down. Fix the code rather than add a suppression.

<!-- antelopejs-guardrails:start -->
<!-- Managed by @antelopejs/tooling-configs. `antelopejs-sync` rewrites everything between these markers; write repository-specific guidance outside them. -->

## Guardrails

Lint with `oxlint` and format with `oxfmt`; both read the configs at the repository root. Fix every finding: no rule warns.

### Comments

Say it in code: a constraint in a type, a lint rule or a test, a public item's contract in TSDoc. Other comments are lint directives naming their rules, `@ts-expect-error <reason>`, `SAFETY: <reason>` above a type assertion, and license or tool directives. A reason states what the code does now.

### Tests

Each test names the wrong implementation it fails on, or is deleted. Drive behaviour through the public interface. An invariant over many files is a lint rule.

### Review

No tool checks these:

- A type guard checks the nested elements and values it claims.
- A no-upward import rule rejects same-tier peers; probe it with an import.
- A finding only an evasion or a patched internal can trigger goes under Attention and never blocks.

<!-- antelopejs-guardrails:end -->
