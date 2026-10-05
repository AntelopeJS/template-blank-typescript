import assert from "node:assert";
import { construct, destroy, start, stop } from "../dist/index.js";

describe("antelopejs-module", () => {
  it("exports the lifecycle hooks", () => {
    // The test runner builds, loads and starts the module before the tests run.
    for (const hook of [construct, start, stop, destroy]) {
      assert.strictEqual(typeof hook, "function");
    }
  });
});
