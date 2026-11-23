import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const walk = (folder: string, extensions: ReadonlySet<string>): string[] =>
  readdirSync(join(root, folder), { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, folder, entry.name);
    if (entry.isDirectory()) return walk(relative(root, path), extensions);
    return extensions.has(entry.name.slice(entry.name.lastIndexOf("."))) ? [path] : [];
  });

const sources = [
  ...walk("src", new Set([".ts", ".tsx", ".css"])),
  ...walk("styles", new Set([".css"])),
  ...walk("site", new Set([".ts", ".tsx", ".css"])),
].filter((path) => !path.endsWith("no_focus_ring.contract.test.ts"));

const focusClass =
  /(?<![\w-])(?:[\w-]+:)*(?:group-|peer-)?focus(?:-visible|-within)?(?:\/[\w-]+)?:(?:[\w-]+:)*-?(?:outline|ring|shadow)(?!-none\b|-hidden\b)(?:-[\w/[\].()%,-]+)?/g;

const cssRule = /([^{}]*:focus(?:-visible|-within)?[^{}]*)\{([^{}]*)\}/g;
const ringDeclaration =
  /(?:^|;)\s*(outline(?:-width|-style|-color)?|box-shadow|--tw-ring-[\w-]+)\s*:(?!\s*(?:none|0|transparent)\b)[^;]+/;

describe("no focus rings", () => {
  it("draws no ring, outline or shadow on focus in any component", () => {
    const failures: string[] = [];
    for (const path of sources) {
      const text = readFileSync(path, "utf8");
      for (const match of text.matchAll(focusClass)) {
        failures.push(`${relative(root, path)}: ${match[0]}`);
      }
      if (path.endsWith(".css")) {
        for (const [, selector, body] of text.matchAll(cssRule)) {
          const declaration = body.match(ringDeclaration);
          if (declaration) {
            failures.push(`${relative(root, path)}: ${selector.trim()} { ${declaration[0].trim()} }`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("takes the browser's own focus ring away everywhere", () => {
    const focus = readFileSync(join(root, "styles/focus.css"), "utf8");
    expect(focus).toMatch(/:focus-visible\s*\{\s*outline:\s*none;/);
    expect(readFileSync(join(root, "styles/index.css"), "utf8")).toContain('@import "./focus.css";');
  });
});
