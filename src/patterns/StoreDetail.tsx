import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "../classNames";
import { Text } from "../display/Text";
import { IconButton } from "../controls/IconButton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../overlays/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../overlays/DropdownMenu";

/*
 * What opens when something in a store is picked (Get on an app, a persona's name), as the App
 * Store's product page: its banner across the top, its logo, name and line with the one action,
 * a strip of facts, previews, then what it is in words.
 */

export interface StoreFact {
  /** What the fact is, such as "Maker" or "Size". */
  label: string;
  /** The fact itself, large. */
  value: React.ReactNode;
  /** A muted line under it, such as "MIT OR Apache-2.0". */
  detail?: string;
}

export interface StorePreview {
  src: string;
  /** What the picture shows, for screen readers. */
  alt: string;
}

/**
 * A store item's details in a dialog. The banner (when it has one) spans the top edge to edge;
 * under it come the logo (`tile` size), the name, one line and the one action (Get, Make agent,
 * Install) with a ⋯ `menu` for the rest; then `facts` as a row of cells split by hairlines; then `previews` two to a row; then
 * `children`, usually StoreDetailSections (About, What it can do).
 *
 * ```tsx
 * <StoreDetail open={open} onOpenChange={setOpen} banner={app.banner} logo={<AppLogoImage … size="tile" />}
 *   title="FilmCraft" line="Open-source video editor" action={<Button variant="primary">Get</Button>}
 *   facts={[{ label: "Maker", value: "storytold" }, { label: "Size", value: "15.6", detail: "MB" }]}>
 *   <StoreDetailSection title="About">…</StoreDetailSection>
 * </StoreDetail>
 * ```
 */
export function StoreDetail({
  open,
  onOpenChange,
  banner,
  logo,
  title,
  line,
  action,
  menu,
  facts,
  previews,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The banner the item exports, if it has one. */
  banner?: string;
  logo: React.ReactNode;
  title: string;
  line?: string;
  /** Its one action, under its name: `get-filled` to get it, or `CatalogDone` once it's in. */
  action?: React.ReactNode;
  /**
   * Everything else it can do (Turn off, Open its page, Remove), as MenuItems in a ⋯ beside the
   * action, so the one action stays alone.
   */
  menu?: React.ReactNode;
  facts?: readonly StoreFact[];
  previews?: readonly StorePreview[];
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <div className="grid min-w-0 gap-6">
          {banner ? (
            <div
              aria-hidden="true"
              className="-mx-6 -mt-6 aspect-[3/1] rounded-t-xl bg-cover bg-center"
              style={{ backgroundImage: `url("${banner}")` }}
            />
          ) : null}
          <div className="flex min-w-0 items-start gap-5">
            {logo}
            <div className="grid min-w-0 flex-1 gap-1">
              <DialogTitle asChild>
                <Text as="h2" size="display" tone="bright" weight="semibold" className="m-0">
                  {title}
                </Text>
              </DialogTitle>
              {line ? (
                <DialogDescription asChild>
                  <Text as="p" size="page" tone="muted" className="m-0">
                    {line}
                  </Text>
                </DialogDescription>
              ) : null}
              {action || menu ? (
                <div className="mt-3 flex items-center gap-2">
                  {action}
                  {menu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton label={`More for ${title}`}>
                          <MoreHorizontal />
                        </IconButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">{menu}</DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          {facts?.length ? <StoreFacts facts={facts} /> : null}
          {previews?.length ? (
            <StoreDetailSection title="Preview">
              <div className="grid gap-4 sm:grid-cols-2">
                {previews.map((preview) => (
                  <img
                    key={preview.src}
                    src={preview.src}
                    alt={preview.alt}
                    className="aspect-video w-full rounded-xl border border-charcoal-border object-cover"
                  />
                ))}
              </div>
            </StoreDetailSection>
          ) : null}
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The row of facts under a store item's name: equal cells split by hairlines, never wrapping. */
function StoreFacts({ facts }: { facts: readonly StoreFact[] }) {
  return (
    <dl
      className={cn(
        "m-0 grid min-w-0 border-y border-charcoal-border py-3",
        "divide-x divide-charcoal-border",
      )}
      style={{ gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))` }}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="grid min-w-0 justify-items-center gap-1 px-2 text-center">
          <Text as="dt" size="caption" tone="muted">
            {fact.label}
          </Text>
          <Text as="dd" size="title" tone="bright" weight="semibold" className="m-0">
            {fact.value}
          </Text>
          {fact.detail ? (
            <Text size="caption" tone="muted">
              {fact.detail}
            </Text>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

/** A titled part of a StoreDetail, such as About or What it can do, a hairline above it. */
export function StoreDetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="grid min-w-0 gap-3 border-t border-charcoal-border pt-5">
      <Text as="h3" size="title" tone="bright" weight="semibold" className="m-0">
        {title}
      </Text>
      {children}
    </section>
  );
}
