import design from "../DESIGN.md?raw";

export type Guidance = { job: string; use: string; not: string };

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

export const principles: string[] = (() => {
  const section = design.split("## Before writing any UI")[1]?.split("\n## ")[0] ?? "";
  return section
    .split(/\n(?=\d+\. )/)
    .filter((item) => /^\d+\. /.test(item.trim()))
    .map((item) => item.trim().replace(/^\d+\.\s*/, "").replace(/\s+/g, " "));
})();
