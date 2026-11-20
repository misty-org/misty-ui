// What the docs site shows, read from the package itself: the examples (and their source), each
// component's props (docs/props.json), and the guidance in DESIGN.md. Nothing here is written by
// hand, so the site can't drift from the code.
import type { ComponentType } from "react";

import design from "../DESIGN.md?raw";
import propsJson from "../docs/props.json";
import groupList from "./groups.json";

export type PropDoc = { name: string; type: string; optional: boolean; doc: string };

export type Example = {
  id: string;
  group: string;
  slug: string;
  name: string;
  /** The page's title: the first component the example shows. */
  title: string;
  /** Every component the example shows, by export name. */
  components: string[];
  file: string;
  about: string;
  wide: boolean;
  order: number;
  Component: ComponentType;
  /** The example's source, as a person would write it in their own app. */
  code: string;
};

export type Group = { id: string; letter: string; title: string; examples: Example[] };

type ExampleModule = {
  default: ComponentType;
  meta: { name: string; file: string; about: string; wide: boolean; order: number };
};

const modules = import.meta.glob<ExampleModule>("./examples/*/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./examples/*/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
});

/** The source with the docs' own bookkeeping taken out and the import pointed at the package. */
function cleanSource(raw: string): string {
  return raw
    .replace(/export const meta = [^\n]*;\n\n?/, "")
    .replace(/from "(?:\.\.\/)+src"/g, 'from "@misty/ui"')
    .replace(/^import React from "react";\n/m, (line) => (/\bReact\./.test(raw) ? line : ""))
    .trim();
}

function componentsIn(name: string): string[] {
  return name
    .split("·")
    .map((part) => part.replace(/\(.*\)/, "").trim())
    .filter((part) => /^[A-Za-z]\w*$/.test(part));
}

const examples: Example[] = Object.entries(modules).map(([path, module]) => {
  const [, group, slug] = /\.\/examples\/([^/]+)\/([^/]+)\.tsx$/.exec(path)!;
  const components = componentsIn(module.meta.name);
  return {
    id: `${group}/${slug}`,
    group,
    slug,
    ...module.meta,
    title: components[0] ?? module.meta.name,
    components,
    Component: module.default,
    code: cleanSource(sources[path]),
  };
});

export const groups: Group[] = groupList.map((group) => ({
  ...group,
  examples: examples
    .filter((example) => example.group === group.id)
    .sort((a, b) => a.order - b.order),
}));

export const allExamples = groups.flatMap((group) => group.examples);

export const props = propsJson as Record<string, PropDoc[]>;

export type Guidance = { job: string; use: string; not: string };

/** The rows of DESIGN.md's "Which piece for which job" table, by the components they name. */
const guidanceRows: Guidance[] = (() => {
  const section = design.split("## Which piece for which job")[1]?.split("\n## ")[0] ?? "";
  return section
    .split("\n")
    .filter((line) => line.startsWith("|") && !line.startsWith("| Job") && !line.startsWith("| ---"))
    .map((line) => {
      const [job, use, not] = line
        .slice(1, -1)
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim());
      return { job, use, not };
    });
})();

export function guidanceFor(components: string[]): Guidance[] {
  return guidanceRows.filter((row) =>
    components.some((name) => row.use.includes(`\`${name}\``) || row.use.includes(`${name}\``)),
  );
}

/** DESIGN.md's top rules, for the home page: the numbered "Before writing any UI" list. */
export const principles: string[] = (() => {
  const section = design.split("## Before writing any UI")[1]?.split("\n## ")[0] ?? "";
  return section
    .split(/\n(?=\d+\. )/)
    .filter((item) => /^\d+\. /.test(item.trim()))
    .map((item) => item.trim().replace(/^\d+\.\s*/, "").replace(/\s+/g, " "));
})();
