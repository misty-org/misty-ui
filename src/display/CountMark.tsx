import { cn } from "../class_names";
import { Tooltip } from "../overlays/Tooltip";

/** A count as a mark shows it: the number up to 99, then "99+". */
export function countText(count: number): string {
  return count > 99 ? "99+" : String(Math.max(0, Math.floor(count)));
}

/**
 * How many things wait at a row's end, in place of a dot: a small round bubble holding the
 * number, in the bright text's fill so it reads at a glance, as an app's unread count does. An
 * agent's row counts its threads that need the person or have results they haven't seen; a
 * direct message or a channel counts its unread messages. `waiting` turns it amber, for a count
 * that includes something waiting on the person. Past 99 it reads "99+". It shows nothing at
 * zero. `label` is its tooltip and accessible name ("3 need you or are new"). It is as tall as a
 * StateMark, so it lines up in a column of rows. A count on an icon is IndicatorDot's `count`.
 *
 * `<CountMark count={3} label="3 unread" />`
 */
export function CountMark({
  count,
  label,
  waiting = false,
  className,
}: {
  count: number;
  label: string;
  waiting?: boolean;
  /** Layout only: margins or placement. */
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <Tooltip content={label}>
      <span
        role="img"
        aria-label={label}
        data-slot="count-mark"
        data-waiting={waiting || undefined}
        className={cn(
          "inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1",
          "text-micro font-semibold tabular-nums",
          waiting ? "bg-state-waiting text-ink-on-color" : "bg-cream-bright text-charcoal-bg",
          className,
        )}
      >
        {countText(count)}
      </span>
    </Tooltip>
  );
}
