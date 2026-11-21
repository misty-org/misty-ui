import { ChevronRight } from "lucide-react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cn } from "../classNames";
import { ListRowSkeleton } from "../display/ListRow";
import { rowShape } from "../display/rowShape";
import { Text } from "../display/Text";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../overlays/ContextMenu";
import type { CollectionDragItemProps } from "./collection/collectionDrag";

/** One item in a ColumnBrowser column: a file or a folder. */
export type ColumnBrowserRow = {
  id: string;
  label: string;
  /** What the item is, before its name, at the glyph size. */
  icon?: ReactNode;
  /** A folder: a chevron at its end, and with `drag` a place to drop. */
  folder: boolean;
  /** Drawn faint, such as a hidden file or one cut to be moved. */
  dim?: boolean;
  /** Small marks right after the name, such as its Finder tags (`TagDots`). */
  marks?: ReactNode;
};

/** One column: a folder's items, null while they load, or why they couldn't be read. */
export type ColumnBrowserColumn = {
  id: string;
  rows: ColumnBrowserRow[] | null;
  /** Shown as one muted line instead of the rows. */
  error?: string;
  /** The ids picked in this column; in a column before the last, the folder open after it. */
  selected: ReadonlyArray<string>;
};

/** A row's id in the page, for `aria-activedescendant`. */
export function columnRowDomId(base: string, column: number, row: number) {
  return `${base}-c${column}-r${row}`;
}

/** One row: the 32px row, its icon, its name and marks, and a chevron at the end of a folder. */
function Row({
  row,
  domId,
  picked,
  strong,
  menuOpen,
  dragProps,
  onPick,
  onOpen,
  onMenu,
}: {
  row: ColumnBrowserRow;
  domId: string;
  picked: boolean;
  /** In the column the keyboard is in, so its pick washes stronger while the browser has focus. */
  strong: boolean;
  menuOpen: boolean;
  dragProps?: CollectionDragItemProps;
  onPick: (event: MouseEvent) => void;
  onOpen: () => void;
  onMenu: (event: MouseEvent) => void;
}) {
  return (
    <div
      {...dragProps}
      id={domId}
      role="option"
      aria-selected={picked}
      data-slot="column-browser-row"
      data-picked={picked || undefined}
      className={cn(
        rowShape,
        "w-full cursor-default select-none text-control text-cream",
        // The picked row takes the row wash; in the column that has focus, the control's stronger one.
        picked
          ? cn("bg-row-active", strong && "group-focus-within/columns:bg-control-active")
          : menuOpen
            ? "bg-row-hover"
            : "hover:bg-row-hover",
        row.dim && "opacity-50",
      )}
      onClick={onPick}
      onDoubleClick={onOpen}
      onContextMenu={onMenu}
    >
      {row.icon ? (
        <span aria-hidden="true" className="flex shrink-0 items-center text-cream-muted">
          {row.icon}
        </span>
      ) : null}
      <OverflowFadeText full className={row.marks ? "min-w-0 shrink" : "flex-1"}>
        {row.label}
      </OverflowFadeText>
      {row.marks ? (
        <>
          <span className="flex shrink-0 items-center">{row.marks}</span>
          <span aria-hidden="true" className="flex-1" />
        </>
      ) : null}
      {row.folder ? <ChevronRight aria-hidden="true" className="shrink-0 text-cream-muted" /> : null}
    </div>
  );
}

/**
 * One column of a ColumnBrowser: a listbox of its rows that scrolls on its own, 240px wide. While
 * its rows load it shows ListRowSkeletons; a failure is one muted line.
 */
export function ColumnBrowserList({
  column,
  index,
  base,
  label,
  active,
  cursor,
  menuRow,
  menu,
  hasMenu,
  onMenuOpenChange,
  dragProps,
  onFocus,
  onKeyDown,
  onPick,
  onOpen,
  onMenu,
}: {
  column: ColumnBrowserColumn;
  index: number;
  base: string;
  label: string;
  /** The column the keyboard is in: the tab stop, and its picks wash stronger while focused. */
  active: boolean;
  /** The row the keyboard is on. */
  cursor: string | undefined;
  /** The row whose menu is open. */
  menuRow: string | undefined;
  /** That row's menu rows, while it is this column's. */
  menu: ReactNode;
  /** Whether rows have a menu at all. */
  hasMenu: boolean;
  onMenuOpenChange: (open: boolean) => void;
  dragProps: (row: ColumnBrowserRow) => CollectionDragItemProps | undefined;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onPick: (id: string, event: MouseEvent) => void;
  onOpen: (id: string) => void;
  onMenu: (id: string, event: MouseEvent) => void;
}) {
  const rows = column.rows;
  // A right-click off the rows, or on a column with no menu, opens nothing.
  const openMenu = (event: MouseEvent) => {
    if (!hasMenu || !(event.target as Element).closest("[data-slot=column-browser-row]")) event.preventDefault();
  };
  const cursorIndex = rows && cursor !== undefined ? rows.findIndex((row) => row.id === cursor) : -1;
  return (
    <ContextMenu onOpenChange={onMenuOpenChange}>
      <ContextMenuTrigger asChild onContextMenu={openMenu}>
        <div
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          aria-busy={rows === null && !column.error ? true : undefined}
          aria-activedescendant={cursorIndex >= 0 ? columnRowDomId(base, index, cursorIndex) : undefined}
          tabIndex={active ? 0 : -1}
          data-column-index={index}
          data-collection-zone={column.id}
          data-active={active || undefined}
          data-slot="column-browser-column"
          className="group/column flex h-full w-60 shrink-0 flex-col gap-0.5 overflow-y-auto p-1 outline-none"
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        >
          {column.error ? (
            <Text size="meta" tone="muted" wrap className="px-2 py-2">
              {column.error}
            </Text>
          ) : rows === null ? (
            <ListRowSkeleton label={label} rows={6} />
          ) : (
            rows.map((row, rowIndex) => (
              <Row
                key={row.id}
                row={row}
                domId={columnRowDomId(base, index, rowIndex)}
                picked={column.selected.includes(row.id)}
                strong={active}
                menuOpen={menuRow === row.id}
                dragProps={dragProps(row)}
                onPick={(event) => onPick(row.id, event)}
                onOpen={() => onOpen(row.id)}
                onMenu={(event) => onMenu(row.id, event)}
              />
            ))
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>{menu}</ContextMenuContent>
    </ContextMenu>
  );
}
