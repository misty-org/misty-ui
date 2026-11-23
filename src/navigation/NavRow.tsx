import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "../class_names";
import { rowShape, rowShapeTwoLine } from "../display/row_shape";
import { Pressable } from "../controls/Pressable";
import { OverflowFadeText, type OverflowFadeTextProps } from "../layout/OverflowFadeText";
import { FoldChevron } from "../overlays/MenuChevron";

/**
 * How a sidebar row answers the pointer:
 * - `wash`: Pressable's row wash, which brightens all of its text too (the sidebar's places). The
 *   open row's text is brighter as well.
 * - `fill`: only the row's fill, leaving its marks and times quiet; its `NavRowLabel` brightens on
 *   its own (a list of chats).
 */
export type NavRowHover = "wash" | "fill";

/**
 * Whose text the row wears: the window chrome's (the sidebar), or a page's own (the menu of a
 * Settings or Agents window, a rail beside a catalog). The shape is the same either way.
 */
export type NavRowTone = "chrome" | "page";

export type NavRowProps = Omit<ComponentPropsWithoutRef<"button">, "ref"> & {
  /** The open page's row: the active fill, and `aria-current="page"`. */
  current?: boolean;
  /** Picked among several, or being renamed in place: the open row's fill without being it. */
  selected?: boolean;
  hover?: NavRowHover;
  tone?: NavRowTone;
  /**
   * Not pressed as a whole: a placeholder while the list loads, or the row while it holds a field.
   * It is a `div` that stands still under the pointer.
   */
  still?: boolean;
  /**
   * A part of the row above it, such as a section of the open Settings page: no mark of its own,
   * its label set in to line up with the label of the row it belongs to. Never a row of chips.
   */
  nested?: boolean;
  /**
   * At least 54px, for a row whose label has more under it, such as a file manager's drive with its
   * capacity and a Meter (Kura's Devices). The caller stacks the lines beside the mark.
   */
  tall?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

const chromeText = "text-[var(--workspace-tab-text)]";
const chromeMuted = "text-[var(--workspace-tab-muted)]";
const toneText: Record<NavRowTone, { bright: string; quiet: string }> = {
  chrome: { bright: chromeText, quiet: chromeMuted },
  page: { bright: "text-cream-bright", quiet: "text-cream" },
};

/**
 * One row of a navigation list: the window's sidebar, a Settings or Agents window's menu, a rail of
 * engines. 36px, an 18px mark, its label, and what sits at its end, in quiet text (the chrome's,
 * or with `tone="page"` the page's). The open row takes the active fill.
 *
 * ```tsx
 * <NavRow current={here} onClick={open}><Icon />…<OverflowFadeText>{label}</OverflowFadeText></NavRow>
 * <NavRow hover="fill" selected={picked}>…<NavRowLabel bright={unread}>{title}</NavRowLabel></NavRow>
 * ```
 */
export function NavRow({
  current,
  selected,
  hover = "wash",
  tone = "chrome",
  still,
  nested,
  tall,
  className,
  ref,
  ...props
}: NavRowProps) {
  const filled = current || selected;
  const classes = cn(
    "group/nav-row w-full flex-none",
    tall ? rowShapeTwoLine : rowShape,
    "text-left text-control",
    hover === "wash" && current ? toneText[tone].bright : toneText[tone].quiet,
    nested && "pl-8",
    filled && "bg-row-active",
    !still && !filled && hover === "fill" && "hover:bg-row-hover focus-visible:bg-row-hover",
    className,
  );
  if (still) {
    const { type: _type, ...rest } = props;
    return (
      <div
        data-slot="nav-row"
        {...(rest as HTMLAttributes<HTMLDivElement>)}
        aria-current={current ? "page" : undefined}
        className={classes}
      />
    );
  }
  return (
    <Pressable
      ref={ref}
      type="button"
      wash={hover === "wash" ? "row" : undefined}
      aria-current={current ? "page" : undefined}
      {...props}
      className={classes}
    />
  );
}

/**
 * A `fill` row's title. It takes the chrome's own text under the pointer, and `bright` keeps it
 * there (the open, picked or unread row's title).
 */
export function NavRowLabel({
  bright,
  className,
  ...props
}: OverflowFadeTextProps & { bright?: boolean }) {
  return (
    <OverflowFadeText
      {...props}
      className={cn(
        "text-control",
        bright ? chromeText : "group-hover/nav-row:text-[var(--workspace-tab-text)]",
        className,
      )}
    />
  );
}

/**
 * The rows of one navigation list, with the same 6.75px between them everywhere, so a hovered row
 * never runs into the open one.
 */
export function NavList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="nav-list" {...props} className={cn("grid gap-1.5", className)} />;
}

export interface NavGroupHeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's name. Without it the heading holds its `children` alone (a placeholder). */
  name?: ReactNode;
  /** A group that folds away: its name is a button, with a chevron. */
  collapsible?: { open: boolean; onToggle(): void };
  tone?: NavRowTone;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The heading over a group of sidebar rows (Pinned, a section, Archived): 31.5px, the caption role
 * at medium weight, in the chrome's quiet text, brightening under the pointer.
 */
export function NavGroupHeading({
  name,
  collapsible,
  tone = "chrome",
  className,
  children,
  ref,
  ...props
}: NavGroupHeadingProps) {
  const nameClass = cn(
    "flex min-w-0 items-center gap-1 rounded-md text-caption font-medium",
    tone === "chrome"
      ? "hover:text-[var(--workspace-tab-text)] focus-visible:text-[var(--workspace-tab-text)]"
      : "hover:text-cream focus-visible:text-cream",
  );
  const label = collapsible ? (
    <Pressable
      type="button"
      className={nameClass}
      aria-expanded={collapsible.open}
      onClick={collapsible.onToggle}
    >
      {name}
      <FoldChevron open={collapsible.open} />
    </Pressable>
  ) : name !== undefined ? (
    <span className={nameClass}>{name}</span>
  ) : null;
  return (
    <div
      ref={ref}
      data-slot="nav-group-heading"
      {...props}
      className={cn(
        "flex h-7 items-center justify-between gap-1 pl-2",
        tone === "chrome" ? chromeMuted : "text-cream-muted",
        className,
      )}
    >
      {label}
      {children}
    </div>
  );
}
