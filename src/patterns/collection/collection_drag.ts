import "../pointer_reorder.css";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { createDwell } from "../../hooks/pointer_dwell";
import { startGesture } from "../../hooks/pointer_gesture";
import {
  usePointerDropTarget,
  visibleRect,
  type ReorderHit,
} from "../../hooks/pointer_drop_targets";

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
  /**
   * The open folder, as a key. The items may be let go anywhere the drag reaches, including this
   * collection after it has moved on to another folder: they land back in the folder they came
   * from only as a copy.
   */
  where?: string;
  /**
   * A drag rested on a folder for a moment, still held: open it, as Finder's spring-loaded
   * folders do, so the items can be dropped inside. The drag carries on as the folder opens.
   */
  onDwell?(target: string): void;
  /**
   * What the dragged items are to drop targets beyond collections, by scope, asked as the drag
   * starts: the window's tabs open under a resting drag (`workspace-tab-switch`), a composer
   * attaches the files.
   */
  carries?(ids: ReadonlyArray<string>): Record<string, string> | undefined;
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

/** The items being dragged now and where they came from, across every collection. */
let lifted: { ids: ReadonlyArray<string>; from: string } | null = null;
const liftedListeners = new Set<() => void>();
const NOTHING: ReadonlyArray<string> = [];
function setLifted(next: typeof lifted) {
  lifted = next;
  for (const listener of liftedListeners) listener();
}
function useLiftedIds(): ReadonlyArray<string> {
  return useSyncExternalStore(
    (listener) => {
      liftedListeners.add(listener);
      return () => liftedListeners.delete(listener);
    },
    () => lifted?.ids ?? NOTHING,
    () => NOTHING,
  );
}
const fromKey = (where: string, zone: string) => `${where}\u0000${zone}`;

let tracking = false;
function trackCopyKey() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  const note = (event: KeyboardEvent | PointerEvent) => {
    copyHeld = event.altKey;
  };
  for (const type of [
    "keydown",
    "keyup",
    "pointerdown",
    "pointermove",
  ] as const)
    window.addEventListener(type, note, true);
}

const ignored =
  "input, textarea, [contenteditable=true], [data-reorder-ignore], [data-slot=row-actions]";

/**
 * Pointer dragging for a collection's items, never the browser's or Tauri's native drag loop. The
 * root (`listProps`) is the drop region: the item under the pointer, when it is marked with
 * `data-collection-drop` (a folder), takes the drop first, then the `data-collection-zone` under the pointer (a column), then the root
 * itself as the open folder. Dropping back into the zone the items came from does nothing unless
 * ⌥ makes it a copy. A drag rested on a folder opens it (`onDwell`), and the drag outlives the
 * pressed item, so it carries on into the folder, another collection or another tab.
 */
export function useCollectionDrag(
  drag: CollectionDrag | undefined,
  selected: ReadonlyArray<string>,
  labelOf: (id: string) => string,
) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useMemo(() => ({ current: element }), [element]);
  const dragging = useLiftedIds();
  const instance = useId();
  const latest = useRef({ drag, selected, labelOf });
  latest.current = { drag, selected, labelOf };
  const cancel = useRef<(() => void) | undefined>(undefined);
  const pressed = useRef(false);
  const dwell = useRef(createDwell());
  useEffect(() => {
    if (drag) trackCopyKey();
  }, [drag]);
  useEffect(
    () => () => {
      if (pressed.current) cancel.current?.();
    },
    [],
  );

  usePointerDropTarget(ref, {
    scope: collectionDragScope,
    hit(x, y, moving): ReorderHit | null {
      const root = ref.current;
      const current = latest.current.drag;
      if (!root || !current) return null;
      const ids = moving.ids ?? [moving.id];
      const own = (node: HTMLElement | null | undefined) =>
        node && node.closest("[data-reorder-list]") === root ? node : undefined;
      const top = document
        .elementsFromPoint(x, y)
        .find(
          (node): node is HTMLElement =>
            node instanceof HTMLElement && root.contains(node),
        );
      const folder = own(top?.closest<HTMLElement>("[data-collection-drop]"));
      if (folder) {
        const id = folder.dataset.collectionDrop!;
        if (ids.includes(id)) return null;
        dwell.current(id, (target) => latest.current.drag?.onDwell?.(target));
        if (current.canDrop?.(id) === false) return null;
        return {
          id,
          after: false,
          rect: visibleRect(folder),
          axis: "y",
          box: true,
        };
      }
      dwell.current(null, () => undefined);
      const zone = own(top?.closest<HTMLElement>("[data-collection-zone]"));
      const id = zone?.dataset.collectionZone ?? "";
      if (lifted?.from === fromKey(current.where ?? instance, id) && !copyHeld) return null;
      if (id && current.canDrop?.(id) === false) return null;
      return {
        id,
        after: false,
        rect: visibleRect(zone ?? root),
        axis: "y",
        box: true,
      };
    },
    drop(moving, hit) {
      latest.current.drag?.onDrop(
        hit.id === "" ? null : hit.id,
        moving.ids ?? [moving.id],
        copyHeld,
      );
    },
  });

  /** The drop region's props: the list, grid or strip that holds the items. */
  const listProps: {
    ref?: (node: HTMLElement | null) => void;
    "data-reorder-list"?: string;
  } = drag ? { ref: setElement, "data-reorder-list": collectionDragScope } : {};

  const start = (
    event: ReactPointerEvent<HTMLElement>,
    id: string,
    picked: ReadonlyArray<string>,
  ) => {
    if (!latest.current.drag) return;
    if (
      event.button !== 0 ||
      !event.isPrimary ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey
    )
      return;
    if ((event.target as Element).closest(ignored)) return;
    const ids = picked.includes(id) ? [...picked] : [id];
    const label =
      ids.length === 1 ? latest.current.labelOf(ids[0]) : `${ids.length} items`;
    const zone =
      event.currentTarget.closest<HTMLElement>("[data-collection-zone]")
        ?.dataset.collectionZone ?? "";
    const from = fromKey(latest.current.drag.where ?? instance, zone);
    cancel.current?.();
    pressed.current = true;
    cancel.current = startGesture(
      event,
      {
        id,
        ids,
        label,
        scope: collectionDragScope,
        carries: latest.current.drag.carries?.(ids),
      },
      () => {
        pressed.current = false;
        setLifted({ ids, from });
        return () => setLifted(null);
      },
      { outlivesSource: true },
    );
  };

  /**
   * The props an item needs to be dragged; `folder` makes it a drop target too. `picked` is the
   * selection it belongs to (a column's), when not the one the hook was given.
   */
  const itemProps = (
    id: string,
    folder: boolean,
    picked?: ReadonlyArray<string>,
  ): CollectionDragItemProps | undefined =>
    drag
      ? {
          "data-reorder-handle": "",
          "data-collection-drop": folder ? id : undefined,
          "data-reorder-dragging": dragging.includes(id) ? "true" : undefined,
          onPointerDown: (event) =>
            start(event, id, picked ?? latest.current.selected),
        }
      : undefined;

  return { listProps, itemProps };
}

/**
 * Places outside a collection that take its dragged items, such as a sidebar's folders or the
 * open folder's whole pane (which takes them even while it is empty or still loading). Each
 * place inside `ref` is an element marked `data-collection-place` with its key; a collection's
 * own items under the pointer take the drop first. A drag rested on a place calls `onDwell`, so
 * it can open while still held.
 */
export function useCollectionDropPlaces(
  ref: RefObject<HTMLElement | null>,
  options: {
    /** Whether `place` takes the items, ⌥ held when `copy`; a refused place doesn't light up. */
    canDrop?(place: string, ids: ReadonlyArray<string>, copy: boolean): boolean;
    onDrop(place: string, ids: ReadonlyArray<string>, copy: boolean): void;
    onDwell?(place: string): void;
  },
) {
  const latest = useRef(options);
  latest.current = options;
  const dwell = useRef(createDwell());
  useEffect(() => {
    trackCopyKey();
  }, []);
  usePointerDropTarget(ref, {
    scope: collectionDragScope,
    hit(x, y, moving): ReorderHit | null {
      const root = ref.current;
      if (!root) return null;
      const top = document
        .elementsFromPoint(x, y)
        .find((node): node is HTMLElement => node instanceof HTMLElement && root.contains(node));
      const list = top?.closest<HTMLElement>(`[data-reorder-list="${collectionDragScope}"]`);
      if (!top || (list && root.contains(list) && list !== root)) {
        dwell.current(null, () => undefined);
        return null;
      }
      const place = top.closest<HTMLElement>("[data-collection-place]");
      if (!place || !root.contains(place)) {
        dwell.current(null, () => undefined);
        return null;
      }
      const key = place.dataset.collectionPlace!;
      dwell.current(key, (id) => latest.current.onDwell?.(id));
      const ids = moving.ids ?? [moving.id];
      if (latest.current.canDrop?.(key, ids, copyHeld) === false) return null;
      return { id: key, after: false, rect: visibleRect(place), axis: "y", box: true };
    },
    drop(moving, hit) {
      latest.current.onDrop(hit.id, moving.ids ?? [moving.id], copyHeld);
    },
  });
}
