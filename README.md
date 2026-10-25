# AntelopeJS Blank TypeScript Template

<div align="center">
<a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/License-Apache_2.0-000000?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/sjK28QHrA7"><img src="https://img.shields.io/badge/Discord-18181B?logo=discord&style=for-the-badge&color=000000" alt="Discord"></a>
<a href="https://framework.antelopejs.com/docs/get-started/quick-start"><img src="https://img.shields.io/badge/Docs-18181B?style=for-the-badge&color=000000" alt="Documentation"></a>
</div>

The smallest AntelopeJS module in TypeScript: the four lifecycle hooks, a build, and a test setup. It is the default template of `ajs project init`.

## What you get

```
my-app/
├── src/
│   └── index.ts          # construct, start, stop and destroy hooks
├── test/
│   └── example.test.ts   # a Mocha test run by ajs module test
├── antelope.config.ts    # written by ajs project init: the project loads this module
├── antelope.test.ts      # test configuration, referenced by antelopeJs.test
├── package.json
└── tsconfig.json
```

## Create it

Install the CLI once with `pnpm add -g @antelopejs/core`, then create a project from this template:

```bash
ajs project init my-app --template "Blank Typescript"
```

The command copies the template, installs its dependencies, and writes an `antelope.config.ts` that loads the module from the project root. Run `ajs project init my-app` without flags to answer the questions interactively.

## Run it

```bash
cd my-app
ajs project dev --watch
```

The project builds the module with `tsc` and rebuilds it when a file of `src/` changes. `pnpm dev` runs the same command.

| Command      | What it does                                                                             |
| ------------ | ---------------------------------------------------------------------------------------- |
| `pnpm dev`   | Runs the project in watch mode                                                           |
| `pnpm build` | Builds the module into `dist/`                                                           |
| `pnpm test`  | Builds the module, starts it, and runs the `test/*.test.ts` files with `ajs module test` |

If you rename the module in `package.json`, rename it in `antelope.config.ts` and `antelope.test.ts` too.

## Next steps

- [Quick start](https://framework.antelopejs.com/docs/get-started/quick-start): what happens when a project starts.
- [API routing](https://framework.antelopejs.com/docs/guides/api-routing): add HTTP routes.
- [Modules](https://framework.antelopejs.com/docs/concepts/modules): what the lifecycle hooks do.
- [Interfaces](https://framework.antelopejs.com/docs/concepts/interfaces): how modules talk to each other.
- [Testing](https://framework.antelopejs.com/docs/module-development/testing): write module tests.

Using Claude Code or Codex? Install the [AntelopeJS agent skills plugin](https://github.com/AntelopeJS/agent-skills) so your agent knows the framework and its CLI.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Run `pnpm install` then `pnpm run checks` before you open a pull request. It runs the typecheck, lint, format, knip, the tests, and the guardrail checks, the same as CI.

## License

[Apache-2.0](./LICENSE)
