// @vitest-environment node
// It reads files from disk by their file URL, which only Node gives.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { buildCatalog, catalogPath } from "../scripts/design_catalog";
import { buildExamples, examplesPath } from "../scripts/examples";

describe("design catalog contract", () => {
  it("lists every export as the code has it", () => {
    expect(readFileSync(catalogPath, "utf8")).toBe(buildCatalog());
  });

  it("lists every example as its file has it", () => {
    expect(readFileSync(examplesPath, "utf8")).toBe(buildExamples());
  });
});
