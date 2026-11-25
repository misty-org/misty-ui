import { ArrowLeft, ArrowRight, Menu, Search, type LucideIcon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "../class_names";
import { Button } from "../controls/Button";
import { Pressable } from "../controls/Pressable";
import { MistyMark } from "../icons/MistyMark";
import { Sheet, SheetContent, SheetTitle } from "../overlays/Sheet";
import { Kbd } from "../display/Kbd";
import { CommandEmpty } from "../overlays/Command";
import { Dialog, DialogContent, DialogTitle } from "../overlays/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../overlays/DropdownMenu";
import { FoldChevron, MenuChevron } from "../overlays/MenuChevron";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";
import { MenuRadioGroup, MenuRadioItem } from "../overlays/MenuItem";
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteList,
} from "../overlays/CommandPalette";
import { Surface } from "../display/Surface";
import { Text } from "../display/Text";
import { OverflowFadeText } from "./OverflowFadeText";
import { Separator } from "./Separator";

/**
 * A documentation site's page in three panels, as Vercel's docs are: the section's pages in a
 * column at the start (243px, 297px from 80rem), the article (768px at most, set against that column rather than
 * centered) and "On this page" in a column at the end (216px, 270px from 80rem), under a header that stays put. The
 * side columns stay in view while the article scrolls, and all three start on one line. Under
 * 52rem the pages move into a sheet opened from a Menu bar under the header (`navLabel` names it,
 * usually the open page's title, and it closes when `page` changes); under 62rem the contents go.
 * `header` is a `DocsHeader`, `nav` the open docs' `DocsNavGroup`s, `toc` a `DocsToc`, and the
 * article's footer (a `DocsPager`) goes last in `children`. The page is `--docs-max` wide (90rem)
 * with `--docs-gutter` at its sides (none). Everything that stays in view sits below `--docs-bar`
 * (the header's height, 0 where the site's own bar replaces it) and `--docs-top` (0, or the
 * height of a site's own navbar above). Only for a docs site; the app's pages use their own
 * layouts. The article's running text sits a step below the text color, between it and the muted
 * text, so its headings, bold terms and links read brighter than the prose around them and the
 * muted lead and captions a step below it.
 *
 * ```tsx
 * <DocsLayout header={<DocsHeader … />} nav={<DocsNavGroup … />} toc={<DocsToc … />} page={route}>
 *   <article>…</article>
 *   <DocsPager previous={…} next={…} />
 * </DocsLayout>
 * ```
 */
export function DocsLayout({
  header,
  nav,
  toc,
  page,
  navLabel = "Menu",
  children,
}: {
  header?: ReactNode;
  nav?: ReactNode;
  toc?: ReactNode;
  /** The open page, so the narrow screen's sheet of pages closes once another is picked. */
  page?: string;
  navLabel?: string;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => setNavOpen(false), [page]);
  return (
    <div data-slot="docs-layout">
      {header}
      {nav ? (
        <Surface
          tone="page"
          className="sticky top-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header)))] z-(--stack-sticky) flex h-10 items-center border-b border-charcoal-border px-3 min-[52rem]:hidden"
        >
          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <Button variant="quiet" size="sm" icon={Menu} onClick={() => setNavOpen(true)} className="min-w-0">
              {navLabel}
            </Button>
            <SheetContent side="left" className="grid content-start gap-1 overflow-y-auto px-3 pt-14 pb-10">
              <SheetTitle className="sr-only">Pages</SheetTitle>
              {nav}
            </SheetContent>
          </Sheet>
        </Surface>
      ) : null}
      <div
        className={cn(
          "mx-auto grid max-w-(--docs-max,90rem) px-(--docs-gutter,0px)",
          nav && "min-[52rem]:grid-cols-[--spacing(54)_minmax(0,1fr)] min-[80rem]:grid-cols-[--spacing(66)_minmax(0,1fr)]",
          toc && nav && "min-[62rem]:grid-cols-[--spacing(54)_minmax(0,1fr)_--spacing(48)] min-[80rem]:grid-cols-[--spacing(66)_minmax(0,1fr)_--spacing(60)]",
          toc && !nav && "min-[62rem]:grid-cols-[minmax(0,1fr)_--spacing(48)] min-[80rem]:grid-cols-[minmax(0,1fr)_--spacing(60)]",
        )}
      >
        {nav ? (
          <aside
            aria-label="Pages"
            className={cn(
              "sticky hidden content-start gap-1 overflow-y-auto overscroll-contain px-3 pt-8 pb-12 min-[52rem]:grid",
              "top-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header)))]",
              "h-[calc(100dvh-var(--docs-top,0px)-var(--docs-bar,var(--ui-header)))]",
            )}
          >
            {nav}
          </aside>
        ) : null}
        <main className="flex min-w-0 flex-col px-5 pt-8 pb-16 min-[52rem]:px-10">
          <div className="flex w-full max-w-3xl flex-1 flex-col text-[color-mix(in_srgb,var(--misty-theme-text)_62%,var(--misty-theme-text-muted))]">
            {children}
          </div>
        </main>
        {toc ? <div className="hidden pr-5 min-[62rem]:block">{toc}</div> : null}
      </div>
    </div>
  );
}

/**
 * One section of a docs sidebar that folds open and shut: its name as a row with a FoldChevron at its
 * end, turning down while open, and its pages under it, set in a step. `defaultOpen` opens it at
 * first, usually for the section holding the open page; it opens again whenever `open` turns true
 * (another of its pages is picked). Without `title` it is just its rows, such as Overview at the top.
 * Its rows are `NavRow tone="page"`s; sections go one under another, 4.5px apart.
 */
export function DocsNavGroup({
  title,
  defaultOpen = false,
  open: holdsOpenPage,
  children,
}: {
  title?: string;
  defaultOpen?: boolean;
  /** It holds the open page; it opens whenever this turns true. */
  open?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen || !!holdsOpenPage);
  useEffect(() => {
    if (holdsOpenPage) setOpen(true);
  }, [holdsOpenPage]);
  if (!title) return <div className="grid gap-0.5">{children}</div>;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Pressable
          wash="row"
          className="flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-control font-medium text-cream-bright"
        >
          <OverflowFadeText className="min-w-0 flex-1">{title}</OverflowFadeText>
          <FoldChevron className="text-cream-muted" />
        </Pressable>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-3 grid gap-0.5 border-l border-charcoal-border ps-1.5 pt-0.5 pb-1.5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * A heading in a docs article, anchored by its `id` so "On this page" can bring it into view:
 * a section (`level` 2, 24px) or a part of one (`level` 3, 19px), set tight as the title is.
 * Docs only: its sizes are the docs' own.
 */
export function DocsHeading({ id, level = 2, children }: { id?: string; level?: 2 | 3; children: ReactNode }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 scroll-mt-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header))+--spacing(6))] font-semibold text-cream-bright",
        level === 2
          ? "mt-6 text-[1.5rem] leading-[1.33] tracking-[-0.04em]"
          : "mt-2 text-[1.1875rem] leading-[1.37] tracking-[-0.02em]",
      )}
    >
      {children}
    </Tag>
  );
}

export interface DocsHeaderSection {
  id: string;
  label: string;
}

export interface DocsHome {
  /** Where the site's own home is, such as https://mistysys.com. */
  href: string;
  /** Its name beside Misty's mark ("Misty"), also the link's accessible name with "home". */
  label: string;
}

/** One crumb of the docs' trail: every name in it is the same size, weight and spacing. */
const crumb =
  "inline-flex h-9 min-w-0 flex-none items-center gap-3 rounded-md px-2 text-page font-semibold tracking-[-0.02em] text-cream-bright no-underline";
const crumbControl = "h-8 gap-1.5 text-control tracking-[-0.01em]";

/**
 * One name in a docs trail that leads somewhere: Misty's mark and name back to the site's home, or the
 * docs' name to their front page. It has the trail's size and weight and takes the control wash under
 * the pointer, as `DocsSwitcher`'s menu does, so every name in the trail answers the pointer alike.
 * With `asChild` it styles a router link; `flush` starts its content on the line its own box starts on,
 * for the first name in a bar whose padding the trail should line up with. A name that opens a menu is
 * `DocsSwitcher` instead.
 */
export const DocsCrumb = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentPropsWithoutRef<"a">, "className"> & { asChild?: boolean; flush?: boolean }
>(({ asChild = false, flush = false, ...props }, ref) => {
  const Component = asChild ? Slot : "a";
  return <Component ref={ref} data-wash="control" className={cn(crumb, flush && "-ml-2")} {...props} />;
});
DocsCrumb.displayName = "DocsCrumb";

function CrumbSlash() {
  return (
    <Text size="page" tone="muted" aria-hidden="true">
      /
    </Text>
  );
}

/**
 * The docs site's top band, as Vercel's: a trail of Misty's mark and name leading back to the site's
 * own home (`home`), the docs' name (`name`, which opens the docs' front page through `onName`) and
 * the docs you are in as a menu that switches between them (App, SDK, Design…), with the open one
 * checked, each a slash apart and all at one size and weight; `children` (theme, GitHub, a
 * Download button) sit at its end. It stays at the top while the page scrolls, on the page's own
 * color with a hairline under it.
 */
export function DocsHeader({
  home,
  name,
  onName,
  sections,
  current,
  onSelect,
  title = "Browse",
  children,
}: {
  home?: DocsHome;
  name: string;
  onName: () => void;
  sections: DocsHeaderSection[];
  current: string | undefined;
  onSelect: (id: string) => void;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <Surface
      as="header"
      tone="page"
      data-slot="docs-header"
      className="sticky top-(--docs-top,0px) z-(--stack-sticky) flex h-(--ui-header) items-center gap-3 border-b border-charcoal-border px-3"
    >
      <div className="flex min-w-0 items-center gap-0.5">
        {home ? (
          <>
            <DocsCrumb href={home.href} aria-label={`${home.label} home`}>
              <MistyMark className="size-7" />
              <span className="max-[30rem]:hidden">{home.label}</span>
            </DocsCrumb>
            <CrumbSlash />
          </>
        ) : null}
        <Pressable wash="control" onClick={onName} className={crumb}>
          {name}
        </Pressable>
        <DocsSwitcher sections={sections} current={current} onSelect={onSelect} title={title} />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">{children}</div>
    </Surface>
  );
}

/**
 * A slash and the name of the docs you are in as a menu that switches between them, with the open
 * one checked, at the size and weight of the names before it. `DocsHeader` holds it; a site whose
 * own bar carries the docs' trail (a navbar) puts it there instead, with `size` matching its names
 * and `flush` when they have no padding of their own.
 */
export function DocsSwitcher({
  sections,
  current,
  onSelect,
  title = "Browse",
  slash = true,
  size = "page",
  flush = false,
}: {
  sections: DocsHeaderSection[];
  current: string | undefined;
  onSelect: (id: string) => void;
  title?: string;
  /** The slash before it, which follows a name in a bar; leave it off where the menu stands first. */
  slash?: boolean;
  /** The names' size in the trail it joins: `page`, as Misty's name is set beside its logo, or `control` in a tighter bar. */
  size?: "control" | "page";
  /** Its name starts on the line its own box starts on (the hover wash reaching past it), for a trail whose other names have no padding. */
  flush?: boolean;
}) {
  const open = sections.find((section) => section.id === current);
  return (
    <>
      {slash ? <CrumbSlash /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable wash="control" aria-label="Choose the docs" className={cn(crumb, size === "control" && crumbControl, flush && "-ml-2", "data-[state=open]:bg-control-active")}>
            <OverflowFadeText>{open?.label ?? title}</OverflowFadeText>
            <MenuChevron />
          </Pressable>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <MenuRadioGroup value={current ?? ""} onValueChange={onSelect}>
            {sections.map((section) => (
              <MenuRadioItem key={section.id} value={section.id} label={section.label} />
            ))}
          </MenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/**
 * The top of a docs page, as Vercel's: an eyebrow (its section), the title at 40px set tight,
 * and the lead under it in the article's own text, 27px below which the article starts. Docs only:
 * its sizes are the docs' own, bigger than the app's `display` role.
 */
export function DocsTitle({ title, eyebrow, lead }: { title: string; eyebrow?: string; lead?: string }) {
  return (
    <header className="mb-6 grid gap-2.5">
      {eyebrow ? (
        <Text size="meta" weight="medium" tone="muted">
          {eyebrow}
        </Text>
      ) : null}
      <h1 className="m-0 text-[clamp(2rem,4vw,2.5rem)] leading-[1.2] font-semibold tracking-[-0.05em] text-cream-bright">
        {title}
      </h1>
      {lead ? (
        <Text size="body" tone="muted" wrap className="leading-[1.7]">
          {lead}
        </Text>
      ) : null}
    </header>
  );
}

/**
 * A docs site's front page opening: a very large title, the lead, its buttons (`actions`), and
 * a panel under them (`aside`, usually a `CodeBlock` with a `header`), all on the article's line.
 * Docs only.
 */
export function DocsHero({
  title,
  lead,
  actions,
  aside,
}: {
  title: string;
  lead: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="grid gap-8 pb-14">
      <div className="grid gap-5">
        <h1 className="m-0 text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.055em] text-cream-bright">
          {title}
        </h1>
        <Text size="page" tone="muted" wrap className="max-w-xl leading-[1.65]">
          {lead}
        </Text>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {aside ? <div className="min-w-0 max-w-xl">{aside}</div> : null}
    </section>
  );
}

/**
 * One card on a docs page that links somewhere: its icon over a title and a line, on a hairline
 * edge that washes under the pointer. Put them in a grid, three to a row on a wide article.
 */
export function DocsCard({
  icon: Icon,
  title,
  children,
  onSelect,
}: {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  onSelect: () => void;
}) {
  return (
    <Surface
      as={Pressable}
      tone="page"
      edge="hairline"
      radius="xl"
      wash="card"
      onClick={onSelect}
      className="grid content-start gap-2 p-5 text-left"
    >
      {Icon ? <Icon className="mb-2 text-cream" /> : null}
      <Text size="body" weight="semibold" tone="bright">
        {title}
      </Text>
      <Text size="meta" tone="muted" wrap className="leading-[1.6]">
        {children}
      </Text>
    </Surface>
  );
}

export interface DocsTocItem {
  id: string;
  text: string;
}

/**
 * "On this page": the article's own sections as a column of links that stays in view beside it,
 * the one being read in the bright text and the rest muted. `onSelect` scrolls to a section; the
 * caller decides which is `active`.
 */
export function DocsToc({
  items,
  active,
  onSelect,
  label = "On this page",
}: {
  items: DocsTocItem[];
  active: string | undefined;
  onSelect: (id: string) => void;
  label?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label={label}
      className="sticky top-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header)))] grid max-h-[calc(100dvh-var(--docs-top,0px)-var(--docs-bar,var(--ui-header)))] content-start gap-3 overflow-y-auto pt-8 pb-12"
    >
      <Text size="meta" tone="muted" className="flex h-7 items-center">
        {label}
      </Text>
      <div className="grid border-l border-charcoal-border">
        {items.map((item) => (
          <Pressable
            key={item.id}
            wash="text"
            aria-current={active === item.id ? "location" : undefined}
            onClick={() => onSelect(item.id)}
            className={cn(
              "-ml-px border-l py-1.5 pl-3.5 text-left",
              active === item.id ? "border-cream-bright" : "border-transparent",
            )}
          >
            <Text size="meta" weight={active === item.id ? "medium" : undefined} tone={active === item.id ? "bright" : "muted"} wrap>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </div>
    </nav>
  );
}

export interface DocsPagerLink {
  label: string;
  /** The section it belongs to, when it isn't this page's own. */
  group?: string;
  onSelect: () => void;
}

function DocsPagerCard({ link, side }: { link: DocsPagerLink; side: "previous" | "next" }) {
  const Arrow = side === "previous" ? ArrowLeft : ArrowRight;
  return (
    <Surface
      as={Pressable}
      tone="page"
      edge="hairline"
      radius="xl"
      wash="card"
      onClick={link.onSelect}
      className={cn(
        "flex min-w-0 items-center gap-3 px-4 py-3.5",
        side === "next" ? "flex-row-reverse text-right sm:col-start-2" : "text-left",
      )}
    >
      <Arrow className="shrink-0 text-cream-muted" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <Text size="meta" tone="muted">
          {link.group ?? (side === "previous" ? "Previous" : "Next")}
        </Text>
        <Text size="control" weight="medium" tone="bright">
          {link.label}
        </Text>
      </span>
    </Surface>
  );
}

/**
 * The links to the pages either side of this one: two cards with a hairline edge along the
 * article's bottom edge, the previous one at the start and the next at the end, each saying which
 * section it is in when that isn't this page's own. They stay on screen as the page scrolls, over a
 * fade of the page's own color, so the next page is always one press away. Put it last in the
 * `DocsLayout`'s children.
 */
export function DocsPager({ previous, next }: { previous?: DocsPagerLink; next?: DocsPagerLink }) {
  if (!previous && !next) return null;
  return (
    <nav
      aria-label="Pages"
      className={cn(
        "sticky bottom-0 mt-16 grid gap-3 bg-(--misty-theme-bg) py-4 sm:grid-cols-2",
        "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-8",
        "before:bg-linear-to-t before:from-(--misty-theme-bg) before:to-transparent",
      )}
    >
      {previous ? <DocsPagerCard link={previous} side="previous" /> : null}
      {next ? <DocsPagerCard link={next} side="next" /> : null}
    </nav>
  );
}

export interface DocsSearchItem {
  id: string;
  label: string;
  /** The section it is in, shown as its group in the results. */
  group: string;
  /** What it belongs to (App, SDK, Design), muted at the row's end. */
  detail?: string;
}

/**
 * The docs' search: a bordered field at the top of the sidebar that says "Search docs" with its
 * ⌘K hint, and opens the same palette as Misty's own search (an input, a hairline, then rows under
 * their headings) where typing narrows every page by name. Press ⌘K (or Ctrl+K) anywhere to open
 * it. Picking a result calls `onSelect` and closes it.
 */
export function DocsSearch({
  items,
  onSelect,
  placeholder = "Search docs",
}: {
  items: DocsSearchItem[];
  onSelect: (id: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const groups = [...new Map(items.map((item) => [`${item.detail ?? ""}\u0000${item.group}`, item])).values()];
  return (
    <>
      <Pressable
        wash="control"
        onClick={() => setOpen(true)}
        className="flex h-8 w-full items-center gap-2 rounded-md border border-charcoal-border px-2 text-left"
      >
        <Search className="text-cream-muted" />
        <Text size="control" tone="muted" className="min-w-0 flex-1">
          {placeholder}
        </Text>
        <Kbd size="micro">⌘K</Kbd>
      </Pressable>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent placement="top" hideClose className="max-w-170 gap-0 overflow-hidden p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{placeholder}</DialogTitle>
          <CommandPalette loop className="max-h-[min(--spacing(140),calc(100dvh_-_var(--spacing)*32))]">
            <CommandPaletteInput autoFocus placeholder={placeholder} className="pt-5 pr-14 pb-4 pl-5" />
            <Separator />
            <CommandPaletteList className="min-h-0 flex-auto px-2 pt-1.5 pb-2">
              <CommandEmpty>Nothing matches</CommandEmpty>
              {groups.map((first) => (
                <CommandPaletteGroup key={`${first.detail}/${first.group}`} heading={first.group}>
                  {items
                    .filter((item) => item.group === first.group && item.detail === first.detail)
                    .map((item) => (
                      <CommandPaletteItem
                        key={item.id}
                        value={`${item.detail ?? ""} ${item.group} ${item.label}`}
                        onSelect={() => {
                          setOpen(false);
                          onSelect(item.id);
                        }}
                      >
                        <span className="min-w-0 flex-1">
                          <OverflowFadeText>{item.label}</OverflowFadeText>
                        </span>
                        {item.detail ? (
                          <Text bare tone="muted" className="flex-none text-caption">
                            {item.detail}
                          </Text>
                        ) : null}
                      </CommandPaletteItem>
                    ))}
                </CommandPaletteGroup>
              ))}
            </CommandPaletteList>
          </CommandPalette>
        </DialogContent>
      </Dialog>
    </>
  );
}
