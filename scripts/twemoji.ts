import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const from = resolve(import.meta.dirname, "../node_modules/@twemoji/svg");
const to = resolve(import.meta.dirname, "../assets/twemoji");
rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
const files = readdirSync(from).filter((name) =>
  /^[0-9a-f-]+\.svg$/.test(name),
);
for (const name of files) copyFileSync(resolve(from, name), resolve(to, name));
writeFileSync(
  resolve(to, "LICENSE.md"),
  "Twemoji graphics by Twitter, Inc and other contributors, from jdecked/twemoji, " +
    "licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/\n",
);
console.log(`Copied ${files.length} Twemoji drawings to assets/twemoji`);
