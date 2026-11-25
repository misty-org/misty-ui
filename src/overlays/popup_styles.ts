import * as React from "react";
import { cn } from "../class_names";
/**
 * One popup language for every dropdown, context menu, select, command list and popover.
 * Primitives compose these; call sites should only set width/height/layout,
 * never surface color, border, radius, shadow, or type size.
 */

/**
 * Card and edge, with no shadow. The edge is `popup-edge` (components.css): a 1px line drawn as
 * an outline over the card's own rim, above everything inside it. Never a `ring-` (a box shadow
 * outside the card, which leaves a dark seam where it meets the card's rounded corner) or a
 * colored border (contents painted over it thin it at the corners). The global popup rule in
 * overlays.css draws the same edge on every popup primitive and clips contents to the rounded
 * edge, so call sites need no `overflow-hidden` for corners.
 */
export const popupSurfaceClass =
  "misty-scrollbar-rounded rounded-xl bg-charcoal-card text-cream popup-edge";

/**
 * Fade and a short slide away from the anchor, from literal keyframes in styles.css.
 * Never a scale: scaled text wiggles while it animates in the desktop shell.
 */
export const popupMotionClass = "misty-popup-motion";

/** Padding and row rhythm shared by every list of menu rows. The one column may shrink to the
 * menu's width: a fading label doesn't wrap, so an `auto` column would grow to fit the
 * longest one and push every row's right side (shortcuts, checkmarks) out of view. */
export const menuListClass = "grid grid-cols-[minmax(0,1fr)] gap-1 p-1";

export const menuContentClass = cn(
  "relative layer-menu max-h-[calc(100dvh-var(--spacing)*8)] w-auto min-w-32",
  "overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden",
  menuListClass,
  popupSurfaceClass,
  popupMotionClass,
);

/**
 * A menu laid out as a card (the profile card): no list padding, so a banner can run edge to edge
 * across its top, and the room of the window rather than a list's height, since it holds a
 * header as well as its rows.
 */
export const menuCardClass = cn(
  "relative layer-menu max-h-[calc(100dvh-var(--spacing)*8)] w-72",
  "overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden",
  popupSurfaceClass,
  popupMotionClass,
);

export const popoverContentClass = `layer-popover ${popupSurfaceClass} ${popupMotionClass}`;

/**
 * The popover widths, the same three menus use, so popups across Misty line up. `trigger` matches
 * the field that opens it (a combobox), and never goes under `sm`.
 */
export type PopoverSize = "sm" | "md" | "lg" | "trigger";
export const popoverSizeClass: Record<PopoverSize, string> = {
  sm: "w-64",
  md: "w-72",
  lg: "w-80",
  trigger: "w-(--radix-popover-trigger-width) min-w-64",
};

/**
 * What a popover holds, which sets its padding and rhythm:
 * - `panel`: a header (title and close), a line or a few controls, actions at the end. 13.5px in.
 * - `list`: menu-like rows, 4.5px in, scrolling past the menu height.
 * - `flush`: edge to edge, for a picker (its search is the top row) or content that draws its own
 *   rows, such as an upload list.
 */
export type PopoverKind = "panel" | "list" | "flush";
export const popoverKindClass: Record<PopoverKind, string> = {
  panel: "grid max-h-[min(--spacing(144),calc(100dvh-var(--spacing)*8))] gap-1 overflow-y-auto p-3",
  list: cn(menuListClass, "max-h-[calc(100dvh-var(--spacing)*8)] overflow-y-auto"),
  flush: "flex max-h-[min(--spacing(112),calc(100dvh-var(--spacing)*8))] flex-col overflow-hidden p-0",
};

/** A picker's search, the popover's top row with a line under it (CommandInput, PickerSearch). */
export const pickerSearchRowClass =
  "flex h-9 shrink-0 items-center gap-2 border-b border-charcoal-border px-3";
/** A picker's key hints, the popover's bottom row with a line over it (ModelPicker). */
export const pickerHintRowClass =
  "flex h-8 shrink-0 items-center gap-3 border-t border-charcoal-border px-3 text-micro text-cream-muted";
export const pickerSearchInputClass = cn(
  "h-full w-full min-w-0 bg-transparent text-control text-cream outline-none",
  "placeholder:text-cream-muted disabled:cursor-not-allowed disabled:opacity-50",
);

/**
 * A menu row's shape and type, without its states: 36px, an 18px icon, the label at the control
 * size. Radix menus and cmdk mark state with different attributes, so each adds its own.
 */
export const menuRowClass = cn(
  "relative flex min-h-8 w-full cursor-pointer select-none items-center",
  "gap-2 rounded-md px-2 py-1.5 text-left text-control text-cream outline-none",
  "transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
  "[&_svg:not([class*='size-'])]:size-4",
  "data-[variant=danger]:text-danger",
);

const menuRowOnGroupClass = cn(
  "[[data-slot=row-group]_&]:hover:bg-control-active [[data-slot=row-group]_&]:focus:bg-control-active",
  "[[data-slot=row-group]_&]:focus-visible:bg-control-active",
  "[[data-slot=row-group]_&]:data-highlighted:bg-control-active",
  "[[data-slot=row-group]_&]:data-[state=open]:bg-control-active",
  "[[data-slot=row-group]_&]:aria-pressed:bg-control-active",
  "[[data-slot=row-group]_&:not([data-variant=danger])]:hover:text-cream-bright",
  "[[data-slot=row-group]_&:not([data-variant=danger])]:focus:text-cream-bright",
  "[[data-slot=row-group]_&:not([data-variant=danger])]:data-highlighted:text-cream-bright",
  "[[data-slot=row-group]_&:not([data-variant=danger])]:data-[state=open]:text-cream-bright",
);

/** A menu row. Also used for plain buttons inside popovers that act as menus. */
export const menuItemClass = cn(
  menuRowClass,
  "hover:bg-charcoal-hover focus:bg-charcoal-hover",
  "focus-visible:bg-charcoal-hover data-highlighted:bg-charcoal-hover",
  "data-[state=open]:bg-charcoal-hover aria-pressed:bg-charcoal-hover",
  "aria-pressed:text-cream-bright disabled:pointer-events-none",
  "disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  menuRowOnGroupClass,
);

/**
 * A disabled row that explains itself keeps its pointer events, so hovering it can show why.
 * Radix still refuses to select it.
 */
export const menuItemExplainedClass =
  "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed";

/** A row with a checkmark pinned to the right edge. */
export const menuIndicatorItemClass = `${menuItemClass} pr-8`;
export const menuIndicatorClass =
  "pointer-events-none absolute right-2 flex size-4 items-center justify-center";

/** The leading 18px icon of every row. */
export const menuIconClass = "size-4 shrink-0";
/** A row's label (an OverflowFadeText): it takes the row's free width and fades at its end. */
export const menuLabelTextClass = "min-w-0 flex-1";

export const menuLabelClass = "px-2 py-1 text-meta font-medium text-cream-muted";
export const menuSeparatorClass = "-mx-1 h-px bg-charcoal-border";
export const menuShortcutClass = "ml-auto shrink-0 pl-2 text-meta tracking-widest text-cream-muted";

/** Standard menu widths, so menus across features line up. */
export type MenuWidth = "sm" | "md" | "lg" | "xl";
export const menuWidthClass: Record<MenuWidth, string> = {
  sm: "w-48",
  md: "w-56",
  lg: "w-64",
  xl: "w-72",
};

/**
 * Which kind of menu the rows are inside. DropdownMenuContent and ContextMenuContent set it, so
 * one tree of MenuItems renders as dropdown rows or right-click rows without knowing which.
 */
export type MenuKind = "dropdown" | "context";
export const MenuKindContext = React.createContext<MenuKind>("dropdown");
export const useMenuKind = () => React.useContext(MenuKindContext);
