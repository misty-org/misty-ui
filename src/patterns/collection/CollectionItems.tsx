import { useContext, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { CollectionCreator, CollectionItemsGrid } from "./CollectionCards";
import { CollectionColumnsContext, useHiddenColumns } from "./CollectionColumns";
import { collectionMemory, rememberCollection } from "./collectionMemory";
import { CollectionItemsTable, type CollectionSort } from "./CollectionItemsTable";
import { useCollectionDrag, type CollectionDrag } from "./collectionDrag";
import {
  compareCollectionValues,
  hasItemActions,
  type CollectionColumn,
  type CollectionItem,
} from "./collectionItemTypes";

/**
 * A collection's items as a sortable table (`view="list"`) or a grid of cards, each opening on a
 * press, with its actions in one ⋯ and on a right-click. With `drag` they move by dragging: onto
 * an item marked `dropTarget` (a folder) or onto the background (the open folder), ⌥ making it a
 * copy. For Finder's column view use ColumnBrowser; for a tree, TreeRow.
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
  selectedIds = [],
  onSelect,
  remember,
  drag,
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
  /** Compact cards suit icon-based catalogs; preview cards emphasize artwork. */
  gridLayout?: "preview" | "compact";
  /**
   * List rows start with the item's icon in a framed tile, in its tone, and the title may take
   * two lines. Off, rows are 36px and start with their text.
   */
  listIcons?: boolean;
  /** How many lines a compact card's title may take before it fades. */
  cardTitleLines?: 1 | 2;
  selectedIds?: string[];
  onSelect?: (event: MouseEvent, id: string, onOpen: () => void) => void;
  /**
   * Keeps the header sort and the hidden columns in `misty.db` under this key; without it they
   * last for the page.
   */
  remember?: string;
  /**
   * Moves items by dragging them with the pointer (never the native drag loop). The picked items
   * go together when one of them is dragged, and they dim while they move. Items with
   * `dropTarget` and the background take the drop: `onDrop(target, ids, copy)`, with `target`
   * null for the background and `copy` true while ⌥ is held. `canDrop` refuses a folder.
   */
  drag?: CollectionDrag;
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
  const savedSort = collectionMemory.useEntry(remember)?.tableSort ?? null;
  const sort = remember ? savedSort : localSort;
  const setSort = (next: { key: string; descending: boolean; scope: string } | null) =>
    remember ? rememberCollection(remember, { tableSort: next ?? undefined }) : setLocalSort(next);
  // A saved sort picked under another menu order or table shape stays saved but doesn't apply.
  let activeSort = sort?.scope === scope ? sort : null;
  if (!remember && sort && sort.scope !== scope) setSort(null);
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
    if (remember) activeSort = null;
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
  // With dragging, the items sit in a region that fills the pane, so its empty part takes a drop too.
  const region = (content: ReactNode) =>
    drag ? (
      <div {...listProps} className="flex min-h-full min-w-0 flex-1 flex-col">
        {content}
      </div>
    ) : (
      content
    );
  if (view === "grid")
    return region(
      <CollectionItemsGrid
        items={orderedItems}
        hasCreators={hasCreators}
        creatorLabel={creatorLabel}
        layout={gridLayout}
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
    />,
  );
}
