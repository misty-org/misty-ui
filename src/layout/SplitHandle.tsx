import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "../classNames";

/**
 * The seam between two resizable panes. Nothing shows at rest: the panes meet edge to edge. A
 * wider grab area sits around the 1px seam, and a hairline shows while it is hovered, focused or
 * dragged. `direction` is the split's: "horizontal" panes sit side by side. With `seam` the
 * hairline shows at rest too, for panes that nothing else divides (the window's split panes).
 */
export function SplitHandle(props: {
  direction: "horizontal" | "vertical";
  label: string;
  seam?: boolean;
  /** A double-click on the seam, such as evening the two panes out again. */
  onDoubleClick?(): void;
}) {
  return (
    <PanelResizeHandle
      aria-label={props.label}
      onDoubleClick={props.onDoubleClick}
      className={cn(
        "relative z-20 transition-colors",
        props.seam ? "bg-charcoal-border" : "bg-transparent",
        "hover:bg-charcoal-border data-[resize-handle-state=drag]:bg-charcoal-border",
        "focus-visible:bg-charcoal-border focus-visible:outline-none",
        "before:absolute before:content-['']",
        props.direction === "horizontal"
          ? "w-px cursor-col-resize before:-inset-x-1 before:inset-y-0"
          : "h-px cursor-row-resize before:inset-x-0 before:-inset-y-1",
      )}
    />
  );
}

/**
 * Panes the person resizes, side by side or stacked (`direction`), with a SplitHandle between
 * each two. It has no look of its own; it takes react-resizable-panels' PanelGroup props, such
 * as `autoSaveId` and `onLayout`, and its ref.
 */
export const SplitPanes = PanelGroup;

/** One pane of SplitPanes, with its default, least and most size in percent. */
export const SplitPane = Panel;

export type { ImperativePanelGroupHandle as SplitPanesHandle } from "react-resizable-panels";
