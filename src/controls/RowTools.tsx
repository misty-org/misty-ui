import type { ReactNode } from "react";
import { cn } from "../class_names";
import { Surface } from "../display/Surface";
import { RowControls } from "./RowContext";

/**
 * When a row's tools show:
 * - `always`: in place, at the row's end.
 * - `hover`: only while the pointer is over the row or focus is in it (or one's menu is open);
 *   they take room from the name while shown.
 * - `cover`: like hover, but drawn over the row's end on the hovered row's own fill, so the name
 *   keeps the whole width (a path in a list of changes).
 */
export type RowToolsReveal = "always" | "hover" | "cover";

/**
 * What a `cover` row stands on, which the cover paints under the row's wash so it reads as the row
 * itself: a page's frame (`frame`, the default) or the window's own color (`chrome`, Misty's sidebar).
 */
export type RowToolsGround = "frame" | "chrome";

const revealClass: Record<Exclude<RowToolsReveal, "cover">, string> = {
  always: "flex",
  hover: cn(
    "hidden group-hover/row:flex group-focus-within/row:flex",
    "group-has-[[data-state=open]]/row:flex",
  ),
};

const groundClass: Record<RowToolsGround, string> = {
  frame: "bg-charcoal-sidebar",
  chrome: "bg-[var(--misty-window-chrome,var(--misty-theme-workspace))]",
};

/**
 * A row's own buttons, at its end, as one tight group: IconButtons 27px, 2.25px apart, so the row's
 * 4.5px inset shows around them and no gap opens between icons. The row is a `group/row`. A `cover`
 * group meets the row's end, on the row's own `ground` under its wash and with its corners, so
 * nothing about the row changes but the name giving way to the buttons.
 *
 * ```tsx
 * <RowTools reveal="hover">
 *   <IconButton label="Refresh" onClick={refresh}><RotateCw /></IconButton>
 *   <IconButton label="Add to chat" onClick={mention}><Plus /></IconButton>
 * </RowTools>
 * ```
 */
export function RowTools({
  reveal = "always",
  ground = "frame",
  children,
}: {
  reveal?: RowToolsReveal;
  ground?: RowToolsGround;
  children: ReactNode;
}) {
  if (reveal === "cover")
    return (
      <span
        data-slot="row-tools"
        data-reveal="cover"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 flex opacity-0",
          groundClass[ground],
          "group-hover/row:pointer-events-auto group-hover/row:opacity-100",
          "group-focus-within/row:pointer-events-auto group-focus-within/row:opacity-100",
          "has-[[data-state=open]]:pointer-events-auto has-[[data-state=open]]:opacity-100",
        )}
      >
        <Surface
          tone="faint"
          data-slot="row-tools-cover"
          className="flex items-center gap-0.5 pr-1 pl-3"
        >
          <RowControls>{children}</RowControls>
        </Surface>
      </span>
    );
  return (
    <span
      data-slot="row-tools"
      className={cn("flex-none items-center gap-0.5", revealClass[reveal])}
    >
      <RowControls>{children}</RowControls>
    </span>
  );
}
