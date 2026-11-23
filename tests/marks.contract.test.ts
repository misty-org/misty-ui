// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const icons = new URL("../src/icons/", import.meta.url);
const marks = JSON.parse(readFileSync(new URL("marks.json", icons), "utf8")) as Record<
  string,
  { name: string; kinds: string[]; render: string; aliases?: string[]; source: string }
>;
const artwork = readdirSync(new URL("marks/", icons))
  .filter((name) => name.endsWith(".svg"))
  .map((name) => name.slice(0, -4))
  .sort();

describe("marks registry", () => {
  it("has one artwork file for every entry and an entry for every file", () => {
    expect(artwork).toEqual(Object.keys(marks).sort());
  });

  it("keeps mark_assets.ts in step with marks.json", () => {
    const assets = readFileSync(new URL("mark_assets.ts", icons), "utf8");
    for (const id of Object.keys(marks)) expect(assets).toContain(`"./marks/${id}.svg?no-inline"`);
  });

  it("gives every entry a name, a kind, a known render and a source", () => {
    for (const [id, entry] of Object.entries(marks)) {
      expect(entry.name, id).toBeTruthy();
      expect(entry.kinds.length, id).toBeGreaterThan(0);
      for (const kind of entry.kinds) expect(["brand", "engine", "provider"], id).toContain(kind);
      expect(["theme", "color", "plate-dark", "plate-light"], id).toContain(entry.render);
      expect(entry.source, id).toBeTruthy();
    }
  });

  it("never gives two marks the same alias or an alias that is another mark's id", () => {
    const seen = new Map<string, string>();
    for (const [id, entry] of Object.entries(marks)) {
      for (const alias of entry.aliases ?? []) {
        expect(marks[alias], `${alias} on ${id} is also a mark`).toBeUndefined();
        expect(seen.get(alias), `${alias} on ${id}`).toBeUndefined();
        seen.set(alias, id);
      }
    }
  });
});
