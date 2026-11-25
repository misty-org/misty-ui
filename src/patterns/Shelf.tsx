import * as React from "react";

import { cn } from "../class_names";
import { Text } from "../display/Text";
import { Skeleton } from "../feedback/Skeleton";
import { RowActions } from "../overlays/RowActions";

/**
 * A shelf of things to add, as the App Store's: its heading (with one action at the end, such as See
 * all), then ShelfItems in as many columns as the pane holds, up to three (`columns` caps it), one on a
 * narrow pane. Hairlines run between the rows of each column, never over the first row or under the
 * last.
 *
 * ```tsx
 * <Shelf title="Open-source apps" action={<Button variant="quiet" size="sm">See all</Button>}>
 *   <ShelfItem logo={…} title="FilmCraft" line="Open-source video editor" action={…} />
 * </Shelf>
 * ```
 */
export function Shelf({
  title,
  action,
  columns = 3,
  children,
}: {
  title: string;
  /** One control at the heading's end, such as See all. */
  action?: React.ReactNode;
  /** The most columns it takes once the pane is wide: three (default), two, or always one, such as an updates list. */
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="@container/shelf grid min-w-0 gap-1">
      <header className="flex min-h-8 min-w-0 items-center justify-between gap-3">
        <Text as="h2" size="title" tone="bright" weight="semibold" className="m-0">
          {title}
        </Text>
        {action}
      </header>
      <div className="min-w-0 overflow-hidden">
        <ul
          className={cn(
            "m-0 -mt-px grid min-w-0 list-none p-0",
            columns >= 2 && "@3xl/shelf:grid-cols-2 @3xl/shelf:gap-x-8",
            columns === 3 && "@5xl/shelf:grid-cols-3",
          )}
        >
          {children}
        </ul>
      </div>
    </section>
  );
}

/**
 * One item on a Shelf, as an App Store row: its logo (an `AppLogoImage`, `PersonaLogo` or `LogoTile`
 * at the `tile` size), its name and a line of up to two lines, and its one action at the row's right
 * end: Get, Update, Open, or Manage once the person has it (a secondary button that opens the item's
 * Manage section, never a check mark or a status word). Pressing the logo or the name opens its page;
 * the rest of its actions sit in its ⋯ menu, shown on hover. Leave `logo` off where the items would
 * all wear the same one: they start with their name.
 */
export function ShelfItem({
  logo,
  lead,
  title,
  line,
  action,
  menu,
  menuLabel,
  onOpen,
}: {
  /** Its own logo; left off when it would only repeat its neighbours'. */
  logo?: React.ReactNode;
  /**
   * A control in the logo's place, such as a voice's play button: drawn as given, never inside
   * the button that opens the item. Takes the place of `logo`.
   */
  lead?: React.ReactNode;
  title: string;
  /** One line about it, under its name, wrapping onto a second before it fades. */
  line?: string;
  /** Its one action, at the row's right end. */
  action?: React.ReactNode;
  /** MenuItems for the ⋯ that shows on hover and opens on right-click. */
  menu?: React.ReactNode;
  menuLabel?: string;
  /** Opens its page. */
  onOpen?: () => void;
}) {
  const words = (
    <>
      <Text size="control" tone="bright" weight="medium">
        {title}
      </Text>
      {line ? (
        <Text size="meta" tone="muted" lines={2}>
          {line}
        </Text>
      ) : null}
    </>
  );
  return (
    <li className="group/row relative flex min-w-0 items-center gap-4">
      {lead != null ? (
        <span className="flex size-16 shrink-0 items-center justify-center">{lead}</span>
      ) : logo == null ? null : onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          tabIndex={-1}
          aria-hidden="true"
          className="flex min-w-0 shrink-0 cursor-pointer rounded-[calc(var(--spacing)*3.75)] outline-none"
        >
          {logo}
        </button>
      ) : (
        <span className="flex shrink-0">{logo}</span>
      )}
      <div
        data-shelf-text
        className="flex min-h-20 min-w-0 flex-1 items-center gap-3 self-stretch border-t border-charcoal-border py-3"
      >
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="grid min-w-0 flex-1 cursor-pointer gap-0.5 rounded-sm text-left outline-none hover:underline focus-visible:underline decoration-cream-muted underline-offset-2"
          >
            {words}
          </button>
        ) : (
          <span className="grid min-w-0 flex-1 gap-0.5">{words}</span>
        )}
        {menu ? <RowActions label={menuLabel ?? `Actions for ${title}`}>{menu}</RowActions> : null}
        {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
      </div>
    </li>
  );
}

/**
 * A Shelf's first load, in its shape: the heading, then items with the logo tile, two lines and
 * the action at the row's end, in the same columns, so nothing moves when the real ones arrive.
 * `logos={false}` leaves the tile out, for a shelf whose items have no logo.
 */
export function ShelfSkeleton({
  label,
  items = 6,
  logos = true,
}: {
  label: string;
  items?: number;
  logos?: boolean;
}) {
  return (
    <section
      role="status"
      aria-label={label}
      aria-busy="true"
      className="@container/shelf grid min-w-0 gap-1"
    >
      <span className="sr-only">{label}</span>
      <div className="flex h-8 items-center" aria-hidden="true">
        <Skeleton className="h-4 w-32" />
      </div>
      <div
        className="grid min-w-0 @3xl/shelf:grid-cols-2 @3xl/shelf:gap-x-8 @5xl/shelf:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: items }, (_, index) => (
          <div key={index} className="flex min-h-20 min-w-0 items-center gap-4">
            {logos ? (
              <Skeleton className="size-16 shrink-0 rounded-[calc(var(--spacing)*3.75)]" />
            ) : null}
            <div className="grid min-w-0 flex-1 content-start gap-2">
              <Skeleton className="h-3.5 w-36 max-w-full" />
              <Skeleton className="h-3 w-52 max-w-full" />
            </div>
            <Skeleton className="h-6 w-14 shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}
