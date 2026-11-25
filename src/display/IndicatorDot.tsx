import { cn } from "../class_names";
import { countText } from "./CountMark";

/**
 * A small dot pinned to the corner of an icon or avatar, marking that something about it needs
 * a look (out of sync, unread). A ring in the surface's own color cuts it out of the icon under
 * it. With `count` it grows into a small bubble holding how many wait there (up to "99+"), as an
 * app's icon shows its unread count; at zero it shows nothing. The parent is the positioning box
 * (`relative`); the mark carries no label of its own, so the control it marks says what it means
 * (and how many).
 */
export function IndicatorDot({ count, className }: { count?: number; className?: string }) {
  if (count !== undefined && count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      data-slot="indicator-dot"
      className={cn(
        "pointer-events-none absolute rounded-full bg-cream-bright ring-2 ring-charcoal-card",
        count === undefined
          ? "right-0.5 bottom-0.5 size-1.5"
          : cn(
              "-right-1.5 -bottom-1 inline-flex h-3.5 min-w-3.5 items-center justify-center px-0.5",
              "text-micro leading-none font-semibold tabular-nums text-charcoal-bg",
            ),
        className,
      )}
    >
      {count === undefined ? null : countText(count)}
    </span>
  );
}
