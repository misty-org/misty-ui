import { useContext, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { CollectionCreator, CollectionItemsGrid } from "./CollectionCards";
import { CollectionIconGrid, type CollectionZoom } from "./CollectionIconGrid";
import { CollectionColumnsContext, useHiddenColumns } from "./CollectionColumns";
import { collectionMemory, rememberCollection } from "./collection_memory";
import {
  CollectionItemsTable,
  type CollectionColumnWidths,
  type CollectionSort,
} from "./CollectionItemsTable";
import { useCollectionDrag, type CollectionDrag } from "./collection_drag";
import {
  compareCollectionValues,
  hasItemActions,
  type CollectionColumn,
  type CollectionItem,
} from "./collection_item_types";

/**
 * A collection's items as a sortable table (`view="list"`) or a grid of cards, each opening on a
 * press, with its actions in one ⋯ and on a right-click. With `drag` they move by dragging: onto
 * an item marked `dropTarget` (a folder) or onto the background (the open folder), ⌥ making it a
 * copy. In the list, the header sits right on its hairline, and every column's right edge is a
 * seam the person drags (or moves with the arrow keys) to size it, as in Kura, its line running
 * down through the rows while the list is hovered; a double-click on
 * a seam fits the columns to the page again. The list keeps its own step in from each side, so
 * put it flush in its pane, with no padding around it: the header's hairline then runs to both
 * edges and its seams meet the bar's hairline above. For Finder's column view use ColumnBrowser; for a
 * tree, TreeRow.
 */
export function CollectionItems({
  items,
  categoryLabel = "Area",
  view = "list",
  creatorLabel = "Created by",
  columns,
  fields = [],
  columnSetId,
  showLastActivity = true,
  sortResetKey = "",
  stickyActions = false,
  gridLayout = "preview",
  listIcons = false,
  cardTitleLines = 1,
  zoom = 1,
  selectedIds = [],
  onSelect,
  remember,
  drag,
  sort: controlledSort,
  onSortChange,
}: {
  items: CollectionItem[];
  categoryLabel?: string;
  view?: "list" | "grid";
  creatorLabel?: string;
  columns?: CollectionColumn[];
  /** Metadata labels, in display order; also defines columns when there are no rows. */
  fields?: string[];
  columnSetId?: string;
  showLastActivity?: boolean;
  /** Reset a header sort when the owning surface changes its menu ordering or section. */
  sortResetKey?: string;
  /** Keep operational controls visible when a wide table scrolls horizontally. */
  stickyActions?: boolean;
  /**
   * Compact cards suit icon-based catalogs; preview cards emphasize artwork; `icons` is a file
   * manager's icon view, each item a large icon over its name with no card (CollectionIconGrid).
   */
  gridLayout?: "preview" | "compact" | "icons";
  /**
   * List rows start with the item's icon in a framed tile, in its tone, and the title may take
   * two lines. `inline` keeps 36px rows with the icon at the glyph size before the name, as a file
   * manager's list (Files). Off, rows are 36px and start with their text.
   */
  listIcons?: boolean | "inline";
  /** How many lines a compact card's title may take before it fades. */
  cardTitleLines?: 1 | 2;
  /** How big the `icons` grid draws its tiles: 0 small, 1 the default, 2 large. */
  zoom?: CollectionZoom;
  selectedIds?: string[];
  onSelect?: (event: MouseEvent, id: string, onOpen: () => void) => void;
  /**
   * Keeps the header sort, the hidden columns and the widths the columns were dragged to in
   * `misty.db` under this key; without it they last for the page.
   */
  remember?: string;
  /**
   * Moves items by dragging them with the pointer (never the native drag loop). The picked items
   * go together when one of them is dragged, and they dim while they move. Items with
   * `dropTarget` and the background take the drop: `onDrop(target, ids, copy)`, with `target`
   * null for the background and `copy` true while ⌥ is held. `canDrop` refuses a folder.
   */
  drag?: CollectionDrag;
  /**
   * The order, held by the caller instead of here, for a page that also sorts from a menu (Kura's
   * ⋯ › Sort): the header sorts through `onSortChange` too. Null keeps the items' own order.
   */
  sort?: { key: string; descending: boolean } | null;
  onSortChange?: (sort: { key: string; descending: boolean } | null) => void;
}) {
  const titles = new Map(items.map((item) => [item.id, item.title]));
  const { listProps, itemProps } = useCollectionDrag(drag, selectedIds, (id) => titles.get(id) ?? id);
  const dragItem = drag ? (item: CollectionItem) => itemProps(item.id, item.dropTarget === true) : undefined;
  const hasActions = items.some(hasItemActions);
  const hasCreators = items.some((item) => item.creator !== undefined);
  const scope = [
    columnSetId ?? "",
    fields.join(","),
    categoryLabel,
    creatorLabel,
    columns?.map((column) => column.key).join(",") ?? "",
    sortResetKey,
  ].join(":");
  const [localSort, setLocalSort] = useState<{
    key: string;
    descending: boolean;
    scope: string;
  } | null>(null);
  const remembered = collectionMemory.useEntry(remember);
  const savedSort = remembered?.tableSort ?? null;
  const [localWidths, setLocalWidths] = useState<CollectionColumnWidths>({});
  const widths = remember ? (remembered?.widths ?? {}) : localWidths;
  const setWidths = (next: CollectionColumnWidths) => {
    if (remember)
      rememberCollection(remember, { widths: Object.keys(next).length ? next : undefined });
    else setLocalWidths(next);
  };
  const controlled = onSortChange !== undefined;
  const heldSort = controlledSort ? { ...controlledSort, scope } : null;
  const sort = controlled ? heldSort : remember ? savedSort : localSort;
  const setSort = (next: { key: string; descending: boolean; scope: string } | null) => {
    if (controlled) onSortChange(next && { key: next.key, descending: next.descending });
    else if (remember) rememberCollection(remember, { tableSort: next ?? undefined });
    else setLocalSort(next);
  };
  let activeSort = sort?.scope === scope ? sort : null;
  if (!controlled && !remember && sort && sort.scope !== scope) setSort(null);
  const baseColumns: CollectionColumn[] = columns ?? [
    {
      key: "category",
      label: categoryLabel,
      render: (item) => item.category,
      sortValue: (item) => item.sortValues?.category ?? item.category,
    },
    ...(hasCreators
      ? [
          {
            key: "creator",
            label: creatorLabel,
            render: (item: CollectionItem) => (
              <CollectionCreator description={item.creatorDescription} className="max-w-48">
                {item.creator || "Unknown"}
              </CollectionCreator>
            ),
            sortValue: (item: CollectionItem) => item.creator,
          },
        ]
      : []),
    {
      key: "updated",
      label: "Last activity",
      render: (item) => <span className="text-meta">{item.updated}</span>,
      sortValue: (item) => (item.updatedAt ? Date.parse(item.updatedAt) : undefined),
    },
  ];
  const extraColumns: CollectionColumn[] = fields.map((label) => ({
    key: `metadata:${label}`,
    label,
    render: (item) => (
      <OverflowFadeText full className="max-w-48">
        {String(item.metadata?.[label] ?? "—")}
      </OverflowFadeText>
    ),
    sortValue: (item) => item.sortValues?.[label] ?? item.metadata?.[label],
  }));
  const metadataColumns = [
    ...baseColumns.filter((column) => column.key !== "updated"),
    ...extraColumns,
    ...baseColumns.filter((column) => column.key === "updated" && showLastActivity),
  ];
  const allColumns: CollectionColumn[] = [
    { key: "name", label: "Name", render: (item) => item.title, sortValue: (item) => item.title },
    ...metadataColumns,
  ];
  const register = useContext(CollectionColumnsContext)?.register;
  const schemaKey = JSON.stringify(allColumns.map(({ key, label }) => ({ key, label })));
  const schemaId = columnSetId ?? schemaKey;
  useEffect(() => {
    if (view !== "list") return;
    register?.({ id: schemaId, columns: JSON.parse(schemaKey), remember });
    return () => register?.(null);
  }, [register, schemaId, schemaKey, view, remember]);
  const [hidden] = useHiddenColumns(schemaId, remember);
  if (activeSort && hidden.includes(activeSort.key)) {
    if (remember || controlled) activeSort = null;
    else setSort(null);
  }
  const visibleColumns = allColumns.filter((column) => !hidden.includes(column.key));
  const visibleMetadataColumns = metadataColumns.filter((column) => !hidden.includes(column.key));
  const selectedColumn = visibleColumns.find((column) => column.key === activeSort?.key);
  const orderedItems =
    activeSort && selectedColumn
      ? [...items].sort((a, b) =>
          compareCollectionValues(
            selectedColumn.sortValue(a),
            selectedColumn.sortValue(b),
            activeSort.descending,
          ),
        )
      : items;
  const region = (content: ReactNode) =>
    drag ? (
      <div {...listProps} className="flex min-h-full min-w-0 flex-1 flex-col">
        {content}
      </div>
    ) : (
      content
    );
  if (view === "grid" && gridLayout === "icons")
    return region(
      <CollectionIconGrid
        items={orderedItems}
        zoom={zoom}
        selectedIds={selectedIds}
        onSelect={onSelect}
        dragItem={dragItem}
      />,
    );
  if (view === "grid")
    return region(
      <CollectionItemsGrid
        items={orderedItems}
        hasCreators={hasCreators}
        creatorLabel={creatorLabel}
        layout={gridLayout === "icons" ? "compact" : gridLayout}
        titleLines={cardTitleLines}
        selectedIds={selectedIds}
        onSelect={onSelect}
        dragItem={dragItem}
      />,
    );
  return region(
    <CollectionItemsTable
      items={orderedItems}
      columns={visibleColumns}
      metadataColumns={visibleMetadataColumns}
      hasActions={hasActions}
      stickyActions={stickyActions}
      icons={listIcons}
      sort={activeSort}
      onSort={(next: CollectionSort | null) => setSort(next && { ...next, scope })}
      selectedIds={selectedIds}
      onSelect={onSelect}
      dragItem={dragItem}
      widths={widths}
      onWidthsChange={setWidths}
    />,
  );
}
