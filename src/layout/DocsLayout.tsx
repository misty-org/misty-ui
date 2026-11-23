import { ArrowLeft, ArrowRight, Search, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";
import { Kbd } from "../display/Kbd";
import { CommandEmpty } from "../overlays/Command";
import { Dialog, DialogContent, DialogTitle } from "../overlays/Dialog";
import { DropdownMenu, DropdownMenuContent } from "../overlays/DropdownMenu";
import { MenuTrigger } from "../overlays/MenuTrigger";
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
 * A documentation site's page in three panels, as Vercel's docs are: the section's navigation on
 * the left, the article in the middle and "On this page" on the right, under a header that stays
 * put. The two side panels stay in view while the article scrolls; under 52rem the navigation goes
 * (the header's own menu takes over) and under 62rem the contents do. `header` is a
 * `DocsHeader`, `nav` the rows of the open section, `toc` a `DocsToc`, and the article's own
 * footer (a `DocsPager`) goes last in `children`. The page is `--docs-max` wide (90rem) with
 * `--docs-gutter` at its sides (none), so a site sets them to match its own pages. Everything that stays in view sits below
 * `--docs-bar` too (the header's height by default, 0 where the site's own bar replaces it), and below
 * `--docs-top` (0 by default), so a site with its own bar above (a navbar) sets it to that bar's
 * height. Only for a docs site; the app's pages use
 * their own layouts.
 *
 * ```tsx
 * <DocsLayout header={<DocsHeader … />} nav={<NavList>…</NavList>} toc={<DocsToc … />}>
 *   <article>…</article>
 *   <DocsPager previous={…} next={…} />
 * </DocsLayout>
 * ```
 */
export function DocsLayout({
  header,
  nav,
  toc,
  children,
}: {
  header?: ReactNode;
  nav?: ReactNode;
  toc?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div data-slot="docs-layout">
      {header}
      <div
        className={cn(
          "mx-auto grid max-w-(--docs-max,90rem) px-(--docs-gutter,0px) min-[52rem]:grid-cols-[--spacing(64)_minmax(0,1fr)]",
          toc && "min-[62rem]:grid-cols-[--spacing(64)_minmax(0,1fr)_--spacing(52)]",
        )}
      >
        <aside
          aria-label="Section"
          className="sticky top-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header)))] hidden h-[calc(100vh-var(--docs-top,0px)-var(--docs-bar,var(--ui-header)))] content-start gap-5 overflow-y-auto pt-4 pr-4 pb-6 min-[52rem]:grid"
        >
          {nav}
        </aside>
        <main className="flex min-w-0 flex-col px-8 pt-4">{children}</main>
        {toc ? <div className="hidden min-[62rem]:block">{toc}</div> : null}
      </div>
    </div>
  );
}

export interface DocsHeaderSection {
  id: string;
  label: string;
}

/**
 * The docs site's top band: its name, a slash, and the name of the docs you are in as a menu that
 * switches between them (Guides, SDK, Design system…), with the open one checked; `children`
 * (search, theme, links) sit at the end. It stays at the top while the page scrolls, on the page's
 * own color with a hairline under it. `title` names the docs when none is open, such as on the
 * front page.
 */
export function DocsHeader({
  brand,
  sections,
  current,
  onSelect,
  title = "Browse",
  children,
}: {
  brand: ReactNode;
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
      className="sticky top-(--docs-top,0px) z-(--stack-sticky) flex h-(--ui-header) items-center gap-3 border-b border-charcoal-border px-6"
    >
      <div className="flex shrink-0 items-center">{brand}</div>
      <DocsSwitcher sections={sections} current={current} onSelect={onSelect} title={title} />
      <div className="ml-auto flex shrink-0 items-center gap-2">{children}</div>
    </Surface>
  );
}

/**
 * A slash and the name of the docs you are in as a menu that switches between them, with the open
 * one checked. `DocsHeader` holds it; a site whose own bar carries the docs' controls (a navbar)
 * puts it there instead.
 */
export function DocsSwitcher({
  sections,
  current,
  onSelect,
  title = "Browse",
  slash = true,
}: {
  sections: DocsHeaderSection[];
  current: string | undefined;
  onSelect: (id: string) => void;
  title?: string;
  /** The slash before it, which follows a name in a bar; leave it off where the menu stands first. */
  slash?: boolean;
}) {
  const open = sections.find((section) => section.id === current);
  return (
    <>
      {slash ? (
        <Text size="control" tone="muted">
          /
        </Text>
      ) : null}
      <DropdownMenu>
        <MenuTrigger label="Choose the docs" value={open?.label ?? title} heading className="-ml-2" />
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
 * The top of a docs page: an eyebrow (its section), the title large and tightly set, and the
 * lead under it. Docs only: its sizes are the docs' own, bigger than the app's `display` role.
 */
export function DocsTitle({ title, eyebrow, lead }: { title: string; eyebrow?: string; lead?: string }) {
  return (
    <header className="grid gap-3">
      {eyebrow ? (
        <Text size="meta" weight="medium" tone="muted">
          {eyebrow}
        </Text>
      ) : null}
      <h1 className="m-0 text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-cream-bright">
        {title}
      </h1>
      {lead ? (
        <Text size="page" tone="muted" wrap className="max-w-2xl text-[1rem] leading-7">
          {lead}
        </Text>
      ) : null}
    </header>
  );
}

/**
 * A docs site's front page opening: a very large title, the lead, its buttons (`actions`), and
 * a panel beside it on wide screens (`aside`, usually a `CodeBlock` with a `header`). Docs only.
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
    <section className="grid items-start gap-10 pb-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,--spacing(104))]">
      <div className="grid gap-6">
        <h1 className="m-0 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.05em] text-cream-bright">
          {title}
        </h1>
        <Text size="page" tone="muted" wrap className="max-w-xl text-[1.125rem] leading-7">
          {lead}
        </Text>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {aside ? <div className="min-w-0 xl:pt-4">{aside}</div> : null}
    </section>
  );
}

/**
 * One card on a docs page that links somewhere: its icon over a title and a line, on a hairline
 * edge that washes under the pointer. Put them in a grid, two to a row.
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
      className="grid content-start gap-3 p-6 text-left"
    >
      {Icon ? <Icon className="text-cream" /> : null}
      <Text size="title" weight="semibold" tone="bright">
        {title}
      </Text>
      <Text size="control" tone="muted" wrap>
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
  if (items.length < 2) return null;
  return (
    <nav
      aria-label={label}
      className="sticky top-[calc(var(--docs-top,0px)+var(--docs-bar,var(--ui-header)))] grid max-h-[calc(100vh-var(--docs-top,0px)-var(--docs-bar,var(--ui-header)))] content-start gap-4 overflow-y-auto pt-4 pl-4"
    >
      <Text size="meta" weight="medium" tone="bright">
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
              "-ml-px border-l py-2 pl-4 text-left",
              active === item.id ? "border-cream-bright" : "border-transparent",
            )}
          >
            <Text size="meta" tone={active === item.id ? "bright" : "muted"} wrap>
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

/**
 * The links to the pages either side of this one, along the article's bottom edge: they stay on
 * screen as the page scrolls, over a fade of the page's own color, so the next page is always one
 * press away. Put it last in the `DocsLayout`'s children.
 */
export function DocsPager({ previous, next }: { previous?: DocsPagerLink; next?: DocsPagerLink }) {
  if (!previous && !next) return null;
  return (
    <nav
      aria-label="Pages"
      className={cn(
        "sticky bottom-0 mt-16 flex gap-4 bg-(--misty-theme-bg) py-4",
        "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-8",
        "before:bg-linear-to-t before:from-(--misty-theme-bg) before:to-transparent",
      )}
    >
      {previous ? (
        <Pressable wash="text" onClick={previous.onSelect} className="flex min-w-0 max-w-[48%] items-end gap-2 text-left">
          <ArrowLeft className="mb-1 text-cream-muted" />
          <span className="grid min-w-0">
            <Text size="caption" tone="muted">
              Previous
            </Text>
            <Text size="control" tone="bright">
              {previous.group ? `${previous.group} / ` : ""}
              {previous.label}
            </Text>
          </span>
        </Pressable>
      ) : null}
      {next ? (
        <Pressable wash="text" onClick={next.onSelect} className="ml-auto flex min-w-0 max-w-[48%] flex-row-reverse items-end gap-2 text-right">
          <ArrowRight className="mb-1 text-cream-muted" />
          <span className="grid min-w-0">
            <Text size="caption" tone="muted">
              Next
            </Text>
            <Text size="control" tone="bright">
              {next.group ? `${next.group} / ` : ""}
              {next.label}
            </Text>
          </span>
        </Pressable>
      ) : null}
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
        className="flex h-10 w-full items-center gap-2 rounded-lg border border-charcoal-border px-3 text-left"
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
