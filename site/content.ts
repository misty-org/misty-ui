import type { ComponentType } from "react";

import exampleList from "./examples.json";
import groupList from "./groups.json";

export type PropDoc = { name: string; type: string; optional: boolean; doc: string };

export type ExampleDetails = {
  Component: ComponentType;
  code: string;
  props: Record<string, PropDoc[]>;
};

export type Example = {
  id: string;
  group: string;
  slug: string;
  name: string;
  title: string;
  components: string[];
  file: string;
  about: string;
  wide: boolean;
  order: number;
  load: () => Promise<ExampleDetails>;
};

export type Group = { id: string; letter: string; title: string; examples: Example[] };

type ExampleMeta = { name: string; file: string; about: string; wide?: boolean; order: number };

const modules = import.meta.glob<ComponentType>("./examples/*/*.tsx", { import: "default" });
const sources = import.meta.glob<string>("./examples/*/*.tsx", { query: "?raw", import: "default" });

function once<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    pending ??= load().catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
    return pending;
  };
}

export const loadProps = once(() =>
  import("../docs/props.json").then((module) => module.default as Record<string, PropDoc[]>),
);

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

const examples: Example[] = Object.entries(exampleList as Record<string, ExampleMeta>).flatMap(([id, meta]) => {
  const path = `./examples/${id}.tsx`;
  const loadModule = modules[path];
  const loadSource = sources[path];
  if (!loadModule || !loadSource) return [];
  const [group, slug] = id.split("/");
  const components = componentsIn(meta.name);
  return [
    {
      id,
      group,
      slug,
      ...meta,
      wide: meta.wide ?? false,
      title: components[0] ?? meta.name,
      components,
      load: once(() =>
        Promise.all([loadModule(), loadSource(), loadProps()]).then(([Component, raw, props]) => ({
          Component,
          code: cleanSource(raw),
          props,
        })),
      ),
    },
  ];
});

export const groups: Group[] = groupList.map((group) => ({
  ...group,
  examples: examples
    .filter((example) => example.group === group.id)
    .sort((a, b) => a.order - b.order),
}));

export const allExamples = groups.flatMap((group) => group.examples);
