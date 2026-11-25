import { useEffect, type MouseEvent } from "react";
import { cn } from "../../class_names";
import { Pressable } from "../../controls/Pressable";
import { StateMark } from "../../display/StateMark";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { CollectionItemActions } from "./CollectionItemActions";
import type { CollectionDragItemProps } from "./collection_drag";
import {
  autoFillCount,
  childStride,
  useRevealItem,
  useVirtualItems,
} from "./collection_virtual";
import {
  collectionIconTone,
  hasItemActions,
  type CollectionItem,
} from "./collection_item_types";

/** How big an icon grid draws its items: 0 small, 1 the default, 2 large. */
export type CollectionZoom = 0 | 1 | 2;

/** The narrowest a tile goes at each zoom; the grid fits as many as the width allows. */
const tileWidth: Record<CollectionZoom, string> = {
  0: "grid-cols-[repeat(auto-fill,minmax(--spacing(22),1fr))]",
  1: "grid-cols-[repeat(auto-fill,minmax(--spacing(26),1fr))]",
  2: "grid-cols-[repeat(auto-fill,minmax(--spacing(34),1fr))]",
};

/** The same narrowest widths, in steps of the spacing scale, for counting tiles in a row. */
const tileSteps: Record<CollectionZoom, number> = { 0: 22, 1: 26, 2: 34 };

/** A tile's height with the gap under it, before a drawn one is measured. */
const tileEstimate: Record<CollectionZoom, number> = { 0: 124, 1: 151, 2: 187 };

/** The picture's box at each zoom: an icon fills it, a thumbnail is cropped to it. */
const pictureBox: Record<CollectionZoom, string> = {
  0: "size-14",
  1: "size-20",
  2: "size-28",
};

/**
 * A file manager's icon view, as Finder's and Kura's: each item a large icon (or its thumbnail)
 * over its name in up to two centered lines (room for two is always kept, so every tile is one
height), with no card around it. A tile washes under the
 * pointer and takes the row's picked wash while selected; its ⋯ shows at its top right on hover,
 * and a right-click opens the same menu. `zoom` sets how big the tiles are. Only the rows in view
 * are drawn. Drawn by CollectionItems with `gridLayout="icons"`.
 */
export function CollectionIconGrid({
  items,
  zoom = 1,
  selectedIds = [],
  onSelect,
  dragItem,
  reveal,
  onPerRow,
}: {
  items: CollectionItem[];
  zoom?: CollectionZoom;
  selectedIds?: string[];
  onSelect?: (event: MouseEvent, id: string, onOpen: () => void) => void;
  dragItem?: (item: CollectionItem) => CollectionDragItemProps | undefined;
  /** Scrolls this item's tile into view whenever it changes to a new id. */
  reveal?: string;
  /** Told how many tiles sit in a row, as it changes. */
  onPerRow?: (perRow: number) => void;
}) {
  const picked = new Set(selectedIds);
  const virtual = useVirtualItems({
    count: items.length,
    estimate: tileEstimate[zoom],
    perRow: (width, element) => autoFillCount(width, element, tileSteps[zoom]),
    measure: childStride,
  });
  useRevealItem(reveal, items, virtual.reveal, virtual.ready);
  const perRow = virtual.perRow;
  useEffect(() => {
    if (perRow) onPerRow?.(perRow);
  }, [perRow, onPerRow]);
  return (
    <div
      ref={virtual.ref}
      className={cn("grid gap-1", tileWidth[zoom])}
      style={
        perRow
          ? {
              gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`,
              paddingTop: virtual.before || undefined,
              paddingBottom: virtual.after || undefined,
            }
          : undefined
      }
    >
      {items.slice(virtual.start, virtual.end).map((item) => {
        const open = (event: MouseEvent) => {
          if (item.selectable && onSelect)
            onSelect(event, item.id, item.onOpen);
          else item.onOpen();
        };
        const actions = hasItemActions(item);
        return (
          <div
            {...dragItem?.(item)}
            key={item.id}
            data-selected={picked.has(item.id) || undefined}
            className={cn(
              "group/row relative min-w-0 rounded-lg transition-colors",
              "hover:bg-row-hover has-[:focus-visible]:bg-row-hover data-[selected]:bg-row-active",
            )}
          >
            <Pressable
              aria-label={item.title}
              className="flex w-full min-w-0 flex-col items-center gap-1 px-1 pt-2 pb-1"
              onClick={open}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid shrink-0 place-items-center overflow-hidden rounded-md",
                  pictureBox[zoom],
                  collectionIconTone(item),
                  item.preview
                    ? "[&>img]:size-full [&>img]:object-cover"
                    : "[&_img]:size-full [&_img]:object-contain [&_svg]:size-full",
                )}
              >
                {item.preview ?? item.icon}
              </span>
              <span className="flex w-full min-w-0 items-start justify-center gap-1">
                <OverflowFadeText
                  full
                  lines={2}
                  className="min-h-[2lh] min-w-0 text-center text-meta text-cream"
                >
                  {item.title}
                </OverflowFadeText>
                {item.marks ? (
                  <span className="flex h-5 shrink-0 items-center">
                    {item.marks}
                  </span>
                ) : null}
              </span>
            </Pressable>
            {actions || item.sync ? (
              <div className="absolute right-1 top-1 grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
                {item.sync ? (
                  <span
                    className={cn(
                      "flex items-center",
                      actions && [
                        "group-hover/row:invisible group-focus-within/row:invisible",
                        "group-has-[[data-state=open]]/row:invisible group-has-[[data-context-open]]/row:invisible",
                      ],
                    )}
                  >
                    <StateMark kind={item.sync} />
                  </span>
                ) : null}
                <CollectionItemActions item={item} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
