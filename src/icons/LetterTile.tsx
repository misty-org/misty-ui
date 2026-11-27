import { cn } from "../class_names";

const letterTones = ["blue", "violet", "green", "orange", "pink", "teal", "amber", "sand"] as const;

/** The tone a name's `LetterTile` takes: the same name always gets the same one. */
export function letterTone(name: string): (typeof letterTones)[number] {
  let hash = 7;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return letterTones[hash % letterTones.length];
}

/** Up to two letters for a name: the first letters of its first two words, or its first two. */
export function letterMark(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "?";
  const letters = words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
  return letters.toUpperCase();
}

const sizeClass = {
  /** A store row's or card's logo, set in a `LogoTile` (`StoreRow`, `StoreCard`): 45px. */
  tile: "size-10 rounded-[calc(var(--spacing)*2.5)] text-control",
  /** An item's own page or sheet, set in a hero `LogoTile`: 72px. */
  hero: "size-16 rounded-[calc(var(--spacing)*3.75)] text-title",
} as const;

/**
 * What stands in for a logo when a thing has no official artwork of its own and its maker has no
 * official mark we carry (a skill, a plugin, an MCP server from someone's repository): up to two of
 * its name's letters on a soft tile in a tone picked from the name, so a shelf of them reads as
 * different things at a glance. Never a person's picture or a maker's profile photo, and never one
 * glyph repeated down a list. An item with its own icon is `AppLogoImage`; a brand's mark is `Mark`.
 */
export function LetterTile({
  name,
  size = "tile",
  className,
}: {
  name: string;
  size?: keyof typeof sizeClass;
  className?: string;
}) {
  const tone = letterTone(name);
  return (
    <span
      aria-hidden="true"
      data-slot="letter-tile"
      className={cn(
        "inline-grid shrink-0 place-items-center font-semibold tracking-wide",
        sizeClass[size],
        className,
      )}
      style={{
        background: `color-mix(in srgb, var(--color-tone-${tone}) 22%, var(--misty-theme-card))`,
        color: `color-mix(in srgb, var(--color-tone-${tone}) 70%, var(--misty-theme-text-bright))`,
      }}
    >
      {letterMark(name)}
    </span>
  );
}
