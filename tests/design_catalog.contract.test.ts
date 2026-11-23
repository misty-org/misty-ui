// @vitest-environment node
// It reads files from disk by their file URL, which only Node gives.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { buildCatalog, catalogPath } from "../scripts/design_catalog";

describe("design catalog contract", () => {
  it("lists every export as the code has it", () => {
    expect(readFileSync(catalogPath, "utf8")).toBe(buildCatalog());
  });
});
