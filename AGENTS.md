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

- `pnpm run checks` needs a git repository: its `size`, `suppressions` and `sync:check` steps fail outside one. `ajs project init` creates one unless you decline or pass `--no-git-init`; then run `git init` first.
- `guardrails.suppressions.json` caps the lint directives, `@ts-expect-error` and `SAFETY:` comments; its numbers only go down. Fix the code rather than add a suppression.

<!-- antelopejs-guardrails:start -->
<!-- Managed by @antelopejs/tooling-configs. `antelopejs-sync` rewrites everything between these markers; write repository-specific guidance outside them. -->

## Guardrails

Lint with `oxlint` and format with `oxfmt`; both read the configs at the repository root. Fix every finding: no rule warns.

Prove a change works with the verification skill in [`.agents/skills/verify-template/SKILL.md`](.agents/skills/verify-template/SKILL.md) before you call it done.

### Comments

Say it in code. A constraint belongs in a type, a lint rule, or a test. A public item's contract belongs in TSDoc (`/** */`) on that item. The only other comments are lint directives that name their rules, `@ts-expect-error <reason>`, `SAFETY: <reason>` above a type assertion, `/*!` license headers, and bundler or formatter directives.

Before suppressing a type rule, try inference or a type derived from its owner with `Parameters`, `ReturnType`, or indexed access. A private alias can still appear in a published declaration. Keep a suppression only after checking the published contract and the unchecked boundary it protects.

Check each directive reason against the current line and its callers. Returning a value is not the same as awaiting and discarding it. A reason must describe what the code does now.

### Tests

Hold every test you write or keep to this checklist:

- Name the wrong implementation this test fails on. A test with no answer is deleted, not kept.
- No test reads the file it tests. Drive the behaviour through the public interface.
- An invariant over many files is a lint rule, not a test.

### Cleanup proof

A behaviour-preserving cleanup PR shows `antelopejs-api-diff <base-ref>` passing. Published declarations and built runtime exports stay unchanged; pass `--allow-added <glob>` (repeatable, e.g. `'**/internal/**'`) to let added entries under that glob pass when their module is `@internal`, and copy its "Added (allowed)" list. A comment-only PR shows `antelopejs-comment-proof <base-ref>` passing instead of a verifier. Both compare committed HEAD.

Copy counts from the proof's base and HEAD table. Never type counts by hand. Keep the command and the committed head beside the copied output. The table counts a lint directive once per rule it names, inline directives included.

Pass `--probe <file.cjs>` to api-diff when changing receivers, positional calls, or modules that no published entry reaches. The same captured script runs against both worktree roots, supplied as `argv[2]`, and prints JSON observations. Matching metadata alone does not prove those behaviours.

An entry-only rule exempts only its own module. Add a second module entry rather than exempting another importer. A no-upward rule must reject peers in the same tier as well as higher tiers. Probe the rank decision with an import, not just a reading of the configuration.

Moving a method body into a function keeps how it is called: the same receiver, argument count, read order and laziness.

Verify a boundary against the imports a developer or agent would plausibly write: static and dynamic imports, re-exports, Vue `src`, CSS `@import`, and worker or child-process entries in normally named files. A construction only an evasion would write, an edit to resolution configuration (`package.json` `browser`, `exports`, `main` or `imports`, bundler aliases, tsconfig `paths`), and a difference observable only by patching private fields or internal methods go under Attention and never block. Public API and ordinary subclass behaviour stay part of the contract.

### What enforces what

| Rule                                                                           | Enforced by                                         |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| Formatting                                                                     | oxfmt                                               |
| Lint findings are errors; no rule warns                                        | oxlint preset                                       |
| Comments are TSDoc, directives, or `SAFETY:` only                              | `antelopejs/no-comments`                            |
| Every test asserts                                                             | `antelopejs/require-assertion`                      |
| Tests read no files outside fixtures, helpers, locales                         | `antelopejs/no-fs-read-in-tests`                    |
| Tests import the code under test from local source, not their own package name | `antelopejs/no-self-import-in-tests`                |
| No assertion that restates a constant                                          | `antelopejs/no-constant-value-assertion`            |
| No test whose only check is "is a function"                                    | `antelopejs/no-typeof-function-only-test`           |
| Params ≤ 5, function ≤ 120 lines, file ≤ 500 lines, depth ≤ 4, complexity ≤ 20 | `eslint/max-*`, `eslint/complexity`                 |
| Cleanup preserves declarations and built runtime export metadata               | `antelopejs-api-diff <base-ref>`                    |
| Comment-only changes preserve JavaScript emit                                  | `antelopejs-comment-proof <base-ref>`               |
| PR-body counts come from tracked code files                                    | api-diff and comment-proof tables                   |
| Receiver, positional and unpublished-module behaviour                          | `antelopejs-api-diff <base-ref> --probe <file.cjs>` |
| Directive and `SAFETY:` reasons are true of the code                           | review; no tool                                     |
| Evasion-only and patched-internal findings go under Attention                  | review; no tool                                     |
| No-upward rules reject same-tier peers                                         | review and import probes                            |
| No `@ts-ignore`                                                                | `typescript/ban-ts-comment`                         |

<!-- antelopejs-guardrails:end -->
