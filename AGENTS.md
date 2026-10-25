# antelopejs-module

An AntelopeJS module in TypeScript, created from the Blank Typescript template (AntelopeJS/template-blank-typescript). `ajs project init` copies every file of the template except `.git` into the new project.

## Layout

- `src/index.ts` exports the `construct`, `start`, `stop` and `destroy` lifecycle hooks. `tsc` compiles `src/` into `dist/`, and `antelopeJs.baseUrl` in `package.json` points the runtime at `dist`.
- `antelope.config.ts` is written by `ajs project init` and loads the module from the project root. `antelope.test.ts` is the `antelopeJs.test` config. Both name the module `antelopejs-module`: rename it there too when you rename it in `package.json`.

## Versioning

`@antelopejs/interface-core` stays `>=<floor> <1.0.0`: the core loads one copy of each interface and refuses to start a module whose range excludes it. Raise only the floor. `pnpm exec antelopejs-check-interface-ranges` checks the ranges; `checks` does not run it.

## Tests

- `pnpm test` runs `ajs module test` with `@antelopejs/core` from the devDependencies: it compiles the module with `npx tsc` (the `installCommand` of `antelope.test.ts`), loads and starts it, then runs the `*.test.ts` and `*.spec.ts` files under `test/` with mocha against `dist`. `pnpm run checks` runs it.
- `typecheck` covers `src/` only. The tests run the files of `test/` and `antelope.test.ts` without a type check, so a type error there passes `checks`.
- `knip.config.ts` ignores `@types/mocha`, which only the test globals use.

## Guardrails setup

- `pnpm run checks` and the lefthook hooks need a git repository. `ajs project init` installs the dependencies before it runs `git init`, so run `pnpm install` once more after `git init` to install the hooks.
- `guardrails.ratchet.json` records the three findings of the sample `test/example.test.ts`. Those rules are off for `oxlint`; `pnpm run ratchet` counts them instead. After you replace the sample test, run `pnpm run ratchet:update` and commit the lowered file.

<!-- antelopejs-guardrails:start -->
<!-- Managed by @antelopejs/tooling-configs. `antelopejs-sync` rewrites everything between these markers; write repository-specific guidance outside them. -->

## Guardrails

Lint with `oxlint` and format with `oxfmt`; both read the configs at the repository root. Fix every finding: no rule warns.

### Comments

Say it in code. A constraint belongs in a type, a lint rule, or a test. A public item's contract belongs in TSDoc (`/** */`) on that item. The only other comments are lint directives that name their rules, `@ts-expect-error <reason>`, `SAFETY: <reason>` above a type assertion, `/*!` license headers, and bundler or formatter directives.

### Tests

Hold every test you write or keep to this checklist:

- Name the wrong implementation this test fails on. A test with no answer is deleted, not kept.
- No test reads the file it tests. Drive the behaviour through the public interface.
- An invariant over many files is a lint rule, not a test.

### What enforces what

| Rule                                                                           | Enforced by                               |
| ------------------------------------------------------------------------------ | ----------------------------------------- |
| Formatting                                                                     | oxfmt                                     |
| Lint findings are errors; no rule warns                                        | oxlint preset                             |
| Comments are TSDoc, directives, or `SAFETY:` only                              | `antelopejs/no-comments`                  |
| Every test asserts                                                             | `antelopejs/require-assertion`            |
| Tests read no files outside fixtures, helpers, locales                         | `antelopejs/no-fs-read-in-tests`          |
| No assertion that restates a constant                                          | `antelopejs/no-constant-value-assertion`  |
| No test whose only check is "is a function"                                    | `antelopejs/no-typeof-function-only-test` |
| Params ≤ 5, function ≤ 120 lines, file ≤ 500 lines, depth ≤ 4, complexity ≤ 20 | `eslint/max-*`, `eslint/complexity`       |

<!-- antelopejs-guardrails:end -->
