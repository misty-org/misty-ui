import type { ReactNode } from "react";
import { cn } from "../class_names";

/**
 * One toolbar row of a FramedPage, or the header of one of its parts (the work's own bar, a
 * column's header): 54px (`main`, `--ui-header`) or Kura's 45px second row (`tools`), one 13.5px
 * gutter at both ends. `start` takes the room that is left (a title, a search field, a back
 * button); `children` sit at its end and never shrink below their content. It draws no fill and no
 * line: the FramedPage paints the frame's color behind it and the hairline under it. Not for an
 * overlay's or popup's own bar, which is a TopBar or BottomBar.
 *
 * ```tsx
 * <FramedBar start={<SearchField aria-label="Search friends" placeholder="Search" />}>
 *   <Button variant="primary">Add friend</Button>
 * </FramedBar>
 * ```
 */
export function FramedBar(props: {
  /** "main" is 54px (--ui-header), "tools" is 45px (Kura's second row). Default "main". */
  size?: "main" | "tools";
  /** What sits at its start (a title, a search field, a back button); it takes the room left. */
  start?: ReactNode;
  /** What sits at its end (the actions); it never shrinks below its content. */
  children?: ReactNode;
  "aria-label"?: string;
  /** Layout only. */
  className?: string;
  [key: `data-${string}`]: string | undefined;
}) {
  const { size, start, children, className, "aria-label": label, ...data } = props;
  return (
    <div
      {...data}
      data-slot="framed-bar"
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 px-3",
        "[--window-toolbar-base-left:calc(var(--spacing)*3)] [--window-toolbar-base-right:calc(var(--spacing)*3)]",
        size === "tools" ? "h-10" : "h-(--ui-header)",
        className,
      )}
    >
      {start ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">{start}</div>
      ) : null}
      {children ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
