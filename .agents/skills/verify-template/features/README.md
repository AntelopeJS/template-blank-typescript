# Feature map

One file per feature. `covers:` lists the source globs it owns, `docs:` the pages a verdict judges, `journeys:` the journeys it runs, and `seeded-breaks/<feature>.patch` the break its journeys must catch. `pnpm exec antelopejs-verify map` checks that every user-facing file is covered: in a template that is every file `ajs` copies.

| Feature | What the user does | Journeys |
|---|---|---|
| [module](module.md) | Scaffolds a project and runs the module it copies. | scaffold-dev, scaffold-shape, module-exports |
| [tests](tests.md) | Runs `pnpm test`. | scaffold-test, scaffold-test-fails |
| [tooling](tooling.md) | Runs typecheck, lint, knip and `pnpm run checks`. | scaffold-lint, scaffold-lint-rejects, scaffold-checks |
| [docs](docs.md) | Reads the README, CONTRIBUTING and the license. | scaffold-docs |
| [git](git.md) | Commits in a project whose `.gitignore` the template wrote. | scaffold-gitignore |
| [smoke](smoke.md) | The fixed journey every verdict runs: scaffold, install, dev, stop. | scaffold-dev |
