import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const examplesDir = join(root, "site/examples");
export const examplesPath = join(root, "site/examples.json");

export type ExampleMeta = { name: string; file: string; about: string; wide?: boolean; order: number };

function literal(node: ts.Expression, where: string): string | number | boolean {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  throw new Error(`${where}: meta holds only plain strings, numbers and booleans`);
}

function metaOf(path: string): ExampleMeta {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "meta") continue;
      const value = declaration.initializer;
      if (!value || !ts.isObjectLiteralExpression(value)) break;
      const meta: Record<string, string | number | boolean> = {};
      for (const property of value.properties) {
        if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
          throw new Error(`${path}: meta holds only plain properties`);
        }
        meta[property.name.text] = literal(property.initializer, path);
      }
      return meta as ExampleMeta;
    }
  }
  throw new Error(`${path} exports no meta`);
}

export function buildExamples(): string {
  const out: Record<string, ExampleMeta> = {};
  for (const group of readdirSync(examplesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
    for (const file of readdirSync(join(examplesDir, group.name)).filter((name) => name.endsWith(".tsx"))) {
      out[`${group.name}/${file.replace(/\.tsx$/, "")}`] = metaOf(join(examplesDir, group.name, file));
    }
  }
  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  return `${JSON.stringify(sorted, null, 2)}\n`;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(examplesPath, buildExamples());
  console.log(`Wrote ${relative(root, examplesPath)}`);
}
