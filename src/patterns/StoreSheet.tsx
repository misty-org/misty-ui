import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { IconButton } from "../controls/IconButton";
import { Text } from "../display/Text";
import { RowGroupLabel } from "../layout/RowGroup";
import { SidewaysScroll } from "../layout/SidewaysScroll";
import { Dialog, DialogContent, DialogTitle } from "../overlays/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../overlays/DropdownMenu";

/** One fact in a `StoreSheet`'s strip: a small caption over its value. */
export interface StoreFact {
  /** What the fact is, such as "Version" or "License". */
  label: string;
  /** The fact itself: a word, a number, or a few marks. */
  value: React.ReactNode;
}

/**
 * A store item's details (Explore), the one place everything about it lives: a card dialog
 * opened by pressing any row, tile, card or featured pick. Its hero leads: the item's logo at
 * 72px (an `AppLogoImage` or `LogoTile` at the `sheet` size), its name, "By" its maker, then its
 * one action (Get, Update, Open, Use, Sign in, or a `ProgressPill` while it downloads) and a ⋯
 * `menu` for the rest (its source, its docs). Under it the `facts` run as one strip edge to edge,
 * hairlines between them (version, size, license, source; for an engine its status, version and
 * plan). `children` follow a step apart, usually `StoreSheetSection`s and `SettingsSection`s: the
 * description, what's inside, what is set up on this computer, and last a danger Remove or
 * Uninstall. It replaces any page or side panel of its own for an item: there is no Manage.
 */
export function StoreSheet({
  open,
  onOpenChange,
  logo,
  title,
  maker,
  action,
  menu,
  menuLabel,
  facts,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logo: React.ReactNode;
  title: string;
  /** Who made it, drawn as "By …" under the name. */
  maker?: string;
  /** Its one action. */
  action?: React.ReactNode;
  /** MenuItems for the ⋯ beside the action. */
  menu?: React.ReactNode;
  menuLabel?: string;
  facts?: readonly StoreFact[];
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" aria-describedby={undefined}>
        <header className="flex min-w-0 items-center gap-4 pr-10">
          <span className="flex size-16 shrink-0 items-center justify-center">{logo}</span>
          <div className="grid min-w-0 flex-1 gap-0.5">
            <DialogTitle className="m-0 min-w-0">
              <Text size="title" tone="bright" weight="semibold">
                {title}
              </Text>
            </DialogTitle>
            {maker ? (
              <Text size="meta" tone="muted">
                {`By ${maker}`}
              </Text>
            ) : null}
          </div>
          {action || menu ? (
            <div className="flex shrink-0 items-center gap-1">
              {action}
              {menu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton label={menuLabel ?? `More for ${title}`}>
                      <MoreHorizontal />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          ) : null}
        </header>
        {facts?.length ? <StoreFacts facts={facts} /> : null}
        {children ? <div className="grid min-w-0 gap-5 pb-1">{children}</div> : null}
      </DialogContent>
    </Dialog>
  );
}

/**
 * The facts under a `StoreSheet`'s hero: columns side by side, each a muted caption over its
 * value, hairlines along the strip's top and bottom and between the columns, edge to edge
 * across the sheet. When they don't fit the strip scrolls sideways. StoreSheet draws it.
 */
export function StoreFacts({ facts }: { facts: readonly StoreFact[] }) {
  return (
    <SidewaysScroll
      aria-label="Facts"
      role="group"
      className="-mx-(--dialog-inset) border-y-[length:var(--hairline)] border-charcoal-border"
    >
      <dl className="m-0 grid min-w-full auto-cols-[minmax(max-content,1fr)] grid-flow-col">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={
              index
                ? "grid content-start gap-0.5 border-l-[length:var(--hairline)] border-charcoal-border px-6 py-3"
                : "grid content-start gap-0.5 px-6 py-3"
            }
          >
            <Text as="dt" size="caption" tone="muted" bare>
              {fact.label}
            </Text>
            <dd className="m-0 flex min-h-5 items-center gap-1 whitespace-nowrap">
              {typeof fact.value === "string" || typeof fact.value === "number" ? (
                <Text size="meta" weight="medium" bare>
                  {fact.value}
                </Text>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </SidewaysScroll>
  );
}

/**
 * One part of a `StoreSheet`'s body under its muted label (What's inside, Agents on this
 * engine, How it connects), with what it holds under it: a paragraph, `CatalogNames` chips,
 * fields. Rows of settings are a `SettingsSection` instead, which wears the same label.
 */
export function StoreSheetSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="grid min-w-0 gap-1.5">
      {title ? <RowGroupLabel title={title} /> : null}
      {children}
    </section>
  );
}

/**
 * A store item's details as caption and value pairs in a grid, in its `StoreSheet`'s
 * Information: as many columns as fit, each a muted caption over its value, which wraps rather
 * than fades so a source or a commit reads whole.
 */
export function StoreInfo({ items }: { items: readonly StoreFact[] }) {
  return (
    <dl className="m-0 grid min-w-0 grid-cols-[repeat(auto-fill,minmax(--spacing(40),1fr))] gap-x-6 gap-y-4">
      {items.map((item) => (
        <div key={item.label} className="grid min-w-0 content-start gap-0.5">
          <Text as="dt" size="meta" tone="muted" bare>
            {item.label}
          </Text>
          <dd className="m-0 min-w-0 text-control text-cream [overflow-wrap:anywhere]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Pictures of a store item (an app's screenshots) in its `StoreSheet`, two to a row, each at
 * 16:9 with the card's corners on a quiet fill while it loads.
 */
export function StorePreviews({ previews }: { previews: readonly { src: string; alt: string }[] }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {previews.map((preview) => (
        <img
          key={preview.src}
          src={preview.src}
          alt={preview.alt}
          className="aspect-video w-full rounded-xl bg-row-hover object-cover"
        />
      ))}
    </div>
  );
}
