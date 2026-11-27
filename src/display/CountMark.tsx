import { cn } from "../class_names";
import { Tooltip } from "../overlays/Tooltip";

/** A count as a mark shows it: the number up to 99, then "99+". */
export function countText(count: number): string {
  return count > 99 ? "99+" : String(Math.max(0, Math.floor(count)));
}

/** The quiet tag a count is drawn in, shared by CountMark and IndicatorDot's count. */
export const countTagClass = cn(
  "inline-flex h-4 min-w-4.5 shrink-0 items-center justify-center rounded-sm px-1",
  "bg-control-active text-cream text-micro leading-none font-semibold tabular-nums",
);

/**
 * How many messages wait at a row's end: a small grey tag holding the number, quiet enough that a
 * sidebar of them never shouts. It counts things to read (unread messages, mentions, friend
 * requests, invitations) and nothing else: a state (an agent working, waiting on the person or
 * holding new results) is a `StateMark` dot, never a number, and a count is never amber. Past 99
 * it reads "99+". It shows nothing at zero. `label` is its tooltip and accessible name ("3
 * unread"). It is as tall as a StateMark, so it lines up in a column of rows. A count on an icon
 * or a picture is IndicatorDot's `count`.
 *
 * `<CountMark count={3} label="3 unread" />`
 */
export function CountMark({
  count,
  label,
  className,
}: {
  count: number;
  label: string;
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
        className={cn(countTagClass, className)}
      >
        {countText(count)}
      </span>
    </Tooltip>
  );
}
