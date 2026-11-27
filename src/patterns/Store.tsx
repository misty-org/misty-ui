import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "../class_names";
import { Text } from "../display/Text";
import { Skeleton } from "../feedback/Skeleton";
import { RowActions } from "../overlays/RowActions";

/**
 * One section of a store page (Explore): its heading, a muted `detail` beside it ("Picked for
 * English", "3 ready"), one control at its end (See all, Update all, Languages), then what it
 * holds: a `StoreList` of rows, `StoreTiles` of apps or `StoreCards` of engines. Sections go one
 * under another, never switched between by a row of chips.
 *
 * ```tsx
 * <StoreSection title="Popular skills" action={<Button variant="quiet" size="sm">See all</Button>}>
 *   <StoreList>…</StoreList>
 * </StoreSection>
 * ```
 */
export function StoreSection({
  title,
  detail,
  action,
  children,
}: {
  title: string;
  /** A muted word or two beside the title, such as a count or why the list is in this order. */
  detail?: string;
  /** One control at the heading's end. */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} data-slot="store-section" className="grid min-w-0 gap-3">
      <header className="flex min-h-8 min-w-0 items-center gap-2.5">
        <Text as="h2" size="page" tone="bright" weight="semibold" className="m-0 shrink-0">
          {title}
        </Text>
        {detail ? (
          <Text size="meta" tone="muted" className="min-w-0">
            {detail}
          </Text>
        ) : null}
        {action ? <div className="ml-auto flex shrink-0 items-center">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

/**
 * Compact rows of things to add (skills, plugins, templates, MCP servers), in as many columns as
 * the pane holds, up to three, with no lines between them. Each child is a `StoreRow`.
 */
export function StoreList({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="@container/store min-w-0">
      <ul
        aria-label={label}
        className="m-0 grid min-w-0 list-none gap-x-6 gap-y-1 p-0 @2xl/store:grid-cols-2 @4xl/store:grid-cols-3"
      >
        {children}
      </ul>
    </div>
  );
}

function OpenCover({ title, onOpen, round }: { title: string; onOpen: () => void; round: string }) {
  return (
    <button
      type="button"
      data-store-open
      aria-label={title}
      onClick={onOpen}
      className={cn("absolute inset-0 cursor-pointer outline-none", round)}
    />
  );
}

/**
 * One thing to add in a `StoreList`: its logo in a 45px slot (a `LogoTile` or `AppLogoImage` at
 * the `item` size), its name, one muted line about it, a quieter line saying who made it, and its
 * one action at the end (Get, Update, Open, Use, Sign in, Remove, or nothing when there is nothing
 * to do). Pressing anywhere else on the row opens its details (`onOpen`, a `StoreSheet`); it washes
 * under the pointer, with no hairlines. `menu` adds the ⋯ shown on hover and on a right-click.
 */
export function StoreRow({
  logo,
  title,
  line,
  maker,
  action,
  menu,
  menuLabel,
  onOpen,
}: {
  logo?: React.ReactNode;
  title: string;
  /** One line about it, fading at its end. */
  line?: string;
  /** Who made it, drawn as "By …" under the line. */
  maker?: string;
  /** Its one action. */
  action?: React.ReactNode;
  /** MenuItems for the ⋯ on hover and on a right-click. */
  menu?: React.ReactNode;
  menuLabel?: string;
  /** Opens its details. */
  onOpen?: () => void;
}) {
  return (
    <li
      data-slot="store-row"
      className={cn(
        "group/row relative flex min-w-0 items-center gap-3 rounded-lg p-2",
        onOpen && "hover:bg-row-hover has-[[data-store-open]:focus-visible]:bg-row-hover",
      )}
    >
      {onOpen ? <OpenCover title={title} onOpen={onOpen} round="rounded-lg" /> : null}
      {logo != null ? (
        <span className="pointer-events-none relative flex size-10 shrink-0 items-center justify-center">
          {logo}
        </span>
      ) : null}
      <span className="pointer-events-none relative grid min-w-0 flex-1">
        <Text size="control" tone="bright" weight="medium">
          {title}
        </Text>
        {line ? (
          <Text size="meta" tone="muted">
            {line}
          </Text>
        ) : null}
        {maker ? (
          <Text size="caption" tone="muted">
            {`By ${maker}`}
          </Text>
        ) : null}
      </span>
      {menu ? (
        <RowActions label={menuLabel ?? `Actions for ${title}`} className="relative">
          {menu}
        </RowActions>
      ) : null}
      {action ? <span className="relative flex shrink-0 items-center">{action}</span> : null}
    </li>
  );
}

/**
 * Apps as big tiles, four to a row on a wide pane and fewer as it narrows. Each child is a
 * `StoreTile`.
 */
export function StoreTiles({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="@container/store min-w-0">
      <ul
        aria-label={label}
        className="m-0 grid min-w-0 list-none gap-3 p-0 @md/store:grid-cols-2 @2xl/store:grid-cols-3 @4xl/store:grid-cols-4"
      >
        {children}
      </ul>
    </div>
  );
}

/**
 * One app in `StoreTiles`, as a card: its own icon at the top left (an `AppLogoImage` at the
 * `card` size), its one action at the top right, then its name and up to two lines about it, so
 * every tile is one height. Pressing anywhere else on it opens its details (`onOpen`); it takes
 * the card's hover fill. For things with no icon of their own use `StoreRow`.
 */
export function StoreTile({
  logo,
  title,
  line,
  action,
  onOpen,
}: {
  logo: React.ReactNode;
  title: string;
  line?: string;
  action?: React.ReactNode;
  onOpen?: () => void;
}) {
  return (
    <li
      data-slot="store-tile"
      className={cn(
        "group/row relative grid min-w-0 content-start gap-3 rounded-xl bg-charcoal-card p-4",
        onOpen && "hover:bg-charcoal-hover has-[[data-store-open]:focus-visible]:bg-charcoal-hover",
      )}
    >
      {onOpen ? <OpenCover title={title} onOpen={onOpen} round="rounded-xl" /> : null}
      <span className="flex min-w-0 items-center justify-between gap-3">
        <span className="pointer-events-none relative flex shrink-0">{logo}</span>
        {action ? <span className="relative flex shrink-0 items-center">{action}</span> : null}
      </span>
      <span className="pointer-events-none relative grid min-w-0">
        <Text size="control" tone="bright" weight="semibold">
          {title}
        </Text>
        <Text size="meta" tone="muted" lines={2} className="min-h-10">
          {line ?? ""}
        </Text>
      </span>
    </li>
  );
}

/**
 * Cards for what is set up on this computer, one thing each (an engine, a hearing model, a
 * voice, a download), two to a row on a wide pane. Each child is a `StoreCard`.
 */
export function StoreCards({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="@container/store min-w-0">
      <ul
        aria-label={label}
        className="m-0 grid min-w-0 list-none gap-2.5 p-0 @2xl/store:grid-cols-2"
      >
        {children}
      </ul>
    </div>
  );
}

/** How a `StoreCard`'s state reads: `on` (signed in, in use) green, `waiting` amber, `off` muted. */
export type StoreCardState = "on" | "waiting" | "off";

const stateDot: Record<StoreCardState, string> = {
  on: "bg-state-done",
  waiting: "bg-state-waiting",
  off: "bg-cream-muted opacity-60",
};

/**
 * One engine, hearing model or voice in `StoreCards`, as a card: its logo in a 45px slot, its
 * name, its state in words after a small dot (`state`: "Signed in, by Anthropic", "In use, 671
 * MB", "Not installed"), or a plain muted `line` with no dot, then an action only when there is
 * something to do (Update, Sign in, Get, Use, or a `ProgressPill` while it downloads) and a
 * chevron saying the card opens its details (`onOpen`).
 */
export function StoreCard({
  logo,
  title,
  line,
  state,
  action,
  onOpen,
}: {
  logo: React.ReactNode;
  title: string;
  /** Its state or a line about it, in words. */
  line?: string;
  /** Draws the dot before `line` in the state's color; leave it off for a plain line. */
  state?: StoreCardState;
  action?: React.ReactNode;
  onOpen?: () => void;
}) {
  return (
    <li
      data-slot="store-card"
      className={cn(
        "group/row relative flex min-w-0 items-center gap-3 rounded-xl bg-charcoal-card px-3.5 py-3",
        onOpen && "hover:bg-charcoal-hover has-[[data-store-open]:focus-visible]:bg-charcoal-hover",
      )}
    >
      {onOpen ? <OpenCover title={title} onOpen={onOpen} round="rounded-xl" /> : null}
      <span className="pointer-events-none relative flex size-10 shrink-0 items-center justify-center">
        {logo}
      </span>
      <span className="pointer-events-none relative grid min-w-0 flex-1">
        <Text size="control" tone="bright" weight="medium">
          {title}
        </Text>
        {line ? (
          <span className="flex min-w-0 items-center gap-1.5">
            {state ? (
              <span
                aria-hidden="true"
                className={cn("size-1.5 shrink-0 rounded-full", stateDot[state])}
              />
            ) : null}
            <Text size="meta" tone="muted" className="min-w-0">
              {line}
            </Text>
          </span>
        ) : null}
      </span>
      {action ? <span className="relative flex shrink-0 items-center">{action}</span> : null}
      {onOpen ? (
        <span
          aria-hidden="true"
          className="pointer-events-none relative flex shrink-0 text-cream-muted"
        >
          <ChevronRight />
        </span>
      ) : null}
    </li>
  );
}

/**
 * A store section's first load, in the shape of what arrives: `rows` for a `StoreList`, `tiles`
 * for `StoreTiles` or `cards` for `StoreCards`, under the heading's place, so nothing moves when
 * the real ones come.
 */
export function StoreSkeleton({
  label,
  look = "rows",
  items = 6,
}: {
  label: string;
  look?: "rows" | "tiles" | "cards";
  items?: number;
}) {
  const list =
    look === "tiles"
      ? "gap-3 @md/store:grid-cols-2 @2xl/store:grid-cols-3 @4xl/store:grid-cols-4"
      : look === "cards"
        ? "gap-2.5 @2xl/store:grid-cols-2"
        : "gap-x-6 gap-y-1 @2xl/store:grid-cols-2 @4xl/store:grid-cols-3";
  return (
    <section
      role="status"
      aria-label={label}
      aria-busy="true"
      className="@container/store grid min-w-0 gap-3"
    >
      <span className="sr-only">{label}</span>
      <div className="flex h-8 items-center" aria-hidden="true">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className={cn("grid min-w-0", list)} aria-hidden="true">
        {Array.from({ length: items }, (_, index) =>
          look === "tiles" ? (
            <div key={index} className="grid gap-3 rounded-xl bg-charcoal-card p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="size-11 rounded-lg" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-3.5 w-28 max-w-full" />
                <Skeleton className="h-3 w-40 max-w-full" />
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={cn(
                "flex min-w-0 items-center gap-3",
                look === "cards" ? "rounded-xl bg-charcoal-card px-3.5 py-3" : "p-2",
              )}
            >
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="grid min-w-0 flex-1 content-start gap-2">
                <Skeleton className="h-3.5 w-32 max-w-full" />
                <Skeleton className="h-3 w-44 max-w-full" />
              </div>
              <Skeleton className="h-8 w-16 shrink-0" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
