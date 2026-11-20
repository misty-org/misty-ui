import * as React from "react";

import { cn } from "../classNames";
import { Text } from "../display/Text";
import { Skeleton } from "../feedback/Skeleton";
import { RowActions } from "../overlays/RowActions";

/*
 * A store's shelves, as the App Store lays out its rows: a heading with "See all", then items in
 * two columns, each a large logo with its name, one line and its action under them, split by
 * hairlines. Explore's sections are built from these.
 */

/**
 * A shelf of things to add: its heading (with one action at the end, such as See all), then
 * ShelfItems in two columns on a wide pane, one on a narrow one. Hairlines run between the rows
 * of each column, never under its last.
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
  columns = 2,
  children,
}: {
  title: string;
  /** One control at the heading's end, such as See all. */
  action?: React.ReactNode;
  /** Two columns once the pane is wide (default), or always one, such as an updates list. */
  columns?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="grid min-w-0 gap-1">
      <header className="flex min-h-8 min-w-0 items-center justify-between gap-3">
        <Text as="h2" size="title" tone="bright" weight="semibold" className="m-0">
          {title}
        </Text>
        {action}
      </header>
      <ul
        className={cn(
          "m-0 grid min-w-0 list-none p-0",
          // The last row of each column has no hairline under it.
          "[&>li:last-child>[data-shelf-text]]:border-b-0",
          columns === 2 &&
            "lg:grid-cols-2 lg:gap-x-8 lg:[&>li:nth-last-child(2):nth-child(odd)>[data-shelf-text]]:border-b-0",
        )}
      >
        {children}
      </ul>
    </section>
  );
}

/**
 * One item on a Shelf: its logo (an `AppLogoImage`, `PersonaLogo` or a maker's
 * picture, at the `tile` size), its name and one line, and its one action under them (Get, Make
 * agent, or `CatalogDone` once it's done). Pressing the logo or the name opens its details; the
 * rest of its actions sit in its ⋯ menu.
 */
export function ShelfItem({
  logo,
  title,
  line,
  action,
  menu,
  menuLabel,
  onOpen,
}: {
  logo: React.ReactNode;
  title: string;
  /** One line about it, under its name. */
  line?: string;
  /** Its one action, under the line. */
  action?: React.ReactNode;
  /** MenuItems for the ⋯ that shows on hover and opens on right-click. */
  menu?: React.ReactNode;
  menuLabel?: string;
  /** Opens its details. */
  onOpen?: () => void;
}) {
  const words = (
    <>
      <Text size="control" tone="bright" weight="medium">
        {title}
      </Text>
      {line ? (
        <Text size="meta" tone="muted">
          {line}
        </Text>
      ) : null}
    </>
  );
  return (
    <li className="group/row relative flex min-w-0 gap-4 pt-4">
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${title}, details`}
          className="flex min-w-0 shrink-0 rounded-[15px] outline-none focus-visible:outline-1 focus-visible:outline-cream-muted"
        >
          {logo}
        </button>
      ) : (
        <span className="flex shrink-0">{logo}</span>
      )}
      <div
        data-shelf-text
        className="flex min-w-0 flex-1 flex-col gap-2.5 border-b border-charcoal-border pb-4"
      >
        <div className="flex min-w-0 items-start gap-2">
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              className="grid min-w-0 flex-1 gap-0.5 rounded-sm pt-1 text-left outline-none hover:underline focus-visible:underline decoration-cream-muted underline-offset-2"
            >
              {words}
            </button>
          ) : (
            <span className="grid min-w-0 flex-1 gap-0.5 pt-1">{words}</span>
          )}
          {menu ? (
            <RowActions label={menuLabel ?? `Actions for ${title}`}>{menu}</RowActions>
          ) : null}
        </div>
        {action ? <div className="flex min-w-0 items-center gap-2">{action}</div> : null}
      </div>
    </li>
  );
}

/**
 * A Shelf's first load, in its shape: the heading, then items with the logo tile, two lines and
 * the action under them, in the same two columns, so nothing moves when the real ones arrive.
 */
export function ShelfSkeleton({ label, items = 4 }: { label: string; items?: number }) {
  return (
    <section role="status" aria-label={label} aria-busy="true" className="grid min-w-0 gap-1">
      <span className="sr-only">{label}</span>
      <div className="flex h-8 items-center" aria-hidden="true">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid min-w-0 lg:grid-cols-2 lg:gap-x-8" aria-hidden="true">
        {Array.from({ length: items }, (_, index) => (
          <div key={index} className="flex min-w-0 gap-4 pt-4 pb-4">
            <Skeleton className="size-16 shrink-0 rounded-[15px]" />
            <div className="grid min-w-0 flex-1 content-start gap-2 pt-1">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-52 max-w-full" />
              <Skeleton className="mt-1 h-6 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
