import type { MouseEvent } from "react";
import { cn } from "../../classNames";
import { Pressable } from "../../controls/Pressable";
import { StateMark } from "../../display/StateMark";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { CollectionItemActions } from "./CollectionItemActions";
import type { CollectionDragItemProps } from "./collectionDrag";
import { collectionIconTone, hasItemActions, type CollectionItem } from "./collectionItemTypes";

/** How big an icon grid draws its items: 0 small, 1 the default, 2 large. */
export type CollectionZoom = 0 | 1 | 2;

/** The narrowest a tile goes at each zoom; the grid fits as many as the width allows. */
const tileWidth: Record<CollectionZoom, string> = {
  0: "grid-cols-[repeat(auto-fill,minmax(--spacing(22),1fr))]",
  1: "grid-cols-[repeat(auto-fill,minmax(--spacing(26),1fr))]",
  2: "grid-cols-[repeat(auto-fill,minmax(--spacing(34),1fr))]",
};

/** The picture's box at each zoom: an icon fills it, a thumbnail is cropped to it. */
const pictureBox: Record<CollectionZoom, string> = {
  0: "size-10",
  1: "size-14",
  2: "size-20",
};

/**
 * A file manager's icon view, as Finder's and Kura's: each item a large icon (or its thumbnail)
 * over its name in up to two centered lines, with no card around it. A tile washes under the
 * pointer and takes the row's picked wash while selected; its ⋯ shows at its top right on hover,
 * and a right-click opens the same menu. `zoom` sets how big the tiles are. Drawn by
 * CollectionItems with `gridLayout="icons"`.
 */
export function CollectionIconGrid({
  items,
  zoom = 1,
  selectedIds = [],
  onSelect,
  dragItem,
}: {
  items: CollectionItem[];
  zoom?: CollectionZoom;
  selectedIds?: string[];
  onSelect?: (event: MouseEvent, id: string, onOpen: () => void) => void;
  dragItem?: (item: CollectionItem) => CollectionDragItemProps | undefined;
}) {
  return (
    <div className={cn("grid gap-1", tileWidth[zoom])}>
      {items.map((item) => {
        const open = (event: MouseEvent) => {
          if (item.selectable && onSelect) onSelect(event, item.id, item.onOpen);
          else item.onOpen();
        };
        const actions = hasItemActions(item);
        return (
          <div
            {...dragItem?.(item)}
            key={item.id}
            data-selected={selectedIds.includes(item.id) || undefined}
            className={cn(
              "group/row relative min-w-0 rounded-lg transition-colors",
              "hover:bg-row-hover has-[:focus-visible]:bg-row-hover data-[selected]:bg-row-active",
            )}
          >
            <Pressable
              aria-label={item.title}
              className="flex w-full min-w-0 flex-col items-center gap-2 px-2 pt-3 pb-2"
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
                <OverflowFadeText full lines={2} className="min-w-0 text-center text-meta text-cream">
                  {item.title}
                </OverflowFadeText>
                {item.marks ? <span className="flex h-5 shrink-0 items-center">{item.marks}</span> : null}
              </span>
            </Pressable>
            {actions || item.sync ? (
              // The sync mark and the ⋯ share the top right corner; the ⋯ takes the mark's place on hover.
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
