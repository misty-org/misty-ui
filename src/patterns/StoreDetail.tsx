import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { PropertyList } from "../display/PropertyList";
import { Text } from "../display/Text";
import { RowGroupLabel } from "../layout/RowGroup";
import { IconButton } from "../controls/IconButton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../overlays/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../overlays/DropdownMenu";

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
 * Install) with a ⋯ `menu` for the rest; then `facts` as one group of rows (the fact, then its
 * value muted at the row's end); then `previews` two to a row; then `children`, usually
 * StoreDetailSections (About, What it can do), each a label over its content, a step apart.
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
                <Text as="h2" size="title" tone="bright" weight="semibold" className="m-0">
                  {title}
                </Text>
              </DialogTitle>
              {line ? (
                <DialogDescription asChild>
                  <Text as="p" size="meta" tone="muted" className="m-0">
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
                    className="aspect-video w-full rounded-xl bg-row-hover object-cover"
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

/** The facts under a store item's name: one group of rows, each fact with its value muted at its end. */
function StoreFacts({ facts }: { facts: readonly StoreFact[] }) {
  return (
    <section aria-label="Facts" className="grid min-w-0 gap-1.5">
      <RowGroupLabel title="Facts" />
      <PropertyList
        layout="grouped"
        items={facts.map((fact) => ({
          label: fact.label,
          value: fact.detail ? `${fact.value} ${fact.detail}` : fact.value,
        }))}
      />
    </section>
  );
}

/** A titled part of a StoreDetail, such as About or What it can do: a RowGroupLabel over it. */
export function StoreDetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="grid min-w-0 gap-1.5">
      <RowGroupLabel title={title} />
      <div className="min-w-0 px-0.5 text-control text-cream">{children}</div>
    </section>
  );
}
