import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const icons = join(dirname(fileURLToPath(import.meta.url)), "../src/icons");
const marks = JSON.parse(readFileSync(join(icons, "marks.json"), "utf8")) as Record<string, unknown>;
const files = readdirSync(join(icons, "marks"))
  .filter((name) => name.endsWith(".svg"))
  .map((name) => name.slice(0, -4))
  .sort();

const listed = Object.keys(marks).sort();
const unlisted = files.filter((id) => !(id in marks));
const missing = listed.filter((id) => !files.includes(id));
if (unlisted.length || missing.length) {
  if (unlisted.length) console.error(`Artwork with no entry in marks.json: ${unlisted.join(", ")}`);
  if (missing.length) console.error(`Entries in marks.json with no artwork: ${missing.join(", ")}`);
  process.exit(1);
}

const imports = listed.map((id, index) => `import mark${index} from "./marks/${id}.svg?inline";`);
const entries = listed.map((id, index) => `  ${JSON.stringify(id)}: mark${index},`);
writeFileSync(
  join(icons, "mark_assets.ts"),
  `${imports.join("\n")}\n\nexport const markAssets: Record<string, string> = {\n${entries.join("\n")}\n};\n`,
);
