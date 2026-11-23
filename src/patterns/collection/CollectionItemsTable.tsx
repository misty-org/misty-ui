import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Pressable } from "../../controls/Pressable";
import { StateMark } from "../../display/StateMark";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../display/Table";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { cn } from "../../class_names";
import { CollectionItemActions } from "./CollectionItemActions";
import type { CollectionDragItemProps } from "./collection_drag";
import {
  childStride,
  useRevealItem,
  useVirtualItems,
} from "./collection_virtual";
import {
  collectionIconTone,
  type CollectionColumn,
  type CollectionItem,
} from "./collection_item_types";

export type CollectionSort = { key: string; descending: boolean };

const rowClass = cn(
  "group/row h-8 cursor-pointer border-0 transition-none",
  "[&>td]:h-8 [&>td]:py-0 [&>td:not([data-gutter])]:px-2",
  "[&>td]:border-t-2 [&>td]:border-transparent [&>td]:bg-clip-padding",
  "[&>td:nth-child(2)]:rounded-l-md [&>td:nth-last-child(2)]:rounded-r-md",
  "[--row-wash:transparent]",
  "hover:[--row-wash:var(--color-control-hover)] focus-within:[--row-wash:var(--color-control-hover)]",
  "data-[state=open]:[--row-wash:var(--color-control-hover)]",
  "has-[[data-state=open]]:[--row-wash:var(--color-control-hover)]",
  "has-[[data-context-open]]:[--row-wash:var(--color-control-hover)]",
  "data-[selected]:[--row-wash:var(--color-control-active)]",
  "[&>td:not([data-gutter])]:bg-[image:linear-gradient(var(--row-wash),var(--row-wash))]",
);

const iconRowClass = "h-auto [&>td]:h-auto [&>td]:py-0";

/**
 * A column's seam carried down through its rows: a hairline at each body cell's right edge, under
 * the header's seam, shown while the table is hovered or a seam is dragged. It reaches up through
 * the row's clear top edge, so the line runs unbroken from the header to the last row; the cell
 * doesn't clip it, so a column narrower than its value relies on its content's own fade.
 */
const columnLineClass = cn(
  "relative after:pointer-events-none after:absolute after:-top-0.5 after:bottom-0 after:right-0",
  "after:w-px after:content-[''] after:bg-transparent",
  "group-hover/table:after:bg-charcoal-border group-data-[resizing]/table:after:bg-charcoal-border",
);

/** Column widths the person dragged, in pixels, by column key. */
export type CollectionColumnWidths = Record<string, number>;

const MIN_NAME_WIDTH = 126;
const MIN_COLUMN_WIDTH = 54;
const MAX_COLUMN_WIDTH = 1200;
/** One arrow key on a focused seam moves it this far. */
const KEY_STEP = 9;

const clampWidth = (key: string, width: number) =>
  Math.round(
    Math.min(
      MAX_COLUMN_WIDTH,
      Math.max(key === "name" ? MIN_NAME_WIDTH : MIN_COLUMN_WIDTH, width),
    ),
  );

/**
 * The seam at a column's right edge, as Kura's: a hairline that shows while the table is
 * hovered (carried down through the rows by `columnLineClass`) and stays bright while it is dragged. It runs the header's whole height, meeting the
 * bar's hairline above and the header's below, never stopping short of either. Dragging it (or the arrow keys while it holds
 * focus) sizes the column before it; a double-click puts every column back to fit the page.
 */
function ColumnSeam({
  label,
  active,
  onPointerDown,
  onKeyDown,
  onReset,
}: {
  label: string;
  active: boolean;
  onPointerDown: (event: PointerEvent<HTMLSpanElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => void;
  onReset: () => void;
}) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label}`}
      tabIndex={0}
      data-active={active || undefined}
      className={cn(
        "absolute right-0 top-0 z-10 h-full w-2 cursor-col-resize touch-none outline-none",
        "after:absolute after:inset-y-0 after:right-0 after:w-px after:content-['']",
        "after:bg-transparent group-hover/table:after:bg-charcoal-border",
        "focus-visible:after:bg-charcoal-border-strong data-[active]:after:bg-charcoal-border-strong",
      )}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={onReset}
      onClick={(event) => event.stopPropagation()}
    />
  );
}

function SortHeader({
  column,
  sort,
  onSort,
  fixed,
  seam,
  cellRef,
}: {
  column: CollectionColumn;
  sort: CollectionSort | null;
  onSort: (sort: CollectionSort | null) => void;
  /** The columns have the widths the person dragged them to. */
  fixed: boolean;
  seam: ReactNode;
  cellRef: (cell: HTMLTableCellElement | null) => void;
}) {
  const selected = sort?.key === column.key;
  const Icon = selected ? (sort.descending ? ArrowDown : ArrowUp) : ArrowUpDown;
  return (
    <TableHead
      ref={cellRef}
      className={cn(
        "relative",
        fixed
          ? "overflow-hidden whitespace-nowrap"
          : column.key === "name"
            ? "w-full min-w-64"
            : "min-w-28 whitespace-nowrap",
      )}
      aria-sort={
        selected ? (sort.descending ? "descending" : "ascending") : "none"
      }
      aria-label={column.label}
    >
      <Pressable
        className={cn(
          "group/sort flex h-8 w-full min-w-0 items-center gap-1 px-2",
          "font-medium text-cream-muted hover:text-cream focus-visible:text-cream",
          selected && "text-cream",
        )}
        onClick={() =>
          onSort(
            selected && sort.descending
              ? null
              : { key: column.key, descending: selected },
          )
        }
      >
        <OverflowFadeText>{column.label}</OverflowFadeText>
        <Icon
          aria-hidden="true"
          className={cn(
            "size-3 shrink-0",
            !selected &&
              "opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100",
          )}
        />
      </Pressable>
      {seam}
    </TableHead>
  );
}

/** Clicks that belong to a control inside the row, or to a menu portaled out of it. */
function ownClick(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  if (!event.currentTarget.contains(target)) return false;
  return !target.closest(
    "button, a, input, [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio]",
  );
}

export function CollectionItemsTable({
  items,
  columns,
  metadataColumns,
  hasActions,
  stickyActions = false,
  icons = false,
  sort,
  onSort,
  selectedIds = [],
  onSelect,
  dragItem,
  widths,
  onWidthsChange,
  reveal,
}: {
  items: CollectionItem[];
  /** Visible columns, including the name column. */
  columns: CollectionColumn[];
  /** Visible columns after the name column. */
  metadataColumns: CollectionColumn[];
  hasActions: boolean;
  stickyActions?: boolean;
  /**
   * Rows start with the item's icon, bare, and the title may take two lines. `inline` keeps the
   * 36px row and puts the icon at the glyph size right before the name, as a file manager's list.
   */
  icons?: boolean | "inline";
  sort: CollectionSort | null;
  onSort: (sort: CollectionSort | null) => void;
  selectedIds?: string[];
  onSelect?: (event: MouseEvent, id: string, onOpen: () => void) => void;
  /** What each row carries to be dragged (CollectionItems' `drag`). */
  dragItem?: (item: CollectionItem) => CollectionDragItemProps | undefined;
  /**
   * The widths the person dragged the columns to. Empty, the table fits the page, the name taking
   * what the other columns leave.
   */
  widths?: CollectionColumnWidths;
  /** Keeps widths the person dragged to; an empty set puts the columns back to fit the page. */
  onWidthsChange?: (widths: CollectionColumnWidths) => void;
  /** Scrolls this item's row into view whenever it changes to a new id. */
  reveal?: string;
}) {
  const picked = new Set(selectedIds);
  const virtual = useVirtualItems({
    count: items.length,
    estimate: icons === true ? 54 : 36,
    measure: (body) => childStride(body, 1, ":scope > tr[data-collection-row]"),
  });
  useRevealItem(reveal, items, virtual.reveal, virtual.ready);
  const shownItems = items.slice(virtual.start, virtual.end);
  const cells = useRef(new Map<string, HTMLTableCellElement>());
  const [draft, setDraft] = useState<CollectionColumnWidths | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const resizable = onWidthsChange !== undefined;
  const held = draft ?? widths ?? {};
  const fixed =
    resizable && columns.some((column) => held[column.key] !== undefined);
  const widthOf = (key: string) =>
    held[key] ??
    cells.current.get(key)?.getBoundingClientRect().width ??
    MIN_COLUMN_WIDTH * 2;
  const measured = (): CollectionColumnWidths =>
    Object.fromEntries(
      columns.map((column) => [
        column.key,
        clampWidth(column.key, widthOf(column.key)),
      ]),
    );
  const total = columns.reduce(
    (sum, column) => sum + (fixed ? widthOf(column.key) : 0),
    0,
  );

  const startResize = (key: string, event: PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0 || !onWidthsChange) return;
    event.preventDefault();
    event.stopPropagation();
    const seam = event.currentTarget;
    seam.setPointerCapture(event.pointerId);
    const start = measured();
    const startX = event.clientX;
    let next = start;
    let frame: number | null = null;
    const body = document.body.style;
    const before = { cursor: body.cursor, userSelect: body.userSelect };
    body.cursor = "col-resize";
    body.userSelect = "none";
    setDragging(key);
    setDraft(start);
    const move = (moved: globalThis.PointerEvent) => {
      next = {
        ...start,
        [key]: clampWidth(key, start[key] + moved.clientX - startX),
      };
      frame ??= requestAnimationFrame(() => {
        frame = null;
        setDraft(next);
      });
    };
    const end = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      seam.removeEventListener("pointermove", move);
      seam.removeEventListener("pointerup", end);
      seam.removeEventListener("pointercancel", end);
      body.cursor = before.cursor;
      body.userSelect = before.userSelect;
      setDragging(null);
      setDraft(null);
      onWidthsChange(next);
    };
    seam.addEventListener("pointermove", move);
    seam.addEventListener("pointerup", end);
    seam.addEventListener("pointercancel", end);
  };
  const nudge = (key: string, event: KeyboardEvent<HTMLSpanElement>) => {
    if (
      !onWidthsChange ||
      (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
    )
      return;
    event.preventDefault();
    const now = measured();
    const step = event.key === "ArrowLeft" ? -KEY_STEP : KEY_STEP;
    onWidthsChange({ ...now, [key]: clampWidth(key, now[key] + step) });
  };
  const seamFor = (column: CollectionColumn) =>
    resizable ? (
      <ColumnSeam
        label={column.label}
        active={dragging === column.key}
        onPointerDown={(event) => startResize(column.key, event)}
        onKeyDown={(event) => nudge(column.key, event)}
        onReset={() => onWidthsChange?.({})}
      />
    ) : null;
  const filler = fixed ? (
    <TableHead aria-hidden="true" className="p-0" />
  ) : null;
  const headGutter = (
    <TableHead aria-hidden="true" data-gutter="" className="w-2 p-0" />
  );
  const rowGutter = (
    <TableCell aria-hidden="true" data-gutter="" className="w-2 p-0" />
  );
  const span = columns.length + 2 + (fixed ? 1 : 0) + (hasActions ? 1 : 0);
  const spacer = (height: number) =>
    height > 0 ? (
      <tr aria-hidden="true">
        <td colSpan={span} style={{ height, padding: 0 }} />
      </tr>
    ) : null;

  return (
    <div className="min-w-0 shrink-0 overflow-x-auto">
      <Table
        unwrapped
        data-resizing={dragging !== null || undefined}
        className={cn(
          "group/table border-separate border-spacing-0",
          fixed && "table-fixed",
        )}
        style={
          fixed
            ? {
                width: `max(100%, calc(${Math.ceil(total)}px + var(--spacing) * 4))`,
              }
            : undefined
        }
      >
        {fixed ? (
          <colgroup>
            <col className="w-2" />
            {columns.map((column) => (
              <col key={column.key} style={{ width: widthOf(column.key) }} />
            ))}
            <col />
            {hasActions && <col className="w-10" />}
            <col className="w-2" />
          </colgroup>
        ) : null}
        <TableHeader>
          <TableRow className="group/head [&>th]:border-b [&>th]:border-charcoal-border [&>th]:px-0">
            {headGutter}
            {columns.map((column) => (
              <SortHeader
                key={column.key}
                column={column}
                sort={sort}
                onSort={onSort}
                fixed={fixed}
                seam={seamFor(column)}
                cellRef={(cell) => {
                  if (cell) cells.current.set(column.key, cell);
                  else cells.current.delete(column.key);
                }}
              />
            ))}
            {filler}
            {hasActions && (
              <TableHead
                className={cn(
                  "w-10",
                  stickyActions &&
                    "sticky right-0 z-10 bg-charcoal-workspace text-right",
                )}
              >
                <span className={stickyActions ? "px-2" : "sr-only"}>
                  Actions
                </span>
              </TableHead>
            )}
            {headGutter}
          </TableRow>
        </TableHeader>
        <TableBody ref={virtual.ref}>
          {spacer(virtual.before)}
          {shownItems.map((item) => {
            const open = (event: MouseEvent) => {
              if (item.selectable && onSelect)
                onSelect(event, item.id, item.onOpen);
              else item.onOpen();
            };
            return (
              <TableRow
                {...dragItem?.(item)}
                key={item.id}
                data-collection-row=""
                data-selected={picked.has(item.id) || undefined}
                className={cn(rowClass, icons === true && iconRowClass)}
                onClick={(event) => {
                  if (ownClick(event)) open(event);
                }}
              >
                {rowGutter}
                <TableCell className={cn(resizable && columnLineClass)}>
                  <Pressable
                    aria-label={item.title}
                    className={cn(
                      "flex w-full min-w-0 items-center text-cream",
                      fixed && "overflow-hidden",
                      icons === true ? "min-h-12 gap-3 py-2" : "h-8 gap-2",
                    )}
                    onClick={open}
                  >
                    {icons === "inline" && item.icon ? (
                      <span
                        aria-hidden="true"
                        data-slot="collection-row-icon"
                        className={cn(
                          "grid size-5 shrink-0 place-items-center",
                          "[&_img]:size-5 [&_img]:object-contain",
                          collectionIconTone(item),
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    {icons === true && item.icon ? (
                      <span
                        aria-hidden="true"
                        data-slot="collection-row-icon"
                        className={cn(
                          "grid size-8 shrink-0 place-items-center",
                          "[&_img]:size-5 [&_img]:object-contain [&_svg]:size-5",
                          collectionIconTone(item),
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <OverflowFadeText
                      full
                      lines={icons === true ? 2 : 1}
                      className={item.marks ? "min-w-0 shrink" : "flex-1"}
                    >
                      {item.title}
                    </OverflowFadeText>
                    {item.marks ? (
                      <>
                        <span className="flex shrink-0 items-center">
                          {item.marks}
                        </span>
                        <span aria-hidden="true" className="flex-1" />
                      </>
                    ) : null}
                    {item.marker}
                    {item.sync ? <StateMark kind={item.sync} /> : null}
                  </Pressable>
                </TableCell>
                {metadataColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "whitespace-nowrap text-cream-muted",
                      resizable && columnLineClass,
                    )}
                  >
                    {fixed ? (
                      <OverflowFadeText full className="block min-w-0">
                        {column.render(item)}
                      </OverflowFadeText>
                    ) : (
                      column.render(item)
                    )}
                  </TableCell>
                ))}
                {fixed ? (
                  <TableCell aria-hidden="true" className="p-0" />
                ) : null}
                {hasActions && (
                  <TableCell
                    className={cn(
                      "w-10 whitespace-nowrap text-right",
                      stickyActions &&
                        "sticky right-0 z-10 bg-charcoal-workspace",
                    )}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex justify-end">
                      <CollectionItemActions item={item} />
                    </div>
                  </TableCell>
                )}
                {rowGutter}
              </TableRow>
            );
          })}
          {spacer(virtual.after)}
        </TableBody>
      </Table>
    </div>
  );
}
