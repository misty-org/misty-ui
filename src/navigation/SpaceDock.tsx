import * as React from "react";
import { cn } from "../class_names";
import { Pressable, type PressableProps } from "../controls/Pressable";
import { countText } from "../display/CountMark";
import { IndicatorDot } from "../display/IndicatorDot";
import { Tooltip } from "../overlays/Tooltip";

/**
 * The shared Spaces at the foot of the sidebar, as one row: a few Spaces' pictures side by side,
 * then the button that lists every Space (`SpaceDockItem` with a glyph, opening a searchable
 * list). It holds a fixed number of items however many Spaces someone has, so it never scrolls or
 * wraps: the caller shows the Spaces kept in the dock and puts the rest behind that last button,
 * which carries the marks of the Spaces it hides. It paints no fill: it stands on the window's own
 * color, set apart from the rows above by a hairline (the profile row under it brings its own).
 * Personal is never in it; the title bar's `PlaceSwitch` reaches Personal.
 */
export function SpaceDock(props: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <nav
      aria-label={props.label}
      data-slot="space-dock"
      className={cn(
        "flex shrink-0 items-center justify-center gap-1 border-t border-charcoal-border pt-2",
        props.className,
      )}
    >
      {props.children}
    </nav>
  );
}

export type SpaceDockItemProps = Omit<PressableProps, "children" | "onSelect"> & {
  /** The Space's name: its tooltip and accessible name. */
  label: string;
  /** The Space the window shows, or the list's button while its list is open. */
  selected?: boolean;
  /** How many messages wait there (mentions and unread): a grey tag on the picture's corner. */
  count?: number;
  /** A state waiting there, as a dot on the corner when there is no count. */
  state?: "waiting" | "working" | "results";
  onSelect?(): void;
  /** The Space's picture (an `Avatar shape="tile"`), or a glyph for the button that lists them all. */
  children: React.ReactNode;
};

/**
 * One item of a `SpaceDock`: a Space's picture (an `Avatar shape="tile"`, drawn 31.5px on a
 * 40.5px button), or a glyph for the button that lists every Space. Its name is its tooltip and accessible
 * name. It takes the control wash under the pointer and the stronger one while it is the Space the
 * window shows (`selected`), never a ring or an edge pill. On its corner it carries either how
 * many messages wait there (`count`, the grey count tag) or a state (`state`, a dot: amber while
 * something there waits on the person, blue while an agent works, green while results wait): a
 * number is only ever a count, and a dot only ever a state.
 */
export const SpaceDockItem = React.forwardRef<HTMLButtonElement, SpaceDockItemProps>(
  ({ label, selected, count, state, onSelect, onClick, children, className, ...props }, ref) => {
    const shown = count && count > 0 ? count : 0;
    const name = shown
      ? `${label}, ${countText(shown)} unread`
      : state === "waiting"
        ? `${label}, waiting for you`
        : label;
    return (
      <Tooltip content={label} side="top">
        <Pressable
          ref={ref}
          {...props}
          aria-label={name}
          aria-current={selected ? "page" : undefined}
          data-slot="space-dock-item"
          data-selected={selected || undefined}
          onClick={(event) => {
            onClick?.(event);
            onSelect?.();
          }}
          className={cn(
            "relative grid size-9 shrink-0 place-items-center rounded-lg text-cream-muted",
            "hover:bg-control-hover hover:text-cream-bright",
            "data-[selected]:bg-control-active data-[selected]:text-cream-bright",
            "data-[state=open]:bg-control-active data-[state=open]:text-cream-bright",
            "[&>[data-shape]]:size-7",
            className,
          )}
        >
          {children}
          {shown ? (
            <IndicatorDot count={shown} ring="chrome" />
          ) : state ? (
            <IndicatorDot state={state} ring="chrome" className="top-0.5 right-0.5" />
          ) : null}
        </Pressable>
      </Tooltip>
    );
  },
);
SpaceDockItem.displayName = "SpaceDockItem";
