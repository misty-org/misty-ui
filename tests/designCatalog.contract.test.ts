import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { buildCatalog, catalogPath } from "../scripts/design-catalog";

// docs/components.md is read from the code. When src changes, `npm run catalog` writes it
// again; this fails until it has.
describe("design catalog contract", () => {
  it("lists every export as the code has it", () => {
    expect(readFileSync(catalogPath, "utf8")).toBe(buildCatalog());
  });
});
