import { X } from "lucide-react";
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import {
  createDwell,
  reorderIds,
  usePointerDropTarget,
  usePointerReorder,
} from "../hooks/use_pointer_reorder";
import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { Pressable } from "../controls/Pressable";
import { Text } from "../display/Text";
import { SidewaysScroll } from "../layout/SidewaysScroll";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../overlays/ContextMenu";
import { tabGroupTone, type TabStripGroup } from "./TabGroup";

export interface TabStripTab {
  id: string;
  label: string;
  /** An 18px mark before the label: a file's icon, a site's, a spinner while it loads. */
  icon?: ReactNode;
  /** The whole name, shown in a tooltip when the label is cut. Defaults to the label. */
  full?: string;
  /** The closer's name and tooltip, e.g. "Close notes.md". Without it the tab can't be closed. */
  closeLabel?: string;
  /** The tab's actions as menu rows, on a right-click. */
  menu?: ReactNode;
  /** The id of the group in `groups` the tab belongs to. A group's tabs sit next to each other. */
  group?: string;
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
   * The window's own tab row ends 13.5px in, like the sidebar's rows at the window's other side, so
   * the window has one margin on both edges and the end button lines up with the chat's panel
   * rail under it. A page's tab row keeps the page header's 18px.
   */
  windowEdge?: boolean;
  /**
   * What a dragged tab is to drop targets beyond the row, by scope (the window's tab carries its
   * page's view to the panes as `workspace-tabs`), so it can be dropped into a split.
   */
  dragCarries?(id: string): Record<string, string> | undefined;
  /**
   * A drag paused over a tab for a moment, while still held: the window opens that tab, so the
   * dragged page can be dropped into its panes. A tab makes room only once the dragged tab's pointer
   * has crossed all of it, so it stays under the pointer while the drag rests on it. Drags from
   * outside the row (a sidebar chat) that carry `workspace-tab-switch` pause the same way.
   */
  onDragDwell?(id: string): void;
  /**
   * Groups of tabs, as Chrome draws them: a chip in the group's color before its tabs (its name,
   * or a dot when unnamed), and a line of that color under them. Pressing a chip folds its tabs
   * away or brings them back (`onToggleGroup`); a right-click opens the group's `menu`.
   */
  groups?: ReadonlyArray<TabStripGroup>;
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
  "group/tab @container/tab relative flex h-8 w-36 min-w-24 flex-initial items-center",
  "rounded-md hover:bg-row-hover data-[selected]:bg-row-active",
);

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
  | { kind: "tab"; tab: TabStripTab; group?: TabStripGroup };

function GroupLine(props: { group: TabStripGroup; first: boolean; last: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -bottom-1 left-0 h-0.5",
        props.first && "rounded-l-full",
        props.last && "rounded-r-full",
      )}
      style={{
        backgroundColor: tabGroupTone(props.group.color),
        right: props.last ? 0 : "calc(var(--spacing) * -1)",
      }}
    />
  );
}

/**
 * A row of tabs over a pane: 36px tabs with an icon and a label that fades when long, a closer
 * that shows on hover and on the open tab, arrows and Home/End to move between them, a middle
 * click or the closer to close, dragging (or Alt+Shift and an arrow) to reorder, and the tab's
 * menu on a right-click. Tabs may sit in Chrome's tab groups (`groups`): a colored chip before
 * them that folds them away, a line of its color under them, a tab dropped on another tab or on a
 * chip going into that group, and a group dragged by its chip. Tabs share one width and shrink
 * together when they don't fit, never wrapping; once they reach their least width the tabs and
 * `after` scroll sideways (a wheel or a swipe, with no scrollbar), the open tab kept in view.
 * `after` holds a control right after the last tab, and `end` controls at the far end that never
 * scroll away.
 *
 * ```tsx
 * <TabStrip label="Terminals" tabs={tabs} active={activeId} onSelect={select} onClose={close}
 *   end={<IconButton label="New terminal" onClick={add}><Plus /></IconButton>} />
 * ```
 */
export function TabStrip(props: TabStripProps) {
  const list = useRef<HTMLDivElement | null>(null);
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
    if (!group?.collapsed) entries.push({ kind: "tab", tab, group });
  }
  const shown = entries.map((entry) =>
    entry.kind === "group" ? chipId(entry.group.id) : entry.tab.id,
  );
  const visible = props.tabs.filter((tab) => !groupOf(tab)?.collapsed);
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
      if (!isChip(id) && id !== props.active) props.onDragDwell?.(id);
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
        className="relative flex h-8 flex-none items-center"
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

  const tabView = (tab: TabStripTab, group: TabStripGroup | undefined, index: number) => {
    const selected = tab.id === props.active;
    const closable = Boolean(tab.closeLabel && props.onClose);
    const next = entries[index + 1];
    const last = !(next?.kind === "tab" && next.group?.id === group?.id);
    const body = (
      <div
        data-selected={selected || undefined}
        data-reorder-item={tab.id}
        data-reorder-handle={props.onReorder ? "" : undefined}
        data-reorder-preview=""
        className={tabClass}
        onAuxClick={(event) => {
          if (event.button === 1 && closable) props.onClose?.(tab.id);
        }}
      >
        <Pressable
          role="tab"
          aria-selected={selected}
          tabIndex={selected ? 0 : -1}
          data-tab-id={tab.id}
          className="flex h-full min-w-0 flex-1 items-center gap-2 pl-2 pr-1"
          onClick={() => props.onSelect(tab.id)}
          onKeyDown={(event) => onKeyDown(event, tab.id)}
        >
          {tab.icon ? <span className="flex size-4 flex-none items-center">{tab.icon}</span> : null}
          <Text
            size="control"
            tone={selected ? "bright" : "muted"}
            className="min-w-0 flex-1 text-left"
            full={tab.full ?? true}
          >
            {tab.label}
          </Text>
        </Pressable>
        {closable ? (
          <span className="flex flex-none @max-[5.5rem]/tab:hidden">
            <IconButton
              label={tab.closeLabel!}
              size="sm"
              className="mr-1"
              data-reorder-ignore=""
              onClick={() => props.onClose?.(tab.id)}
            >
              <X />
            </IconButton>
          </span>
        ) : null}
        {group ? <GroupLine group={group} first={false} last={last} /> : null}
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
        "flex h-(--ui-header) flex-none items-center gap-1 border-b pl-3",
        props.windowEdge ? "pr-3" : "pr-4",
      )}
    >
      <SidewaysScroll className="flex-[0_1_auto] gap-1 self-stretch">
        <div
          {...reorder}
          ref={(element) => {
            list.current = element;
            reorder.ref(element);
          }}
          role="tablist"
          aria-label={props.label}
          className="flex min-w-0 flex-[0_1_auto] items-center gap-1"
          style={{
            minWidth: `calc(${visible.length} * var(--spacing) * 24 + ${Math.max(0, visible.length - 1)} * var(--spacing))`,
          }}
        >
          {entries.map((entry, index) =>
            entry.kind === "group"
              ? chip(entry.group, index)
              : tabView(entry.tab, entry.group, index),
          )}
        </div>
        {props.after ? <div className="flex flex-none items-center">{props.after}</div> : null}
      </SidewaysScroll>
      {props.end ? (
        <div className="ml-auto flex flex-none items-center gap-1">{props.end}</div>
      ) : null}
    </div>
  );
}
