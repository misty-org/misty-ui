// Writes docs/props.json: every component's own props (name, type, optional, default note, doc
// comment), read from the TypeScript source with the compiler, for the docs site's props tables.
// Props a component only passes through (a <button>'s attributes, Radix's) are left out.
//
//   npm run catalog

import { writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "src");
export const propsPath = join(root, "docs/props.json");

export type PropDoc = { name: string; type: string; optional: boolean; doc: string };
export type ComponentProps = Record<string, PropDoc[]>;

function shortType(text: string): string {
  const flat = text.replace(/\s+/g, " ");
  return flat.length > 90 ? `${flat.slice(0, 87)}…` : flat;
}

export function buildProps(): ComponentProps {
  const program = ts.createProgram([join(srcDir, "index.ts")], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    allowImportingTsExtensions: true,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
  });
  const checker = program.getTypeChecker();
  const index = program.getSourceFile(join(srcDir, "index.ts"));
  if (!index) throw new Error("src/index.ts not found");
  const moduleSymbol = checker.getSymbolAtLocation(index);
  if (!moduleSymbol) throw new Error("src/index.ts has no exports");

  const out: ComponentProps = {};
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!declaration) continue;
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const signature = type.getCallSignatures()[0];
    const parameter = signature?.getParameters()[0];
    if (!parameter) continue;
    const propsType = checker.getTypeOfSymbolAtLocation(parameter, declaration);
    const props: PropDoc[] = [];
    for (const prop of propsType.getProperties()) {
      const own = prop.declarations?.some((d) => {
        const file = d.getSourceFile().fileName;
        return file.startsWith(srcDir) && !file.includes("node_modules");
      });
      if (!own) continue;
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      props.push({
        name: prop.getName(),
        type: shortType(checker.typeToString(checker.getNonNullableType(propType))),
        optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
        doc: ts.displayPartsToString(prop.getDocumentationComment(checker)).replace(/\s+/g, " "),
      });
    }
    out[name] = props;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(propsPath, `${JSON.stringify(buildProps(), null, 2)}\n`);
  console.log(`Wrote ${relative(root, propsPath)}`);
}
