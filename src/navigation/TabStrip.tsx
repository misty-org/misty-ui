import { Search, Volume2, VolumeX, X } from "lucide-react";
import {
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  createDwell,
  reorderIds,
  usePointerDropTarget,
  usePointerReorder,
} from "../hooks/use_pointer_reorder";
import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { Pressable } from "../controls/Pressable";
import { RowTools } from "../controls/RowTools";
import { Text } from "../display/Text";
import { SidewaysScroll } from "../layout/SidewaysScroll";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../overlays/Command";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../overlays/ContextMenu";
import { MenuTrigger } from "../overlays/MenuTrigger";
import { Popover, PopoverContent } from "../overlays/Popover";
import { Tooltip } from "../overlays/Tooltip";
import { tabGroupTone, type TabStripGroup } from "./TabGroup";

export interface TabStripTab {
  id: string;
  label: string;
  /**
   * What the tab shows, as its own icon: the one its row in the sidebar wears, in the glyph's
   * 18px box. A place's glyph (`spaceIcons`), a channel's #, a person's face or an agent's face at
   * the Avatar's `glyph` size (no presence dot), an app's `AppLogoImage` at `glyph`, a file's icon.
   * Never a stand-in for a page it can't name, and never a state: leave it off instead. A glyph
   * takes the tab's own tone, muted, bright while the tab is open.
   */
  icon?: ReactNode;
  /** The whole name, shown in a tooltip when the label is cut. Defaults to the label. */
  full?: string;
  /** The closer's name and tooltip, e.g. "Close notes.md". Without it the tab can't be closed. */
  closeLabel?: string;
  /** The tab's actions as menu rows, on a right-click. */
  menu?: ReactNode;
  /** The id of the group in `groups` the tab belongs to. A group's tabs sit next to each other. */
  group?: string;
  /**
   * The tab's page is playing sound, as Chrome marks it: a speaker after the name, crossed out
   * while `muted`, that mutes or unmutes the page. Leave it off while the page is silent.
   */
  sound?: TabStripSound;
}

/** A tab's sound mark: whether its page is muted, and the press that mutes or unmutes it. */
export interface TabStripSound {
  muted: boolean;
  onToggle(): void;
}

export interface TabStripProps {
  /** The tab list's accessible name, e.g. "Open files". */
  label: string;
  tabs: ReadonlyArray<TabStripTab>;
  active: string | null;
  onSelect(id: string): void;
  /** Closes a tab, from its closer or a middle click. Only tabs with a `closeLabel` close. */
  onClose?(id: string): void;
  /**
   * Moves a dragged tab to `index`; without it tabs don't drag. With `groups`, `group` is the
   * group the tab lands in: one it was let go inside of, or null when it was let go outside any.
   */
  onReorder?(id: string, index: number, group?: string | null): void;
  /** A control right after the last tab that scrolls with them, such as a New tab button. */
  after?: ReactNode;
  /** Controls at the row's far end that never scroll away. */
  end?: ReactNode;
  /**
   * The window's own tab row, standing on the window's color over the inset panel: no hairline
   * under it, and its ends set in by the panel's own margin (`--pane-seam-left`/`-right`), so the
   * first tab's edge lines up with the panel's edge under it. A page's tab row keeps its hairline
   * and the page header's gutters.
   */
  windowEdge?: boolean;
  /**
   * What a dragged tab is to drop targets beyond the row, by scope (the window's tab carries its
   * page's view to the panes as `workspace-tabs`), so it can be dropped into a split.
   */
  dragCarries?(id: string): Record<string, string> | undefined;
  /**
   * A drag paused over a tab for a moment, while still held: the window opens that tab, so the
   * dragged page can be dropped into its panes. A tab makes room only once the dragged tab's
   * pointer has crossed all of it, so it stays under the pointer while the drag rests on it,
   * washed while it is the one the drag is over. Drags from
   * outside the row (a sidebar chat) that carry `workspace-tab-switch` pause the same way.
   */
  onDragDwell?(id: string): void;
  /**
   * Groups of tabs, as Chrome draws them: a chip in the group's color before its tabs (its name,
   * or a dot when unnamed), a faint line of that color under them, and a faint ring of it around the
   * open tab. Pressing a chip folds its tabs away or brings them back (`onToggleGroup`), sliding
   * them shut or open; a new tab slides in; a right-click opens the group's `menu`.
   */
  groups?: ReadonlyArray<TabStripGroup>;
  /** Folds or unfolds a group: from its chip, or when a dragged tab pauses over a folded chip. */
  onToggleGroup?(id: string): void;
  /** A dragged tab let go on another tab: in Chrome's way, the two go into one group. */
  onDropOnTab?(id: string, target: string): void;
  /** A dragged tab let go on a group's chip: it joins that group. */
  onDropOnGroup?(id: string, group: string): void;
  /**
   * A group dragged by its chip and let go: its tabs move, together, to just before `before`, or to
   * the end when it is null. Without it groups don't drag.
   */
  onMoveGroup?(group: string, before: string | null): void;
}

/** The scope a drag from outside a tab row carries to open tabs it pauses over. */
export const tabSwitchScope = "workspace-tab-switch";

const chipPrefix = "tab-group:";
const chipId = (group: string) => `${chipPrefix}${group}`;
const isChip = (id: string | undefined): boolean => Boolean(id?.startsWith(chipPrefix));
const chipGroup = (id: string) => id.slice(chipPrefix.length);

const tabClass = cn(
  "group/tab @container/tab relative flex h-8 w-52 flex-initial snap-start items-center",
  "rounded-md hover:bg-row-hover data-[selected]:bg-row-active",
  "data-[reorder-target]:bg-control-active data-[reorder-target]:ring-1 data-[reorder-target]:ring-inset data-[reorder-target]:ring-cream-muted",
  "transition-[width,min-width,margin,opacity] duration-200 ease-out",
  "motion-reduce:transition-none [html[data-pointer-dragging=true]_&]:transition-none",
  "data-[folded]:-ml-1 data-[folded]:w-0 data-[folded]:min-w-0 data-[folded]:opacity-0",
  "data-[entering]:starting:-ml-1 data-[entering]:starting:w-0",
  "data-[entering]:starting:min-w-0 data-[entering]:starting:opacity-0",
);

/**
 * How narrow a tab may get, in spacing steps: down to its icon alone (40.5px) for a tab that has
 * one and isn't open, while the open tab and a tab with no icon keep room for their name.
 */
const tabFloor = (tab: TabStripTab, selected: boolean) => (tab.icon && !selected ? 9 : 24);

/**
 * Every open tab in one searchable list, from a button at the row's end while the tabs don't all
 * fit, as Chrome's tab search: each tab with its own icon, the open one checked, its closer on
 * hover.
 */
function TabSearch(props: {
  label: string;
  tabs: ReadonlyArray<TabStripTab>;
  active: string | null;
  onSelect(id: string): void;
  onClose?(id: string): void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <MenuTrigger kind="popover" iconOnly label="Search tabs" icon={Search} />
      <PopoverContent align="end" kind="flush">
        <Command label={props.label}>
          <CommandInput placeholder="Search tabs" aria-label="Search tabs" />
          <CommandList>
            <CommandEmpty>No tabs match</CommandEmpty>
            <CommandGroup>
              {props.tabs.map((tab) => (
                <CommandItem
                  key={tab.id}
                  value={tab.id}
                  keywords={[tab.full ?? tab.label]}
                  icon={isValidElement(tab.icon) ? tab.icon : undefined}
                  label={tab.full ?? tab.label}
                  checked={tab.id === props.active}
                  className="group/row"
                  end={
                    tab.closeLabel && props.onClose ? (
                      <RowTools reveal="hover">
                        <IconButton
                          label={tab.closeLabel}
                          size="sm"
                          onClick={() => props.onClose?.(tab.id)}
                        >
                          <X />
                        </IconButton>
                      </RowTools>
                    ) : undefined
                  }
                  onSelect={() => {
                    setOpen(false);
                    props.onSelect(tab.id);
                  }}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** The tab a key moves to from `index`, or -1 for a key the strip leaves alone. */
function nextTabIndex(key: string, index: number, count: number): number {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index + count - 1) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
}

type Entry =
  | { kind: "group"; group: TabStripGroup }
  | { kind: "tab"; tab: TabStripTab; group?: TabStripGroup; folded?: boolean };

const groupEdge = (group: TabStripGroup) =>
  `color-mix(in srgb, ${tabGroupTone(group.color)} 45%, transparent)`;

function GroupRing(props: { group: TabStripGroup }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      shapeRendering="geometricPrecision"
    >
      <rect
        width="100%"
        height="100%"
        rx="8"
        fill="none"
        strokeWidth="1"
        style={{ stroke: groupEdge(props.group) }}
      />
    </svg>
  );
}

function GroupLine(props: { group: TabStripGroup; first: boolean; last: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-0",
        props.first && "rounded-l-full",
        props.last && "rounded-r-full",
      )}
      style={{
        backgroundColor: groupEdge(props.group),
        height: "1px",
        bottom: "calc((var(--hairline) + var(--spacing) * 8 - var(--ui-header)) / 2)",
        right: props.last ? 0 : "calc(var(--spacing) * -1)",
      }}
    />
  );
}

/**
 * A row of tabs over a pane: 36px tabs with an icon and a label that fades when long, a closer
 * that shows on hover and on the open tab, arrows and Home/End to move between them, a middle
 * click or the closer to close, a speaker on a tab whose page plays sound (`sound`) that mutes
 * it, dragging (or Alt+Shift and an arrow) to reorder, and the tab's
 * menu on a right-click. Tabs may sit in Chrome's tab groups (`groups`): a colored chip before
 * them that folds them away, a line of its color under them, a tab dropped on another tab or on a
 * chip going into that group, and a group dragged by its chip. A dragged tab slides: the others
 * part as the pointer crosses their middle, leaving an outlined slot where it will land; only a
 * pause on a tab's near half joins that tab, which then takes a ring while the dragged tab shrinks
 * toward it, and moving on lets go of it again. Tabs share one width, as wide as
 * Chrome's while there's room, and shrink together once more tabs don't fit, never wrapping: the
 * closer goes first, then the name, down to the tab's icon alone, while the open tab and a tab with
 * no icon keep room for their name. Every tab names itself in a tooltip. Past that, the tabs and
 * `after` scroll sideways (a wheel or a swipe, with no scrollbar), resting on a tab's edge, the
 * open tab kept in view and the row's edge fading where tabs carry on past it; a Search tabs
 * button then shows at the row's end, listing every tab to pick or close. `after` holds a control
 * right after the last tab, and `end` controls at the far end that never scroll away.
 *
 * ```tsx
 * <TabStrip label="Terminals" tabs={tabs} active={activeId} onSelect={select} onClose={close}
 *   end={<IconButton label="New terminal" onClick={add}><Plus /></IconButton>} />
 * ```
 */
export function TabStrip(props: TabStripProps) {
  const list = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const ids = props.tabs.map((tab) => tab.id);
  const groupsById = new Map((props.groups ?? []).map((group) => [group.id, group]));
  const groupOf = (tab: TabStripTab | undefined) =>
    tab?.group ? groupsById.get(tab.group) : undefined;

  const entries: Entry[] = [];
  let open: string | undefined;
  for (const tab of props.tabs) {
    const group = groupOf(tab);
    if (group && group.id !== open) entries.push({ kind: "group", group });
    open = group?.id;
    entries.push({ kind: "tab", tab, group, folded: group?.collapsed });
  }
  const shown = entries.flatMap((entry) =>
    entry.kind === "group" ? [chipId(entry.group.id)] : entry.folded ? [] : [entry.tab.id],
  );
  const [present] = useState(() => new Set(ids));
  const visible = props.tabs.filter((tab) => !groupOf(tab)?.collapsed);
  const floors = visible.reduce((sum, tab) => sum + tabFloor(tab, tab.id === props.active), 0);
  const tabsOf = (group: string) => props.tabs.filter((tab) => tab.group === group);
  const shownTabsOf = (group: string) =>
    groupsById.get(group)?.collapsed ? [] : tabsOf(group).map((tab) => tab.id);
  const expand = (order: string[]) =>
    order.flatMap((id) =>
      isChip(id) && groupsById.get(chipGroup(id))?.collapsed
        ? [id, ...tabsOf(chipGroup(id)).map((tab) => tab.id)]
        : [id],
    );
  const groupAt = (id: string | undefined) => {
    if (!id) return undefined;
    if (isChip(id)) return chipGroup(id);
    return groupOf(props.tabs.find((tab) => tab.id === id))?.id;
  };

  const dropTab = (id: string, target: string, after: boolean) => {
    const order = reorderIds(shown, [id], target, after);
    const tabOrder = expand(order).filter((item) => !isChip(item));
    const at = order.indexOf(id);
    const previous = order[at - 1];
    const next = order[at + 1];
    const group =
      previous && isChip(previous)
        ? groupsById.get(chipGroup(previous))?.collapsed
          ? null
          : chipGroup(previous)
        : !isChip(next) && groupAt(previous) && groupAt(previous) === groupAt(next)
          ? groupAt(previous)!
          : null;
    props.onReorder?.(id, tabOrder.indexOf(id), props.groups ? group : undefined);
  };

  const dropGroup = (chip: string, target: string, after: boolean) => {
    const group = chipGroup(chip);
    const block = [chip, ...shownTabsOf(group)];
    const order = reorderIds(shown, block, target, after);
    const start = order.indexOf(chip);
    let at = start + block.length;
    const outside = groupAt(order[start - 1]);
    if (outside && !isChip(order[at]) && groupAt(order[at]) === outside)
      while (at < order.length && groupAt(order[at]) === outside) at++;
    const next = order[at];
    const before = next && isChip(next) ? tabsOf(chipGroup(next))[0]?.id : next;
    props.onMoveGroup?.(group, before ?? null);
  };

  const reorder = usePointerReorder({
    scope: useId(),
    axis: "x",
    animate: true,
    getDrag: (id) => {
      if (isChip(id)) {
        const group = groupsById.get(chipGroup(id));
        return props.onMoveGroup && group
          ? { id, label: group.label || "Group", ids: [id, ...shownTabsOf(group.id)] }
          : null;
      }
      const tab = props.tabs.find((candidate) => candidate.id === id);
      return props.onReorder && tab
        ? { id, label: tab.label, carries: props.dragCarries?.(id) }
        : null;
    },
    onDwell: (id) => {
      if (isChip(id)) {
        if (groupsById.get(chipGroup(id))?.collapsed) props.onToggleGroup?.(chipGroup(id));
        return;
      }
      if (id !== props.active) props.onDragDwell?.(id);
    },
    onDrop: (drag, target, after, onto) => {
      if (isChip(drag.id)) {
        if (!onto) dropGroup(drag.id, target, after);
        return;
      }
      if (onto && isChip(target)) return props.onDropOnGroup?.(drag.id, chipGroup(target));
      if (onto) return props.onDropOnTab?.(drag.id, target);
      dropTab(drag.id, target, after);
    },
    onKeyboardMove: (id, direction) => {
      if (isChip(id)) return;
      const target = ids[ids.indexOf(id) + direction];
      if (target) props.onReorder?.(id, reorderIds(ids, [id], target, direction === 1).indexOf(id));
    },
  });

  const dwell = useRef(createDwell());
  usePointerDropTarget(list, {
    scope: tabSwitchScope,
    hit(x, y) {
      const over = [
        ...(list.current?.querySelectorAll<HTMLElement>("[data-reorder-item]") ?? []),
      ].find((item) => {
        const rect = item.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      })?.dataset.reorderItem;
      dwell.current(over && !isChip(over) && over !== props.active ? over : null, (id) =>
        props.onDragDwell?.(id),
      );
      return null;
    },
    drop() {},
  });

  useEffect(() => {
    if (!props.active) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(props.active)}"]`)
      ?.closest<HTMLElement>("[data-reorder-item]")
      ?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [props.active, props.tabs.length]);

  const focusTab = (id: string) =>
    requestAnimationFrame(() =>
      list.current?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(id)}"]`)?.focus(),
    );
  const onKeyDown = (event: KeyboardEvent, id: string) => {
    const next = nextTabIndex(
      event.key,
      visible.findIndex((tab) => tab.id === id),
      visible.length,
    );
    if (event.altKey || event.ctrlKey || event.metaKey || next < 0) return;
    event.preventDefault();
    const tab = visible[next]!;
    props.onSelect(tab.id);
    focusTab(tab.id);
  };

  const chip = (group: TabStripGroup, index: number) => {
    const last = entries[index + 1]?.kind !== "tab";
    const name = group.label || "Unnamed group";
    const body = (
      <div
        data-reorder-item={chipId(group.id)}
        data-reorder-handle={props.onMoveGroup ? "" : undefined}
        data-reorder-preview=""
        className={cn(
          "relative flex h-8 flex-none snap-start items-center rounded-md px-1",
          "data-[reorder-target]:bg-control-active",
        )}
      >
        <Pressable
          aria-expanded={!group.collapsed}
          aria-label={group.collapsed ? `${name}, folded` : name}
          className={cn(
            "flex flex-none items-center justify-center",
            group.label ? "h-6 max-w-36 rounded-md px-2" : "size-3 rounded-full",
          )}
          style={{ backgroundColor: tabGroupTone(group.color), color: "var(--tone-group-ink)" }}
          onClick={() => props.onToggleGroup?.(group.id)}
        >
          {group.label ? (
            <Text size="caption" weight="semibold" className="min-w-0">
              {group.label}
            </Text>
          ) : null}
        </Pressable>
        {group.collapsed ? null : <GroupLine group={group} first last={last} />}
      </div>
    );
    return group.menu ? (
      <ContextMenu key={chipId(group.id)}>
        <ContextMenuTrigger asChild>{body}</ContextMenuTrigger>
        <ContextMenuContent width="sm" aria-label={`${name} actions`}>
          {group.menu}
        </ContextMenuContent>
      </ContextMenu>
    ) : (
      <div key={chipId(group.id)} className="contents">
        {body}
      </div>
    );
  };

  const tabView = (
    tab: TabStripTab,
    group: TabStripGroup | undefined,
    index: number,
    folded = false,
  ) => {
    const selected = tab.id === props.active;
    const closable = Boolean(tab.closeLabel && props.onClose);
    const next = entries[index + 1];
    const last = !(next?.kind === "tab" && next.group?.id === group?.id);
    const body = (
      <div
        data-selected={selected || undefined}
        data-folded={folded || undefined}
        data-entering={!present.has(tab.id) || undefined}
        data-reorder-item={folded ? undefined : tab.id}
        data-reorder-handle={props.onReorder && !folded ? "" : undefined}
        data-reorder-preview=""
        aria-hidden={folded || undefined}
        inert={folded || undefined}
        className={cn(tabClass, tabFloor(tab, selected) === 9 ? "min-w-9" : "min-w-24")}
        onAuxClick={(event) => {
          if (event.button === 1 && closable) props.onClose?.(tab.id);
        }}
      >
        <div className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden rounded-md">
          <Tooltip content={tab.full ?? tab.label} side="bottom">
            <Pressable
              role="tab"
              aria-selected={selected}
              aria-label={tab.full ?? tab.label}
              tabIndex={selected ? 0 : -1}
              data-tab-id={tab.id}
              className={cn(
                "flex h-full min-w-0 flex-1 items-center gap-2 pl-2 pr-1",
                tab.icon && "@max-[4.5rem]/tab:justify-center @max-[4.5rem]/tab:px-0",
              )}
              onClick={() => props.onSelect(tab.id)}
              onKeyDown={(event) => onKeyDown(event, tab.id)}
            >
              {tab.icon ? (
                <Text
                  bare
                  aria-hidden="true"
                  tone={selected ? "bright" : "muted"}
                  className="grid size-4 flex-none place-items-center"
                >
                  {tab.icon}
                </Text>
              ) : null}
              <Text
                size="control"
                tone={selected ? "bright" : "muted"}
                className={cn("min-w-0 flex-1 text-left", tab.icon && "@max-[4.5rem]/tab:hidden")}
              >
                {tab.label}
              </Text>
            </Pressable>
          </Tooltip>
          {tab.sound ? (
            <span className="flex flex-none @max-[4rem]/tab:hidden">
              <IconButton
                label={tab.sound.muted ? "Unmute tab" : "Mute tab"}
                tooltipSide="right"
                size="sm"
                data-reorder-ignore=""
                onClick={tab.sound.onToggle}
              >
                {tab.sound.muted ? <VolumeX /> : <Volume2 />}
              </IconButton>
            </span>
          ) : null}
          {closable ? (
            <span className="flex flex-none @max-[5.5rem]/tab:hidden">
              <IconButton
                label={tab.closeLabel!}
                tooltipSide="right"
                size="sm"
                className="mr-1"
                data-reorder-ignore=""
                onClick={() => props.onClose?.(tab.id)}
              >
                <X />
              </IconButton>
            </span>
          ) : null}
        </div>
        {group && !folded ? <GroupLine group={group} first={false} last={last} /> : null}
        {group && selected && !folded ? <GroupRing group={group} /> : null}
      </div>
    );
    return tab.menu ? (
      <ContextMenu key={tab.id}>
        <ContextMenuTrigger asChild>{body}</ContextMenuTrigger>
        <ContextMenuContent width="sm" aria-label={`${tab.label} actions`}>
          {tab.menu}
        </ContextMenuContent>
      </ContextMenu>
    ) : (
      <div key={tab.id} className="contents">
        {body}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex h-(--ui-header) flex-none items-center gap-1",
        props.windowEdge
          ? "pr-[var(--pane-seam-right,0px)] pl-[var(--pane-seam-left,0px)]"
          : "border-b pr-4 pl-3",
      )}
    >
      <SidewaysScroll
        fade
        onOverflowChange={setOverflowing}
        className={cn(
          "flex-[0_1_auto] snap-x snap-mandatory scroll-px-4 gap-1 self-stretch",
          "[html[data-pointer-dragging=true]_&]:snap-none",
        )}
      >
        <div
          {...reorder}
          ref={(element) => {
            list.current = element;
            reorder.ref(element);
          }}
          role="tablist"
          aria-label={props.label}
          className={cn(
            "flex min-w-0 flex-[0_1_auto] items-center gap-1",
            !props.after && "snap-end",
          )}
          style={{
            minWidth: `calc(${floors} * var(--spacing) + ${Math.max(0, visible.length - 1)} * var(--spacing))`,
          }}
        >
          {entries.map((entry, index) =>
            entry.kind === "group"
              ? chip(entry.group, index)
              : tabView(entry.tab, entry.group, index, entry.folded),
          )}
        </div>
        {props.after ? (
          <div className="flex flex-none snap-end items-center">{props.after}</div>
        ) : null}
      </SidewaysScroll>
      {overflowing || props.end ? (
        <div className="ml-auto flex flex-none items-center gap-1">
          {overflowing ? (
            <TabSearch
              label={props.label}
              tabs={props.tabs}
              active={props.active}
              onSelect={props.onSelect}
              onClose={props.onClose}
            />
          ) : null}
          {props.end}
        </div>
      ) : null}
    </div>
  );
}
