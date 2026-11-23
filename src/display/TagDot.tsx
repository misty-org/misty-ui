import { cn } from "../class_names";
import { Tooltip } from "../overlays/Tooltip";

/** Finder's tag colors by its numbers, 1 to 7; 0 is a tag with no color. */
const tagTones = [
  { name: "Gray", dot: "bg-tag-gray" },
  { name: "Green", dot: "bg-tag-green" },
  { name: "Purple", dot: "bg-tag-purple" },
  { name: "Blue", dot: "bg-tag-blue" },
  { name: "Yellow", dot: "bg-tag-yellow" },
  { name: "Red", dot: "bg-tag-red" },
  { name: "Orange", dot: "bg-tag-orange" },
] as const;

function tagTone(color: number) {
  return Number.isInteger(color) && color >= 1 && color <= 7 ? tagTones[color - 1] : null;
}

/**
 * The name of a Finder tag color, by Finder's number (1 Gray, 2 Green, 3 Purple, 4 Blue, 5 Yellow,
 * 6 Red, 7 Orange), for a menu of colors to pick. Any other number is "No color".
 */
export function tagToneName(color: number): string {
  return tagTone(color)?.name ?? "No color";
}

/** A Finder tag: its name and its color, by Finder's number (0 for none). */
export type FinderTagMark = { name: string; color: number };

const dotClass = "inline-block size-2.5 shrink-0 rounded-full";

function Dot({ color, className }: { color: number; className?: string }) {
  const tone = tagTone(color);
  return (
    <span
      aria-hidden="true"
      data-slot="tag-dot"
      className={cn(
        dotClass,
        tone ? tone.dot : "border border-cream-muted",
        className,
      )}
    />
  );
}

/**
 * One Finder tag's color as a small round mark, like `RoleDot`: before a tag's name in a menu or
 * the sidebar, or alone where it names itself. `color` is Finder's number, 1 to 7 (0 or any other
 * number draws a hollow ring, a tag with no color). `label` is its accessible name, usually the
 * tag's name. Several tags on one item are `TagDots`, never a row of these.
 */
export function TagDot({ color, label, className }: { color: number; label: string; className?: string }) {
  return (
    <span role="img" aria-label={label} className={cn("inline-flex shrink-0", className)}>
      <Dot color={color} />
    </span>
  );
}

/** How many dots show before the rest are only named. */
const mostDots = 3;

/** "Work", "Work and Home", "Work, Home and Later". */
function tagList(tags: ReadonlyArray<FinderTagMark>) {
  const names = tags.map((tag) => tag.name);
  return names.length < 2 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * An item's Finder tags after its name, as Finder draws them: up to three dots overlapping, each
 * cut out of the one under it by a ring of the page's color, and every tag named in Misty's
 * tooltip ("Work, Home and Later"). Show nothing for an item with no tags. Only the colored tags
 * draw a dot, unless none has a color. For a single tag's color in a menu use `TagDot`.
 */
export function TagDots({ tags, className }: { tags: ReadonlyArray<FinderTagMark>; className?: string }) {
  if (tags.length === 0) return null;
  const colored = tags.filter((tag) => tagTone(tag.color));
  const shown = (colored.length ? colored : tags).slice(0, mostDots);
  const label = tagList(tags);
  return (
    <Tooltip content={label}>
      <span
        role="img"
        aria-label={`Tags: ${label}`}
        data-slot="tag-dots"
        className={cn("flex h-4 shrink-0 items-center -space-x-1", className)}
      >
        {shown.map((tag, index) => (
          <Dot key={`${tag.name}-${index}`} color={tag.color} className="ring-2 ring-charcoal-bg" />
        ))}
      </span>
    </Tooltip>
  );
}
