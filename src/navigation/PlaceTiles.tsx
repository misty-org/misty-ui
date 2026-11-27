import * as React from "react";
import { cn } from "../class_names";
import { Pressable, type PressableProps } from "../controls/Pressable";
import { Tooltip } from "../overlays/Tooltip";

/**
 * Misty's places that belong to no one Space (Files, Apps, Browser, Explore), as a row of four
 * tiles near the top of the sidebar, under its search: the same glyphs every row and tab of
 * those places wears (`spaceIcons`), each on a faint tile. Each tile is a `PlaceTile`.
 */
export function PlaceTiles(props: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label={props.label}
      data-slot="place-tiles"
      className={cn("grid grid-cols-4 gap-1.5", props.className)}
    >
      {props.children}
    </nav>
  );
}

export type PlaceTileProps = Omit<PressableProps, "children"> & {
  /** The place's name: its tooltip and accessible name. */
  label: string;
  /** The place's page is the one open (or its launcher is). */
  selected?: boolean;
  /** The place's glyph, from `spaceIcons`. */
  children: React.ReactNode;
};

/**
 * One tile of `PlaceTiles`: the place's glyph, drawn larger than a glyph elsewhere (22.5px at the
 * same stroke weight) so the four places read at a glance, centered on a faint fill 45px tall, the control wash
 * under the pointer and the stronger one, in the bright text, while its page is open. Its name is
 * its tooltip and accessible name.
 */
export const PlaceTile = React.forwardRef<HTMLButtonElement, PlaceTileProps>(
  ({ label, selected, children, className, ...props }, ref) => (
    <Tooltip content={label}>
      <Pressable
        ref={ref}
        {...props}
        aria-label={label}
        aria-current={selected ? "page" : undefined}
        data-slot="place-tile"
        data-selected={selected || undefined}
        className={cn(
          "grid h-10 min-w-0 place-items-center rounded-lg bg-row-hover text-cream-muted",
          "[&>svg.lucide]:size-5 [&>svg.lucide]:[stroke-width:1.6]",
          "hover:bg-control-hover hover:text-cream-bright",
          "data-[selected]:bg-control-active data-[selected]:text-cream-bright",
          "data-[state=open]:bg-control-active data-[state=open]:text-cream-bright",
          className,
        )}
      >
        {children}
      </Pressable>
    </Tooltip>
  ),
);
PlaceTile.displayName = "PlaceTile";
