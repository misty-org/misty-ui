import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const uiDir = join(root, "src");
export const catalogPath = join(root, "docs/components.md");

interface Entry {
  name: string;
  kind: "component" | "hook" | "helper" | "value";
  doc: string;
  file: string;
}

interface Group {
  title: string;
  entries: Entry[];
}

function resolveModule(spec: string, from = uiDir): string | undefined {
  const base = join(from, spec);
  for (const candidate of [`${base}.tsx`, `${base}.ts`, join(base, "index.ts")]) {
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

function cleanDoc(raw: string): string {
  const lines = raw
    .replace(/^\/\*\*|\*\/$/g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\* ?/, "").trimEnd());
  const paragraph: string[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (line.trim().startsWith("@")) break;
    if (!line.trim()) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(line.trim());
  }
  return paragraph.join(" ").replace(/\|/g, "\\|");
}

function kindOf(name: string, declaration: string): Entry["kind"] {
  if (/^use[A-Z]/.test(name)) return "hook";
  if (/^[A-Z]/.test(name)) {
    return /^(?:function|const\s+\w+\s*=\s*(?:forwardRef|memo|\(|React\.forwardRef|function))/.test(
      declaration,
    )
      ? "component"
      : "value";
  }
  return /^function|^const\s+\w+\s*=\s*\(/.test(declaration) ? "helper" : "value";
}

function exportsOf(file: string): Entry[] {
  const source = readFileSync(file, "utf8");
  const entries: Entry[] = [];
  for (const [, names, spec] of source.matchAll(/export\s+(?:type\s+)?(?:\*|\{([^}]*)\})\s+from\s+"(\.[^"]+)";/g)) {
    const target = resolveModule(spec, dirname(file));
    if (!target) continue;
    const wanted = names
      ?.split(",")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("type "))
      .map((part) => part.split(/\s+as\s+/).pop()!.trim());
    for (const entry of exportsOf(target)) {
      if (!wanted || wanted.includes(entry.name)) entries.push(entry);
    }
  }
  const pattern =
    /(\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*)?export\s+(?:default\s+)?((?:async\s+)?function\s*\*?\s*(\w+)[\s\S]{0,0}|const\s+(\w+)\s*(?::[^=]+)?=\s*[^\n]*|class\s+(\w+))/g;
  for (const match of source.matchAll(pattern)) {
    const name = match[3] ?? match[4] ?? match[5];
    if (!name) continue;
    const declaration = match[2].replace(/^async\s+/, "");
    entries.push({
      name,
      kind: kindOf(name, declaration),
      doc: match[1] ? cleanDoc(match[1].trim()) : "",
      file: relative(root, file),
    });
  }
  for (const [, list] of source.matchAll(/^export\s+\{([^}]*)\};?$/gm)) {
    for (const part of list.split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (!name || part.trim().startsWith("type ") || entries.some((e) => e.name === name)) continue;
      const declared = new RegExp(
        String.raw`(\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*)?((?:const|function|class)\s+${name}\b[^\n]*)`,
      ).exec(source);
      if (!declared) continue;
      const declaration = declared[2].replace(/^class/, "class");
      entries.push({
        name,
        kind: /^[A-Z]/.test(name) && !/^const\s+\w+\s*=\s*["'`\d[{]/.test(declaration)
          ? "component"
          : kindOf(name, declaration),
        doc: declared[1] ? cleanDoc(declared[1].trim()) : "",
        file: relative(root, file),
      });
    }
  }
  return entries;
}

export function buildCatalog(): string {
  const index = readFileSync(join(uiDir, "index.ts"), "utf8");
  const groups: Group[] = [];
  let group: Group = { title: "other", entries: [] };
  groups.push(group);
  const seen = new Set<string>();

  const statements = index.matchAll(
    /^\/\/ ([a-z][\w -]*)$|export\s+\*\s+from\s+"([^"]+)";|export\s+(?:type\s+)?\{([^}]*)\}\s+from\s+"([^"]+)";/gm,
  );
  for (const [, heading, starSpec, names, namedSpec] of statements) {
    if (heading) {
      group = { title: heading, entries: [] };
      groups.push(group);
      continue;
    }
    const spec = starSpec ?? namedSpec;
    const file = resolveModule(spec);
    if (!file) continue;
    let entries = exportsOf(file);
    if (names) {
      const wanted = new Set(
        names
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part && !part.startsWith("type "))
          .map((part) => part.split(/\s+as\s+/).pop()!.trim()),
      );
      entries = entries.filter((entry) => wanted.has(entry.name));
    }
    for (const entry of entries) {
      if (seen.has(entry.name)) continue;
      seen.add(entry.name);
      group.entries.push(entry);
    }
  }

  const out: string[] = [
    "<!-- Generated by scripts/design_catalog.ts from src. Don't edit: run `npm run catalog`. -->",
    "",
    "# Shared UI catalog",
    "",
    'Everything you may build with, all imported from `@misty/ui`. If it isn\'t listed here it doesn\'t',
    "exist: add it to @misty/ui first (see DESIGN.md), then regenerate this file. Read the source file before",
    "using a component for the first time; its props are the contract.",
    "",
  ];
  for (const { title, entries } of groups) {
    const shown: (Entry & { parts: string[] })[] = [];
    for (const entry of entries) {
      if (entry.kind !== "component" && entry.kind !== "hook") continue;
      const owner = shown.find(
        (base) => base.file === entry.file && entry.name.startsWith(base.name) && entry.name !== base.name,
      );
      if (owner && !entry.doc) {
        owner.parts.push(entry.name);
        continue;
      }
      shown.push({ ...entry, parts: [] });
    }
    if (!shown.length) continue;
    out.push(`## ${title[0].toUpperCase()}${title.slice(1)}`, "");
    out.push("| Export | What it is for | File |", "| --- | --- | --- |");
    for (const entry of shown) {
      const file = entry.file.replace(/^src\//, "");
      const parts = entry.parts.length
        ? ` Parts: ${entry.parts.map((part) => `\`${part}\``).join(", ")}.`
        : "";
      out.push(`| \`${entry.name}\` | ${entry.doc || "_No doc comment yet._"}${parts} | ${file} |`);
    }
    out.push("");
  }
  return `${out.join("\n").trimEnd()}\n`;
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
  mkdirSync(dirname(catalogPath), { recursive: true });
  writeFileSync(catalogPath, buildCatalog());
  console.log(`Wrote ${relative(root, catalogPath)}`);
}
