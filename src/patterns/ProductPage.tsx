import { MoreHorizontal, type LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { Text } from "../display/Text";
import { FramedBar } from "../layout/FramedBar";
import { SidewaysScroll } from "../layout/SidewaysScroll";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../overlays/DropdownMenu";

export interface ProductFact {
  /** What the fact is, such as "Made by" or "Stars", small over its value. */
  label: string;
  /** The fact itself, large: a word, a number, or a mark (engine marks, a maker's face). */
  value: React.ReactNode;
  /** One small line under it, such as "On GitHub" or "While speaking". */
  detail?: string;
}

export interface ProductInfoItem {
  label: string;
  value: React.ReactNode;
}

/**
 * A store item's own page, as the Mac App Store's, in place of a dialog: it opens in the store's work
 * column with Back in the page's bar. Its hero leads: a large icon (an `AppLogoImage`, `PersonaLogo`
 * or `LogoTile` at the `hero` size), the name, one line about it, the maker as a quiet link, then
 * the one action (Get, Manage, Update, Open) and a ⋯ `menu` for the rest. Under it, `facts` run as
 * one strip of columns (a caption, the value large, a small line), with no lines between them,
 * scrolling sideways when the pane is too narrow for them. `children` follow a step apart, usually
 * ProductSections: Manage (a SettingsSection of rows with switches and buttons) for what the person
 * has, About, What's inside (`ProductTiles`), Information (`ProductInfo`), then Shelves of more from
 * the maker and things like it.
 *
 * `onHeroOut` says when the hero has scrolled out of view, so the page's bar (`ProductBar`) can take
 * the name and the action in its place.
 *
 * ```tsx
 * <ProductPage logo={<AppLogoImage src={app.logo} name={app.name} size="hero" />} title={app.name}
 *   line={app.description} maker={app.maker} onMaker={showMaker} action={<Button variant="get">Get</Button>}
 *   facts={[{ label: "Made by", value: "Excalidraw" }, { label: "Kind", value: "Web app" }]}
 *   onHeroOut={setPinned}>
 *   <ProductSection title="About">…</ProductSection>
 * </ProductPage>
 * ```
 */
export function ProductPage({
  logo,
  title,
  line,
  maker,
  onMaker,
  action,
  menu,
  menuLabel,
  facts,
  onHeroOut,
  children,
}: {
  logo: React.ReactNode;
  title: string;
  line?: string;
  /** Who made it, under the line. */
  maker?: string;
  /** Opens more from the maker; without it the maker is plain text. */
  onMaker?: () => void;
  /** Its one action. */
  action?: React.ReactNode;
  /** MenuItems for the ⋯ beside the action: everything else it can do. */
  menu?: React.ReactNode;
  menuLabel?: string;
  facts?: readonly ProductFact[];
  onHeroOut?: (out: boolean) => void;
  children?: React.ReactNode;
}) {
  const hero = React.useRef<HTMLDivElement>(null);
  const told = React.useRef(onHeroOut);
  told.current = onHeroOut;
  React.useEffect(() => {
    const element = hero.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry) told.current?.(!entry.isIntersecting);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      told.current?.(false);
    };
  }, []);
  return (
    <article aria-label={title} data-slot="product-page" className="grid min-w-0 gap-9">
      <header className="flex min-w-0 items-center gap-6">
        {logo}
        <div className="grid min-w-0 flex-1 justify-items-start gap-1">
          <Text as="h1" size="display" tone="bright" weight="semibold" className="m-0 max-w-full">
            {title}
          </Text>
          {line ? (
            <Text as="p" size="page" tone="muted" wrap className="m-0 max-w-160">
              {line}
            </Text>
          ) : null}
          {maker ? (
            onMaker ? (
              <button
                type="button"
                onClick={onMaker}
                className="max-w-full cursor-pointer text-left text-control text-cream-muted decoration-current underline-offset-2 outline-none hover:text-cream-bright hover:underline focus-visible:text-cream-bright focus-visible:underline"
              >
                <Text>{maker}</Text>
              </button>
            ) : (
              <Text size="control" tone="muted">
                {maker}
              </Text>
            )
          ) : null}
          <div ref={hero} className="mt-3 flex min-h-8 items-center gap-2">
            {action}
            {menu ? <ProductMenu label={menuLabel ?? `More for ${title}`}>{menu}</ProductMenu> : null}
          </div>
        </div>
      </header>
      {facts?.length ? <ProductFacts facts={facts} /> : null}
      {children}
    </article>
  );
}

function ProductMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={label}>
          <MoreHorizontal />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * The facts under a product's hero, as the App Store's strip: columns side by side, each a caption,
 * its value large and muted, and a small line, centered, with no lines between them. Every column is
 * at least as wide as what it holds, so a value is never cut; when they don't fit the strip scrolls
 * sideways. ProductPage draws it from its `facts`.
 */
export function ProductFacts({ facts }: { facts: readonly ProductFact[] }) {
  return (
    <SidewaysScroll aria-label="Facts" role="group" className="-mx-2 items-stretch">
      <dl className="m-0 grid min-w-full auto-cols-[minmax(max-content,1fr)] grid-flow-col py-1">
        {facts.map((fact) => (
          <div key={fact.label} className="grid justify-items-center content-start gap-1 px-4 text-center">
            <Text as="dt" size="caption" tone="muted" weight="medium" bare>
              {fact.label}
            </Text>
            <dd className="m-0 flex h-9 items-center whitespace-nowrap">
              {typeof fact.value === "string" || typeof fact.value === "number" ? (
                <Text size="title" tone="muted" weight="semibold" bare>
                  {fact.value}
                </Text>
              ) : (
                <span className="flex items-center gap-1 text-cream-muted">{fact.value}</span>
              )}
            </dd>
            <Text size="caption" tone="muted" bare className="min-h-4.5 whitespace-nowrap">
              {fact.detail ?? ""}
            </Text>
          </div>
        ))}
      </dl>
    </SidewaysScroll>
  );
}

/**
 * A titled part of a product page (Manage, About, What's inside, Information), headed as a Shelf is,
 * so the page's parts and the shelves after them read as one page. `action` sits at the heading's
 * end.
 */
export function ProductSection({
  title,
  action,
  children,
  id,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  /** Lets the page scroll to it, such as Manage from a shelf's Manage button. */
  id?: string;
}) {
  return (
    <section id={id} aria-label={title} className="grid min-w-0 scroll-mt-6 gap-3">
      <header className="flex min-h-8 min-w-0 items-center justify-between gap-3">
        <Text as="h2" size="title" tone="bright" weight="semibold" className="m-0">
          {title}
        </Text>
        {action}
      </header>
      {children}
    </section>
  );
}

/** What a thing holds, as tiles on the faint group fill: each a glyph, a number or word, and what it counts. */
export function ProductTiles({ label = "What's inside", children }: { label?: string; children: React.ReactNode }) {
  return (
    <ul
      aria-label={label}
      className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 p-0"
    >
      {children}
    </ul>
  );
}

/** One tile of `ProductTiles`: its glyph (muted), its value large, and what it counts under it. */
export function ProductTile({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <li className="grid min-w-0 content-start gap-1.5 rounded-xl bg-row-hover p-4">
      <span className="text-cream-muted">
        <Icon aria-hidden="true" />
      </span>
      <Text size="display" tone="bright" weight="semibold">
        {value}
      </Text>
      <Text size="meta" tone="muted">
        {label}
      </Text>
    </li>
  );
}

/**
 * Pictures of a product (an app's screenshots), two to a row on a wide pane, each at 16:9 with the
 * card's corners on a quiet fill while it loads.
 */
export function ProductPreviews({ previews }: { previews: readonly { src: string; alt: string }[] }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
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

/**
 * A product's details as caption and value pairs in a grid, as the App Store's Information: as many
 * columns as fit, each a muted caption over its value, which wraps rather than fades so a source or a
 * commit reads whole.
 */
export function ProductInfo({ items }: { items: readonly ProductInfoItem[] }) {
  return (
    <dl className="m-0 grid min-w-0 grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-x-8 gap-y-5">
      {items.map((item) => (
        <div key={item.label} className="grid min-w-0 content-start gap-0.5">
          <Text as="dt" size="meta" tone="muted" bare>
            {item.label}
          </Text>
          <dd className="m-0 min-w-0 text-control text-cream [overflow-wrap:anywhere]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The page's bar while a product page is open, in its FramedPage's `header`: Back at its start, and,
 * once the hero has scrolled out of view (`pinned`, from ProductPage's `onHeroOut`), the product's
 * name beside it and its action at the bar's end, so the one action is always in reach.
 */
export function ProductBar({
  back,
  title,
  action,
  pinned,
}: {
  /** A BackButton. */
  back: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  pinned: boolean;
}) {
  return (
    <FramedBar
      start={
        <div className="flex min-w-0 items-center gap-2">
          {back}
          <Text
            size="control"
            tone="bright"
            weight="semibold"
            aria-hidden={!pinned}
            className={cn("min-w-0", !pinned && "invisible")}
          >
            {title}
          </Text>
        </div>
      }
    >
      {pinned ? action : null}
    </FramedBar>
  );
}
