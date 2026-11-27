import { cn } from "../class_names";
import { countTagClass, countText } from "./CountMark";

/**
 * A mark pinned to the corner of an icon or picture. Without `count` it is a small dot for a state
 * (`state`: waiting on the person in amber, working in blue, new results in green, or a plain
 * neutral dot for "needs a look", such as out of sync). With `count` it is the grey count tag
 * instead, holding how many messages wait there (up to "99+"); at zero it shows nothing. A count
 * and a state never share one mark. A ring in the surface's own color (`ring`: the page's by
 * default, `chrome` on the window's own color, `card` on a card) cuts it out of the picture under it. The parent is the positioning box (`relative`);
 * the mark carries no label of its own, so the control it marks says what it means.
 */
export function IndicatorDot({
  count,
  state,
  ring = "page",
  className,
}: {
  count?: number;
  state?: "waiting" | "working" | "results";
  ring?: "page" | "chrome" | "card";
  className?: string;
}) {
  if (count !== undefined && count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      data-slot="indicator-dot"
      data-state={count === undefined ? state : undefined}
      className={cn(
        "pointer-events-none absolute ring-2",
        ring === "card"
          ? "ring-charcoal-card"
          : ring === "chrome"
            ? "ring-[var(--misty-window-chrome,var(--misty-theme-workspace))]"
            : "ring-charcoal-bg",
        count === undefined
          ? cn(
              "-top-0.5 -right-0.5 size-2 rounded-full",
              state === "waiting"
                ? "bg-state-waiting"
                : state === "working"
                  ? "bg-state-working animate-[misty-breathe_1.6s_ease-in-out_infinite] motion-reduce:animate-none"
                  : state === "results"
                    ? "bg-state-done"
                    : "bg-cream-bright",
            )
          : cn("-top-1 -right-1.5", countTagClass),
        className,
      )}
    >
      {count === undefined ? null : countText(count)}
    </span>
  );
}
