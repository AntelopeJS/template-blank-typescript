import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  equal,
  exists,
  exitIs,
  fileHas,
  has,
  type JourneyContext,
  type VerifyConfig,
} from "@antelopejs/tooling-configs/verify";

const HOOKS = "construct,destroy,start,stop";

/** Scaffolds a project from the template with `ajs project init` and installs it; returns its folder. */
async function scaffolded(context: JourneyContext, install = true): Promise<string> {
  const project = join(context.work, "app");
  const init = await context.scaffold("ajs project init", project);
  context.expect(init.folder, [exitIs(init, 0), exists(join(project, "antelope.config.ts"))], { critical: true });
  context.tree("scaffolded tree", project);
  if (install) {
    const done = await context.command("pnpm install", "pnpm", ["install", "--frozen-lockfile", "--prefer-offline"], { cwd: project });
    context.expect(done.folder, [exitIs(done, 0)], { critical: true });
  }
  return project;
}

function manifestOf(project: string): { name?: string; main?: string; scripts?: Record<string, string>; antelopeJs?: { baseUrl?: string; test?: string } } {
  // SAFETY: the scaffolded package.json is the template's own JSON manifest.
  return JSON.parse(readFileSync(join(project, "package.json"), "utf8")) as ReturnType<typeof manifestOf>;
}

const config: VerifyConfig = {
  doors: {
    data: null,
    format: null,
    contract: null,
    outbound: null,
    exposure: {
      globs: [".gitignore", ".npmrc"],
      funnels: [],
      containments: [],
      why: "every project scaffolded from the template inherits what git and npm leave out; a dropped .env line commits secrets in projects a revert never reaches",
    },
    publish: null,
  },
  template: {
    name: "Blank Typescript",
    probe: { log: /Constructed modules/ },
  },
  journeys: {
    "scaffold-shape": {
      title: "the scaffolded project has the module's manifest, a project config naming the module, and the files the user edits",
      entryPoint: "`ajs project init my-app --template \"Blank Typescript\"`",
      async run(context) {
        const project = await scaffolded(context, false);
        const manifest = manifestOf(project);
        context.expect(context.tree("scaffolded files", project).folder, [
          equal("the module name", manifest.name, "antelopejs-module"),
          equal("the entry is the compiled module", manifest.main, "dist/index.js"),
          equal("the runtime reads dist", manifest.antelopeJs?.baseUrl, "dist"),
          equal("the test config is named", manifest.antelopeJs?.test, "antelope.test.ts"),
          equal("every documented script exists", ["dev", "build", "test", "checks", "typecheck", "lint"].filter((name) => !manifest.scripts?.[name]), []),
          exists(join(project, "src/index.ts")),
          exists(join(project, "test/example.test.ts")),
          exists(join(project, "antelope.test.ts")),
          exists(join(project, ".nvmrc")),
          fileHas(join(project, "antelope.config.ts"), /antelopejs-module/),
          fileHas(join(project, "antelope.config.ts"), /type: "local"/),
          fileHas(join(project, "src/index.ts"), /export function construct/),
          fileHas(join(project, "src/index.ts"), /export function start/),
          fileHas(join(project, "src/index.ts"), /export function stop/),
          fileHas(join(project, "src/index.ts"), /export function destroy/),
        ]);
      },
    },
    "module-exports": {
      title: "the built module exports exactly the four lifecycle hooks, and each runs",
      entryPoint: "`pnpm run build`, then loading `dist/index.js`",
      async run(context) {
        const project = await scaffolded(context);
        const build = await context.command("pnpm run build", "pnpm", ["run", "build"], { cwd: project });
        context.expect(build.folder, [exitIs(build, 0), exists(join(project, "dist/index.js")), exists(join(project, "dist/index.d.ts"))], { critical: true });
        const keys = await context.command("exports of dist/index.js", "node", ["-p", "Object.keys(require('./dist/index.js')).sort().join()"], { cwd: project });
        context.expect(keys.folder, [exitIs(keys, 0), equal("the four hooks", keys.stdout.trim(), HOOKS)]);
        const run = await context.command("run the hooks in order", "node", ["-e", "const m = require('./dist/index.js'); for (const hook of ['construct', 'start', 'stop', 'destroy']) { if (m[hook]() !== undefined) process.exit(3); }"], { cwd: project });
        context.expect(run.folder, [exitIs(run, 0)]);
      },
    },
    "scaffold-test": {
      title: "the scaffolded project's own test runs through `pnpm test` and passes, with the lifecycle test named in the output",
      entryPoint: "`pnpm test` in the scaffolded project",
      async run(context) {
        const project = await scaffolded(context);
        const test = await context.command("pnpm test", "pnpm", ["test"], { cwd: project });
        context.expect(test.folder, [exitIs(test, 0), has("stdout", test.stdout, /runs a full lifecycle without throwing/), has("stdout", test.stdout, /1 passing/)]);
      },
    },
    "scaffold-test-fails": {
      title: "a failing test added to the scaffolded project makes `pnpm test` fail and be reported",
      entryPoint: "`pnpm test` after adding `test/broken.test.ts`",
      async run(context) {
        const project = await scaffolded(context);
        context.edit("add a failing test", join(project, "test/broken.test.ts"), "describe('broken', () => { it('fails', () => { throw new Error('verify-broken'); }); });\n");
        const test = await context.command("pnpm test", "pnpm", ["test"], { cwd: project });
        context.expect(test.folder, [equal("the run failed", test.exitCode !== 0, true), has("output", test.stdout + test.stderr, /verify-broken/), has("output", test.stdout, /1 failing/)]);
      },
    },
    "scaffold-lint": {
      title: "the scaffolded project passes its typecheck, lint and knip",
      entryPoint: "`pnpm run typecheck`, `pnpm run lint` and `pnpm run knip`",
      async run(context) {
        const project = await scaffolded(context);
        for (const script of ["typecheck", "lint", "knip"]) {
          const done = await context.command(`pnpm run ${script}`, "pnpm", ["run", script], { cwd: project });
          context.expect(done.folder, [exitIs(done, 0)]);
        }
      },
    },
    "scaffold-lint-rejects": {
      title: "typecheck rejects an unused local, and lint rejects a debugger statement, so the configs are live",
      entryPoint: "`pnpm run typecheck` and `pnpm run lint` after editing `src/index.ts`",
      async run(context) {
        const project = await scaffolded(context);
        context.edit("add an unused local", join(project, "src/unused.ts"), "export function unused(): void {\n  const value = 1;\n}\n");
        const typecheck = await context.command("pnpm run typecheck", "pnpm", ["run", "typecheck"], { cwd: project });
        context.expect(typecheck.folder, [equal("typecheck failed", typecheck.exitCode !== 0, true), has("typecheck output", typecheck.stdout + typecheck.stderr, /value/)]);
        context.edit("replace it with a debugger statement", join(project, "src/unused.ts"), "debugger;\nexport {};\n");
        const lint = await context.command("pnpm run lint", "pnpm", ["run", "lint"], { cwd: project });
        context.expect(lint.folder, [equal("lint failed", lint.exitCode !== 0, true), has("lint output", lint.stdout + lint.stderr, /debugger/)]);
      },
    },
    "scaffold-checks": {
      title: "the scaffolded project passes `pnpm run checks`, as it must before the user changes anything",
      entryPoint: "`pnpm run checks` in the scaffolded project",
      async run(context) {
        const project = await scaffolded(context);
        const checks = await context.command("pnpm run checks", "pnpm", ["run", "checks"], { cwd: project });
        context.expect(checks.folder, [exitIs(checks, 0)]);
      },
    },
    "scaffold-docs": {
      title: "every command the README and CONTRIBUTING name exists in the scaffolded project, and the files they point at are there",
      entryPoint: "reading `README.md` and `CONTRIBUTING.md` of the scaffolded project",
      async run(context) {
        const project = await scaffolded(context, false);
        const scripts = manifestOf(project).scripts ?? {};
        const readme = readFileSync(join(project, "README.md"), "utf8");
        const contributing = readFileSync(join(project, "CONTRIBUTING.md"), "utf8");
        const named = [...new Set([...readme.matchAll(/`pnpm (?:run )?([a-z:]+)`/g)].map((match) => match[1] ?? ""))].filter((name) => name !== "install" && name !== "add");
        const tree = context.tree("scaffolded files", project);
        context.expect(tree.folder, [
          equal("README commands without a script", named.filter((name) => !scripts[name]), []),
          equal("README names at least dev, build and test", ["dev", "build", "test"].filter((name) => !named.includes(name)), []),
          has("README", readme, /antelope\.config\.ts/),
          has("CONTRIBUTING", contributing, /./),
          fileHas(join(project, "LICENSE"), /License/i),
          exists(join(project, "CONTRIBUTING.md")),
          exists(join(project, "AGENTS.md")),
        ]);
      },
    },
    "scaffold-gitignore": {
      title: "the scaffolded project's git ignores secrets, dependencies and build output, and keeps its sources tracked",
      entryPoint: "`git check-ignore` and `git status` in the scaffolded project",
      async run(context) {
        const project = await scaffolded(context);
        const build = await context.command("pnpm run build", "pnpm", ["run", "build"], { cwd: project });
        context.expect(build.folder, [exitIs(build, 0)], { critical: true });
        context.edit("create a .env", join(project, ".env"), "SECRET=verify\n");
        for (const path of [".env", ".env.local", "node_modules/x", "dist/index.js", "coverage/x", ".antelope/cache/x"]) {
          const ignored = await context.command(`git check-ignore ${path}`, "git", ["check-ignore", "-q", path], { cwd: project });
          context.expect(ignored.folder, [equal(`${path} is ignored`, ignored.exitCode, 0)]);
        }
        for (const path of ["src/index.ts", "package.json", "README.md", "antelope.test.ts"]) {
          const kept = await context.command(`git check-ignore ${path}`, "git", ["check-ignore", "-q", path], { cwd: project });
          context.expect(kept.folder, [equal(`${path} is not ignored`, kept.exitCode, 1)]);
        }
        const status = await context.command("untracked files after install, build and .env", "git", ["ls-files", "--others", "--exclude-standard"], { cwd: project });
        const leaked = status.stdout.split("\n").filter((path) => /^(node_modules|dist|coverage|\.antelope)\/|^\.env/.test(path));
        context.expect(status.folder, [equal("no secret, dependency or build output is left untracked", leaked, [])]);
      },
    },
  },
};

export default config;
