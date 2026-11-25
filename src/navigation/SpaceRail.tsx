import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";
import { countText } from "../display/CountMark";
import { Tooltip } from "../overlays/Tooltip";

/**
 * The window's rail at its far edge, as Discord's server list, in two parts. At its top (`start`)
 * is what is the person's own: Personal, their own face, then the places that belong to no one
 * Space (Files, Apps, Browser, Explore). A hairline (`SpaceRailDivider`) starts what is shared:
 * every shared Space as its picture, one under another, then New Space. The open one is ringed.
 * `start` stays put; the shared Spaces scroll when there are more than fit. It paints no fill and
 * draws no line of its own: it stands on the sidebar's color at the window's edge, under the
 * window's own buttons, and reads with the sidebar beside it as one panel, its first picture level
 * with the sidebar's first row. It folds away with the sidebar and slides back out with it. Each
 * item is a `SpaceRailItem`.
 */
export function SpaceRail(props: {
  label: string;
  start?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label={props.label}
      data-slot="space-rail"
      className={cn(
        "flex h-full w-16 shrink-0 flex-col items-center",
        props.className,
      )}
    >
      {props.start ? (
        <div className="flex w-full shrink-0 flex-col items-center gap-2 pt-1.5">
          {props.start}
          <SpaceRailDivider />
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-y-auto pb-3 [scrollbar-width:none]",
          props.start ? "pt-2" : "pt-1.5",
        )}
      >
        {props.children}
      </div>
    </nav>
  );
}

/** The short hairline on a SpaceRail where what is shared starts. SpaceRail draws it under `start`. */
export function SpaceRailDivider() {
  return <span aria-hidden="true" className="h-px w-6 shrink-0 bg-charcoal-border" />;
}

/**
 * One place on a SpaceRail: a Space's picture, or the person's own for Personal, each an
 * `Avatar shape="tile"` 40.5px square, so every picture on the rail is the same rounded box; or a
 * glyph for a place such as Files or New Space, drawn at 22.5px with the glyph's own stroke weight on
 * a neutral tile of that same size and shape (the control wash, stronger under the pointer), so it
 * holds its own beside the pictures. Its name is its tooltip and accessible name.
 * Under the pointer or with keyboard focus a ring in the strong edge's color circles the picture,
 * and the open one (`selected`) wears that ring in the bright text's color. There is no edge pill
 * and no change of shape. `count` is how many wait there, as a bubble on the picture's corner, amber while one of
 * them needs the person (`waiting`); none shows at zero.
 */
export function SpaceRailItem(props: {
  label: string;
  selected?: boolean;
  count?: number;
  waiting?: boolean;
  onSelect(): void;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  [key: `data-${string}`]: string | undefined;
}) {
  const { label, selected, count: waitingCount, waiting, onSelect, onContextMenu, children, ...data } =
    props;
  const count = waitingCount ?? 0;
  const name = count > 0 ? `${label}, ${countText(count)} new` : label;
  return (
    <Tooltip content={label} side="right">
      <Pressable
        {...data}
        selected={selected}
        aria-label={name}
        aria-current={selected ? "page" : undefined}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        className="group/rail relative grid size-10 shrink-0 place-items-center text-cream-muted hover:text-cream-bright data-[selected]:text-cream-bright"
      >
        <span
          className={cn(
            "relative grid size-9 place-items-center [&>[data-shape]]:size-full [&>svg.lucide]:size-5 [&>svg.lucide]:[stroke-width:1.6]",
            "has-[>svg.lucide]:rounded-[28%] has-[>svg.lucide]:bg-control-hover group-hover/rail:has-[>svg.lucide]:bg-control-active",
          )}
        >
          {children}
          <span
            aria-hidden="true"
            data-slot="space-rail-ring"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[28%] border border-transparent transition-colors",
              "group-hover/rail:border-charcoal-border-strong group-focus-visible/rail:border-charcoal-border-strong",
              "group-data-[selected]/rail:border-cream-bright",
            )}
          />
          {count > 0 ? (
            <span
              aria-hidden="true"
              data-slot="space-rail-count"
              className={cn(
                "pointer-events-none absolute -right-1.5 -bottom-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1",
                "ring-2 ring-charcoal-sidebar text-micro leading-none font-semibold tabular-nums",
                waiting ? "bg-state-waiting text-ink-on-color" : "bg-cream-bright text-charcoal-bg",
              )}
            >
              {countText(count)}
            </span>
          ) : null}
        </span>
      </Pressable>
    </Tooltip>
  );
}
