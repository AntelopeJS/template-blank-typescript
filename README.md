# AntelopeJS Blank TypeScript Template

<div align="center">
<a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/sjK28QHrA7"><img src="https://img.shields.io/badge/Discord-18181B?logo=discord&style=for-the-badge&color=000000" alt="Discord"></a>
</div>

A minimal starter template for creating AntelopeJS modules with TypeScript. This template provides the basic lifecycle hooks and project configuration, ready for you to build on.

## Quick start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development mode:

   ```bash
   pnpm run dev
   ```

## Project structure

```
src/
└── index.ts              # Module entry point with lifecycle hooks
antelope.config.ts        # AntelopeJS project configuration
package.json
tsconfig.json
```

The module entry point exports four lifecycle hooks:

- `construct()` — Called when the module is loaded. Use this to initialize resources.
- `start()` — Called to activate the module after construction.
- `stop()` — Called to deactivate the module.
- `destroy()` — Called to release all resources.

## Available scripts

- `pnpm run build` — Build the module for distribution.
- `pnpm run dev` — Start development mode with watch.

## Learn more

- [AntelopeJS Documentation](https://antelopejs.com/docs/get-started)
- [Module Architecture](https://antelopejs.com/docs/interfaces/module-management)
