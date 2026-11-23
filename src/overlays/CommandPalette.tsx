import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";

/**
 * The palette itself, holding its input, list and rows: a column with no look of its own, since
 * the dialog around it is the panel. It takes cmdk's props (`shouldFilter`, `loop`, `value`).
 */
const CommandPalette = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("flex min-h-0 flex-col", className)}
    {...props}
  />
));
CommandPalette.displayName = "CommandPalette";

/** A group of the palette's rows under its `heading`, drawn as the list's muted caption. */
const CommandPaletteGroup = CommandPrimitive.Group;

/** The palette's search box: the body role in the bright text, a muted placeholder, no frame. */
const CommandPaletteInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Input
    ref={ref}
    className={cn(
      "w-full bg-transparent text-body text-cream-bright outline-none placeholder:text-cream-muted",
      className,
    )}
    {...props}
  />
));
CommandPaletteInput.displayName = "CommandPaletteInput";

/**
 * One of the palette's type tabs (All, Chats, Docs…): 31.5px, the meta role, muted until hovered;
 * the picked one (`aria-selected`) takes the control wash and the bright text.
 */
function CommandPaletteTab({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Pressable> & {
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <Pressable
      type="button"
      role="tab"
      className={cn(
        "h-7 rounded-md px-2.5 text-meta text-cream-muted hover:text-cream",
        "aria-selected:bg-control-hover aria-selected:text-cream-bright",
        className,
      )}
      {...props}
    />
  );
}

/** The palette's list: it scrolls, and its group headings are muted captions. */
const CommandPaletteList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "overflow-y-auto",
      "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5",
      "[&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:leading-(--text-body--line-height)",
      "[&_[cmdk-group-heading]]:text-cream-muted",
      className,
    )}
    {...props}
  />
));
CommandPaletteList.displayName = "CommandPaletteList";

type CommandPaletteItemProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> & {
  /** A row with the words around its match under its title: it grows to fit both lines. */
  twoLines?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * One row of the palette: 45px, the meta role, with large corners; the row cmdk has picked takes
 * the control wash and the bright text.
 */
function CommandPaletteItem({
  className,
  twoLines,
  ref,
  ...props
}: CommandPaletteItemProps) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "flex cursor-default items-center gap-2.5 rounded-lg px-3",
        "text-meta leading-(--text-body--line-height) text-cream",
        twoLines ? "min-h-13 py-2" : "h-10",
        "data-[selected=true]:bg-control-hover data-[selected=true]:text-cream-bright",
        className,
      )}
      {...props}
    />
  );
}

/** The part of a row's text that matches what was typed: a faint wash in the bright text. */
function CommandPaletteMatch({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <mark
      className={cn(
        "rounded-sm bg-[color-mix(in_srgb,var(--color-cream)_14%,transparent)] text-cream-bright",
        className,
      )}
      {...props}
    />
  );
}

export {
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteList,
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteMatch,
  CommandPaletteTab,
};
export type { CommandPaletteItemProps };
