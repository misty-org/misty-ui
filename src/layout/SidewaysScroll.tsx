import { useEffect, useRef, useState, type ComponentProps, type WheelEvent } from "react";
import { cn } from "../class_names";

/** A mouse wheel's vertical turn scrolls the row sideways; a trackpad's sideways swipe already does. */
function scrollSideways(event: WheelEvent<HTMLDivElement>) {
  const row = event.currentTarget;
  if (Math.abs(event.deltaX) >= Math.abs(event.deltaY) || row.scrollWidth <= row.clientWidth)
    return;
  row.scrollLeft += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
}

type Edges = { start: boolean; end: boolean };

export interface SidewaysScrollProps extends ComponentProps<"div"> {
  /**
   * Fades the row's edge wherever its items carry on past it, so an item cut there reads as more
   * this way rather than as broken. An edge with nothing past it stays sharp.
   */
  fade?: boolean;
  /** Told whenever the row starts or stops having more items than fit. */
  onOverflowChange?(overflowing: boolean): void;
}

/**
 * A row of a bar that scrolls sideways when its items don't fit, instead of letting them overlap
 * or spill past its edge: no scrollbar shows (it would take the bar's room), and a mouse wheel
 * scrolls it as a trackpad swipe does. The window's top and bottom bars hold their items in one.
 * With `fade` the edge where items carry on fades out, as a long label does.
 *
 * ```tsx
 * <SidewaysScroll className="flex-1 gap-2">{items}</SidewaysScroll>
 * ```
 */
export function SidewaysScroll({
  className,
  onWheel,
  onScroll,
  fade = false,
  onOverflowChange,
  ref,
  ...props
}: SidewaysScrollProps) {
  const row = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<Edges>({ start: false, end: false });
  const overflowing = useRef(false);
  const told = useRef(onOverflowChange);
  told.current = onOverflowChange;
  const watching = fade || Boolean(onOverflowChange);

  const measure = () => {
    const element = row.current;
    if (!element) return;
    const past = Math.abs(element.scrollLeft);
    const room = element.scrollWidth - element.clientWidth;
    const next = { start: past > 1, end: past < room - 1 };
    setEdges((now) => (now.start === next.start && now.end === next.end ? now : next));
    const over = room > 1;
    if (over !== overflowing.current) {
      overflowing.current = over;
      told.current?.(over);
    }
  };

  useEffect(() => {
    const element = row.current;
    if (!watching || !element) return;
    const sizes = new ResizeObserver(measure);
    const watch = () => {
      sizes.disconnect();
      sizes.observe(element);
      for (const child of element.children) sizes.observe(child);
    };
    const children = new MutationObserver(watch);
    children.observe(element, { childList: true });
    watch();
    measure();
    return () => {
      sizes.disconnect();
      children.disconnect();
    };
  }, [watching]);

  return (
    <div
      {...props}
      ref={(element) => {
        row.current = element;
        if (typeof ref === "function") return ref(element);
        if (ref) ref.current = element;
      }}
      data-fade-start={(fade && edges.start) || undefined}
      data-fade-end={(fade && edges.end) || undefined}
      onWheel={(event) => {
        onWheel?.(event);
        scrollSideways(event);
      }}
      onScroll={(event) => {
        onScroll?.(event);
        if (watching) measure();
      }}
      className={cn(
        "flex min-w-0 items-center overflow-x-auto overflow-y-hidden scrollbar-none",
        fade && "fade-sides",
        className,
      )}
    />
  );
}
