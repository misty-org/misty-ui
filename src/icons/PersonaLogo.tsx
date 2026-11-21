import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "../classNames";
import type { AppLogoSize } from "./AppLogos";

/** The tile colors a persona's logo may wear, so personas read as one family in Explore. */
export const personaTones: readonly string[] = [
  "#3b6fe0",
  "#e39a2d",
  "#7c5ce0",
  "#1f9e84",
  "#e0533f",
  "#d6427c",
  "#3f9aa3",
  "#e8743b",
  "#2f9a52",
];

/** A stable tile color for a persona, picked from `personaTones` by its id. */
export function personaTone(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return personaTones[hash % personaTones.length];
}

/** `AppLogoImage`'s sizes, plus `avatar` (45px), an agent's picture in a list. */
export type PersonaLogoSize = AppLogoSize | "avatar";

const tile: Record<PersonaLogoSize, string> = {
  avatar: "size-10 rounded-[calc(var(--spacing)*2.5)] [&>svg]:size-5",
  row: "size-5 rounded-[calc(var(--spacing)*1.25)] [&>svg]:size-3",
  launcher: "size-14 rounded-[calc(var(--spacing)*3.25)] [&>svg]:size-7",
  card: "size-12 rounded-[calc(var(--spacing)*2.75)] [&>svg]:size-6",
  tile: "size-16 rounded-[calc(var(--spacing)*3.75)] [&>svg]:size-8",
};

/**
 * A persona's logo: a colored tile with white
 * artwork, here the glyph of what the persona does (a pen for a designer, a server for a backend
 * architect). Personas come with no artwork of their own and never wear an emoji, so this is
 * their logo everywhere they show. The size matches `AppLogoImage`'s. Without a `color` it is a neutral
 * tile, for other things with no artwork of their own, such as a prompt.
 *
 * ```tsx
 * <PersonaLogo icon={PenTool} color={personaTone(persona.id)} size="tile" />
 * ```
 */
export function PersonaLogo({
  icon: Icon,
  color,
  size = "row",
}: {
  icon: LucideIcon;
  /**
   * The tile's color, one of `personaTones` (`personaTone(id)` picks one). Left out, the tile is
   * neutral with a muted glyph, for something that has no color of its own (a prompt).
   */
  color?: string;
  size?: PersonaLogoSize;
}) {
  return (
    <span
      aria-hidden="true"
      data-persona-logo
      className={cn(
        "inline-grid shrink-0 place-items-center [&>svg]:[stroke-width:1.75]",
        color ? "text-white" : "bg-control-hover text-cream-muted",
        tile[size],
      )}
      style={color ? ({ background: color } as CSSProperties) : undefined}
    >
      <Icon />
    </span>
  );
}
