import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../classNames";
import { useCollectionDrag, type CollectionDrag } from "./collection/collectionDrag";
import {
  ColumnBrowserList,
  columnRowDomId,
  type ColumnBrowserColumn,
  type ColumnBrowserRow,
} from "./ColumnBrowserColumn";

export type { ColumnBrowserColumn, ColumnBrowserRow } from "./ColumnBrowserColumn";

export type ColumnBrowserProps = {
  /** The browser's accessible name, such as "Columns". */
  label: string;
  /** The folders open from left to right, each with what's picked in it. */
  columns: ReadonlyArray<ColumnBrowserColumn>;
  /**
   * A row was picked, by a click or a key: the caller decides what that does to the selection
   * (⇧ and ⌘ on the event extend it) and which columns follow.
   */
  onSelect: (column: number, id: string, event: MouseEvent | KeyboardEvent) => void;
  /** Double-click, Enter or ⌘↓ on a row. */
  onOpen: (column: number, id: string) => void;
  /** A row's actions as menu rows (MenuItem…), opened by a right-click on it. */
  menu?: (column: number, id: string) => ReactNode;
  /** Shown as the last column, for a picked file: its preview and facts. */
  preview?: ReactNode;
  /** Moves rows by dragging them onto a folder row or a column, as CollectionItems' `drag`. */
  drag?: CollectionDrag;
  /** Layout only. */
  className?: string;
};

/** The last column with something picked in it, where the keyboard starts. */
function deepestPicked(columns: ReadonlyArray<ColumnBrowserColumn>) {
  for (let index = columns.length - 1; index >= 0; index -= 1)
    if (columns[index].selected.length) return index;
  return columns.length ? 0 : -1;
}

/**
 * Finder's column view: each open folder a 270px column of 36px rows, a chevron at the end of
 * each folder, the folder picked in one column listed in the next, and a picked file's `preview`
 * last. The picked rows take the row wash, stronger in the column the keyboard is in. The strip
 * scrolls sideways and keeps its last column in view; each column scrolls on its own. A loading
 * column shows ListRowSkeletons and a failed one a muted line. Keys: ↑ and ↓ move in a column (⇧
 * extends, as the caller decides), → enters the picked folder's column, ← goes back, Enter or ⌘↓
 * opens. Right-click opens a row's `menu`; with `drag` rows move by dragging, ⌥ copying.
 *
 * The caller owns the selection and which columns show. For a flat list or grid of one folder use
 * CollectionItems; for a tree, TreeRow.
 *
 * ```tsx
 * <ColumnBrowser label="Columns" columns={columns} onSelect={pick} onOpen={open}
 *   menu={(column, id) => <MenuItem label="Rename" onSelect={() => rename(id)} />} preview={info} />
 * ```
 */
export function ColumnBrowser({
  label,
  columns,
  onSelect,
  onOpen,
  menu,
  preview,
  drag,
  className,
}: ColumnBrowserProps) {
  const base = useId();
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [focusedColumn, setFocusedColumn] = useState(-1);
  const [cursors, setCursors] = useState<Record<string, string>>({});
  const [menuFor, setMenuFor] = useState<{ column: number; id: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const active =
    focusedColumn >= 0 && focusedColumn < columns.length ? focusedColumn : deepestPicked(columns);

  const labels = useMemo(() => {
    const names = new Map<string, string>();
    for (const column of columns) for (const row of column.rows ?? []) names.set(row.id, row.label);
    return names;
  }, [columns]);
  const { listProps, itemProps } = useCollectionDrag(drag, [], (id) => labels.get(id) ?? id);
  const dropRef = listProps.ref;
  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      stripRef.current = node;
      dropRef?.(node);
    },
    [dropRef],
  );

  // A new column, or the preview, comes into view at the end.
  const shape = columns.map((column) => column.id).join("\n") + (preview ? "\n" : "");
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (strip) strip.scrollLeft = strip.scrollWidth;
  }, [shape]);

  const cursorOf = (index: number) => {
    const column = columns[index];
    if (!column) return undefined;
    const mine = cursors[column.id];
    if (mine !== undefined && column.selected.includes(mine)) return mine;
    return column.selected[column.selected.length - 1];
  };
  const pick = (index: number, id: string, event: MouseEvent | KeyboardEvent) => {
    setFocusedColumn(index);
    const column = columns[index];
    if (column) setCursors((previous) => ({ ...previous, [column.id]: id }));
    onSelect(index, id, event);
  };
  const focusColumn = (index: number) => {
    setFocusedColumn(index);
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-column-index="${index}"]`)
      ?.focus({ preventScroll: true });
  };
  const reveal = (index: number, row: number) =>
    requestAnimationFrame(() =>
      document
        .getElementById(columnRowDomId(base, index, row))
        ?.scrollIntoView({ block: "nearest", inline: "nearest" }),
    );

  const keyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const rows: ColumnBrowserRow[] = columns[index]?.rows ?? [];
    const at = cursorOf(index);
    const atIndex = rows.findIndex((row) => row.id === at);
    if (event.key === "ArrowLeft") {
      if (index === 0) return;
      event.preventDefault();
      focusColumn(index - 1);
      const parent = cursorOf(index - 1);
      if (parent !== undefined) pick(index - 1, parent, event);
      return;
    }
    if (event.key === "ArrowRight") {
      const next = columns[index + 1];
      if (!rows[atIndex]?.folder || !next) return;
      event.preventDefault();
      focusColumn(index + 1);
      const first = next.rows?.[0];
      if (first) {
        pick(index + 1, first.id, event);
        reveal(index + 1, 0);
      }
      return;
    }
    if (event.key === "Enter" || (event.key === "ArrowDown" && event.metaKey)) {
      if (at === undefined) return;
      event.preventDefault();
      onOpen(index, at);
      return;
    }
    const step =
      event.key === "ArrowDown"
        ? atIndex < 0
          ? 0
          : Math.min(rows.length - 1, atIndex + 1)
        : event.key === "ArrowUp"
          ? atIndex < 0
            ? rows.length - 1
            : Math.max(0, atIndex - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? rows.length - 1
              : -1;
    if (step < 0 || !rows.length) return;
    event.preventDefault();
    if (step === atIndex) return;
    pick(index, rows[step].id, event);
    reveal(index, step);
  };

  return (
    <div
      {...listProps}
      ref={attach}
      role="group"
      aria-label={label}
      data-slot="column-browser"
      className={cn(
        "group/columns flex h-full min-h-0 w-full min-w-0 overflow-x-auto overflow-y-hidden",
        className,
      )}
    >
      {columns.map((column, index) => (
        <ColumnBrowserList
          key={`${index}:${column.id}`}
          column={column}
          index={index}
          base={base}
          label={`${label}: column ${index + 1}`}
          active={index === active}
          cursor={cursorOf(index)}
          menuRow={menuOpen && menuFor && menuFor.column === index ? menuFor.id : undefined}
          menu={menu && menuFor && menuFor.column === index ? menu(index, menuFor.id) : null}
          hasMenu={Boolean(menu)}
          onMenuOpenChange={setMenuOpen}
          dragProps={(row) => itemProps(row.id, row.folder, column.selected)}
          onFocus={() => setFocusedColumn(index)}
          onKeyDown={keyDown(index)}
          onPick={(id, event) => pick(index, id, event)}
          onOpen={(id) => onOpen(index, id)}
          onMenu={(id, event) => {
            setMenuFor({ column: index, id });
            if (!column.selected.includes(id)) pick(index, id, event);
          }}
        />
      ))}
      {preview ? (
        <div
          data-slot="column-browser-preview"
          className="flex h-full min-w-72 flex-1 flex-col overflow-y-auto p-4"
        >
          {preview}
        </div>
      ) : null}
    </div>
  );
}
