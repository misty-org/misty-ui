import "../pointer_reorder.css";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { startGesture } from "../../hooks/pointer_gesture";
import { contains, usePointerDropTarget, visibleRect, type ReorderHit } from "../../hooks/pointer_drop_targets";

/**
 * Moving items by dragging them (CollectionItems, ColumnBrowser): drop them on a folder or on the
 * open folder's background. ⌥ (Alt) held as they land makes it a copy.
 */
export type CollectionDrag = {
  /**
   * The items landed: `target` is the id of the folder they were dropped on, or null for the open
   * folder (the background). A ColumnBrowser column's background is that column's `id`.
   */
  onDrop(target: string | null, ids: string[], copy: boolean): void;
  /** Whether a folder takes the items now being dragged; a refused folder doesn't light up. */
  canDrop?(target: string): boolean;
};

/** Every collection that moves items by dragging shares one scope, so items move between them. */
export const collectionDragScope = "collection-items";

/** What an item carries so it can be dragged, and dropped on when it is a folder. */
export type CollectionDragItemProps = {
  "data-reorder-handle": "";
  "data-collection-drop"?: string;
  "data-reorder-dragging"?: "true";
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
};

let copyHeld = false;
let tracking = false;
function trackCopyKey() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  const note = (event: KeyboardEvent | PointerEvent) => {
    copyHeld = event.altKey;
  };
  for (const type of ["keydown", "keyup", "pointerdown", "pointermove"] as const)
    window.addEventListener(type, note, true);
}

const ignored = "input, textarea, [contenteditable=true], [data-reorder-ignore], [data-slot=row-actions]";

/**
 * Pointer dragging for a collection's items, never the browser's or Tauri's native drag loop. The
 * root (`listProps`) is the drop region: items marked with `data-collection-drop` (folders) take
 * the drop first, then the `data-collection-zone` under the pointer (a column), then the root
 * itself as the open folder. Dropping back into the zone the items came from does nothing unless
 * ⌥ makes it a copy.
 */
export function useCollectionDrag(
  drag: CollectionDrag | undefined,
  selected: ReadonlyArray<string>,
  labelOf: (id: string) => string,
) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useMemo(() => ({ current: element }), [element]);
  const [dragging, setDragging] = useState<ReadonlyArray<string>>([]);
  const latest = useRef({ drag, selected, labelOf });
  latest.current = { drag, selected, labelOf };
  const source = useRef<string | null>(null);
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    if (drag) trackCopyKey();
  }, [drag]);
  useEffect(() => () => cancel.current?.(), []);

  usePointerDropTarget(ref, {
    scope: collectionDragScope,
    hit(x, y, moving): ReorderHit | null {
      const root = ref.current;
      const current = latest.current.drag;
      if (!root || !current) return null;
      const ids = moving.ids ?? [moving.id];
      const own = (node: HTMLElement) => node.closest("[data-reorder-list]") === root;
      const under = (selector: string) =>
        [...root.querySelectorAll<HTMLElement>(selector)].find(
          (node) => own(node) && contains(node.getBoundingClientRect(), x, y) && contains(visibleRect(node), x, y),
        );
      const folder = under("[data-collection-drop]");
      if (folder) {
        const id = folder.dataset.collectionDrop!;
        if (ids.includes(id) || current.canDrop?.(id) === false) return null;
        return { id, after: false, rect: visibleRect(folder), axis: "y", box: true };
      }
      const zone = under("[data-collection-zone]");
      const id = zone?.dataset.collectionZone ?? "";
      if (source.current === id && !copyHeld) return null;
      if (id && current.canDrop?.(id) === false) return null;
      return { id, after: false, rect: visibleRect(zone ?? root), axis: "y", box: true };
    },
    drop(moving, hit) {
      latest.current.drag?.onDrop(hit.id === "" ? null : hit.id, moving.ids ?? [moving.id], copyHeld);
    },
  });

  /** The drop region's props: the list, grid or strip that holds the items. */
  const listProps: { ref?: (node: HTMLElement | null) => void; "data-reorder-list"?: string } = drag
    ? { ref: setElement, "data-reorder-list": collectionDragScope }
    : {};

  const start = (event: ReactPointerEvent<HTMLElement>, id: string, picked: ReadonlyArray<string>) => {
    if (!latest.current.drag) return;
    if (event.button !== 0 || !event.isPrimary || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if ((event.target as Element).closest(ignored)) return;
    const ids = picked.includes(id) ? [...picked] : [id];
    const label = ids.length === 1 ? latest.current.labelOf(ids[0]) : `${ids.length} items`;
    const zone = event.currentTarget.closest<HTMLElement>("[data-collection-zone]")?.dataset.collectionZone ?? "";
    cancel.current?.();
    cancel.current = startGesture(event, { id, ids, label, scope: collectionDragScope }, () => {
      source.current = zone;
      setDragging(ids);
      return () => {
        source.current = null;
        setDragging([]);
      };
    });
  };

  /**
   * The props an item needs to be dragged; `folder` makes it a drop target too. `picked` is the
   * selection it belongs to (a column's), when not the one the hook was given.
   */
  const itemProps = (id: string, folder: boolean, picked?: ReadonlyArray<string>): CollectionDragItemProps | undefined =>
    drag
      ? {
          "data-reorder-handle": "",
          "data-collection-drop": folder ? id : undefined,
          "data-reorder-dragging": dragging.includes(id) ? "true" : undefined,
          onPointerDown: (event) => start(event, id, picked ?? latest.current.selected),
        }
      : undefined;

  return { listProps, itemProps };
}
