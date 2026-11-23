import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { popupSurfaceClass } from "./popup_styles";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const shadowOrRing = /(?<![\w:-])(?:shadow-(?!none\b)[\w[]|ring-(?:1|2|\[)|ring-cream)/;

describe("popup edges", () => {
  it("the popup surface draws its edge with popup-edge and casts no shadow", () => {
    expect(popupSurfaceClass.split(/\s+/)).toContain("popup-edge");
    expect(popupSurfaceClass).not.toMatch(shadowOrRing);
    expect(popupSurfaceClass).not.toMatch(/(?<![\w-])border(?:-|\b)/);
  });

  it("the global popup rule and popup-edge draw the same outline over a transparent border", () => {
    const edge = [
      "border: 1px solid transparent;",
      "outline: 1px solid color-mix(in srgb, currentColor 24%, transparent) !important;",
      "outline-offset: -1px !important;",
    ];
    const overlays = read("styles/overlays.css");
    const utility = read("styles/components.css").match(/@utility popup-edge \{[^}]*\}/)?.[0];
    expect(utility).toBeTruthy();
    for (const line of edge) {
      expect(overlays).toContain(line);
      expect(utility).toContain(line);
    }
    const chrome = overlays.match(/\)\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(chrome).not.toMatch(/border:\s*1px solid (?!transparent)/);
    expect(chrome).toContain("box-shadow: none;");
    expect(chrome).toContain(edge[1]);
  });

  it("every Radix popup that sets an inline outline is covered by the edge rule", () => {
    const overlays = read("styles/overlays.css");
    for (const slot of [
      "dropdown-menu-content",
      "dropdown-menu-sub-content",
      "context-menu-content",
      "context-menu-sub-content",
      "select-content",
    ])
      expect(overlays).toContain(`[data-slot="${slot}"]`);
  });

  it("no shared popup or dialog surface adds a shadow or a ring edge of its own", () => {
    const dir = resolve(root, "src/overlays");
    const skip = new Set(["Tour.tsx", "FloatingPip.tsx"]);
    const offenders = readdirSync(dir)
      .filter((name) => name.endsWith(".tsx") && !name.includes(".test.") && !skip.has(name))
      .filter((name) => shadowOrRing.test(read(`src/overlays/${name}`)));
    expect(offenders).toEqual([]);
  });
});
