import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { controlFrame } from "../src";

const root = join(import.meta.dirname, "..");
const repositoryPath = (path: string) => relative(root, path);
const walk = (folder: string, extensions: ReadonlySet<string>): string[] =>
  readdirSync(join(root, folder), { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, folder, entry.name);
    if (entry.isDirectory()) return walk(relative(root, path), extensions);
    return extensions.has(entry.name.slice(entry.name.lastIndexOf("."))) ? [path] : [];
  });

const controlFiles = [
  ...walk("src/controls", new Set([".ts", ".tsx"])),
  ...walk("src/feedback", new Set([".tsx"])).filter((path) =>
    path.endsWith("Skeleton.tsx"),
  ),
].filter((path) => !path.endsWith("control_frame.ts") && !/\.test\.tsx?$/.test(path));

const literal = /"[^"\n]*"|'[^'\n]*'|`[^`]*`/g;
const height = /(?<![\w[-])(?:h|size)-(?:6|8|9)(?![\w.-])/;
const corner = /(?<![\w[-])rounded-(?:sm|md|lg|xl)(?![\w-])/;

describe("control frames", () => {
  it("gives every size one height and one corner, with fields and buttons alike", () => {
    expect(controlFrame.md).toMatch(/\bh-8\b/);
    expect(controlFrame.lg).toMatch(/\bh-9\b/);
    expect(controlFrame.md.match(corner)?.[0]).toBe(controlFrame.lg.match(corner)?.[0]);
  });

  it("keeps shared controls from pairing a height with corners of their own", () => {
    const failures: string[] = [];
    for (const path of controlFiles) {
      const text = readFileSync(path, "utf8");
      for (const match of text.matchAll(literal)) {
        const value = match[0];
        if (height.test(value) && corner.test(value)) {
          const line = text.slice(0, match.index).split("\n").length;
          failures.push(`${repositoryPath(path)}:${line}: ${value} (use controlFrame)`);
        }
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});
