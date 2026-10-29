import assert from "node:assert";
import { construct, destroy, start, stop } from "../dist/index.js";

describe("antelopejs-module", () => {
  it("runs a full lifecycle without throwing", () => {
    // The test runner builds, loads and starts the module before the tests run.
    assert.doesNotThrow(() => {
      construct();
      start();
      stop();
      destroy();
    });
  });
});
