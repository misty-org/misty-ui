import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const drawAllUpTo = 100;
const firstDraw = 60;

export type VirtualItemsOptions = {
  /** How many items the list or grid holds. */
  count: number;
  /** Items in a row at this width; a list leaves it out, one to a row. */
  perRow?: (width: number, element: HTMLElement) => number;
  /** A row's height with the gap after it, in pixels, until a drawn row is measured. */
  estimate: number;
  /** Rows drawn past each edge of the view. */
  overscan?: number;
  /** The element scrolls itself (a ColumnBrowser column) rather than sitting in a scroller. */
  self?: boolean;
  /** Reads the drawn rows' stride, top to top, in pixels; null while it can't tell. */
  measure?: (element: HTMLElement, perRow: number) => number | null;
};

type Shown = {
  perRow: number;
  startRow: number;
  endRow: number;
  stride: number;
  ready: boolean;
};

const scrolls = (value: string) =>
  value === "auto" || value === "scroll" || value === "overlay";

function scrollParent(element: HTMLElement) {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (
      scrolls(getComputedStyle(node).overflowY) &&
      node.scrollHeight > node.clientHeight + 1
    )
      return node;
  }
  return null;
}

/** Pixels in one step of the spacing scale (`--spacing`), for grids sized in steps. */
export function spacingPixels(element: HTMLElement) {
  const raw = getComputedStyle(element).getPropertyValue("--spacing").trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return 4.5;
  if (raw.endsWith("rem"))
    return (
      value *
      parseFloat(getComputedStyle(document.documentElement).fontSize || "16")
    );
  return value;
}

/** Tiles in a row of `repeat(auto-fill, minmax(min, 1fr))` at this width, as the grid lays them. */
export function autoFillCount(
  width: number,
  element: HTMLElement,
  minSteps: number,
) {
  const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
  const min = minSteps * spacingPixels(element);
  return Math.max(1, Math.floor((width + gap) / (min + gap)));
}

/** The stride of rows drawn as the element's children: first row's top to the second's. */
export function childStride(
  element: HTMLElement,
  perRow: number,
  selector?: string,
) {
  const children = selector
    ? element.querySelectorAll<HTMLElement>(selector)
    : (element.children as HTMLCollectionOf<HTMLElement>);
  const first = children[0];
  if (!first) return null;
  const second = children[perRow];
  const top = first.getBoundingClientRect();
  if (second) return second.getBoundingClientRect().top - top.top;
  const gap = parseFloat(getComputedStyle(element).rowGap) || 0;
  return top.height + gap;
}

/**
 * Draws only the rows of a long list or grid that are in view, with `overscan` rows past each
 * edge: the caller draws items `start` to `end` and keeps `before` and `after` pixels of room for
 * the rest, so the scroller keeps its full height. It finds the nearest ancestor that scrolls
 * (or, with `self`, the element itself) and follows its scrolling and size. Rows are taken to be
 * one height, read from the drawn rows. A collection of `drawAllUpTo` items or fewer is drawn
 * whole.
 */
export function useVirtualItems(options: VirtualItemsOptions) {
  const { count, self = false } = options;
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState<Shown>({
    perRow: 1,
    startRow: 0,
    endRow: 0,
    stride: options.estimate,
    ready: false,
  });
  const latest = useRef(options);
  latest.current = options;
  const state = useRef(shown);
  state.current = shown;
  const strideRef = useRef(options.estimate);
  const scroller = useRef<HTMLElement | null>(null);
  const run = useRef<() => void>(() => undefined);

  const view = useCallback(() => {
    if (!element) return null;
    if (self) {
      const top =
        element.scrollTop -
        (parseFloat(getComputedStyle(element).paddingTop) || 0);
      return { top, bottom: top + element.clientHeight };
    }
    const box = element.getBoundingClientRect();
    const holder = scroller.current;
    const viewTop = holder
      ? holder.getBoundingClientRect().top + holder.clientTop
      : 0;
    const viewHeight = holder ? holder.clientHeight : window.innerHeight;
    return { top: viewTop - box.top, bottom: viewTop + viewHeight - box.top };
  }, [element, self]);

  useLayoutEffect(() => {
    if (!element) return;
    let frame = 0;
    let bound: HTMLElement | Window | null = null;
    const bind = () => {
      const next = self ? element : (scroller.current ?? window);
      if (next === bound) return;
      bound?.removeEventListener("scroll", schedule);
      bound = next;
      bound.addEventListener("scroll", schedule, { passive: true });
      if (scroller.current) sizes?.observe(scroller.current);
    };
    const compute = () => {
      frame = 0;
      if (!self && !scroller.current) {
        scroller.current = scrollParent(element);
        bind();
      }
      const { count: total, perRow: rowFor, overscan = 6 } = latest.current;
      const width = element.getBoundingClientRect().width;
      const perRow = rowFor ? Math.max(1, rowFor(width, element)) : 1;
      const rows = Math.ceil(total / perRow);
      const stride =
        strideRef.current > 0 ? strideRef.current : latest.current.estimate;
      let startRow = 0;
      let endRow = rows;
      const seen = total > drawAllUpTo ? view() : null;
      if (seen) {
        startRow = Math.min(
          rows,
          Math.max(0, Math.floor(seen.top / stride) - overscan),
        );
        endRow = Math.min(
          rows,
          Math.max(startRow, Math.ceil(seen.bottom / stride) + overscan),
        );
      }
      const now = state.current;
      if (
        now.ready &&
        now.perRow === perRow &&
        now.startRow === startRow &&
        now.endRow === endRow &&
        now.stride === stride
      )
        return;
      setShown({ perRow, startRow, endRow, stride, ready: true });
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(compute);
    }
    const sizes =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    sizes?.observe(element);
    if (!sizes) window.addEventListener("resize", schedule);
    scroller.current = self ? element : scrollParent(element);
    bind();
    run.current = compute;
    compute();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      bound?.removeEventListener("scroll", schedule);
      sizes?.disconnect();
      if (!sizes) window.removeEventListener("resize", schedule);
      run.current = () => undefined;
      scroller.current = null;
    };
  }, [element, self, view]);

  useLayoutEffect(() => {
    run.current();
  }, [count]);

  const estimate = options.estimate;
  const firstEstimate = useRef(estimate);
  useLayoutEffect(() => {
    if (firstEstimate.current === estimate) return;
    firstEstimate.current = estimate;
    strideRef.current = estimate;
    run.current();
  }, [estimate]);

  useLayoutEffect(() => {
    if (!element || !shown.ready || shown.endRow <= shown.startRow) return;
    const measured = latest.current.measure?.(element, shown.perRow);
    if (!measured || measured <= 0 || Math.abs(measured - shown.stride) < 0.5)
      return;
    strideRef.current = measured;
    run.current();
  }, [element, shown]);

  const rows = Math.ceil(count / shown.perRow);
  const all = count <= drawAllUpTo;
  const startRow = shown.ready && !all ? Math.min(shown.startRow, rows) : 0;
  const endRow = all
    ? rows
    : shown.ready
      ? Math.min(shown.endRow, rows)
      : Math.ceil(firstDraw / shown.perRow);
  const start = startRow * shown.perRow;
  const end = Math.min(count, endRow * shown.perRow);
  const before = startRow * shown.stride;
  const after = Math.max(0, rows - Math.max(endRow, startRow)) * shown.stride;

  /**
   * Scrolls the least distance that brings the item at `index` fully into view; false while it
   * can't yet (nothing laid out, or no such item).
   */
  const reveal = useCallback(
    (index: number) => {
      const now = state.current;
      if (!element || index < 0 || !now.ready) return false;
      const seen = view();
      if (!seen) return false;
      const top = Math.floor(index / now.perRow) * now.stride;
      const bottom = top + now.stride;
      const by =
        top < seen.top
          ? top - seen.top
          : bottom > seen.bottom
            ? bottom - seen.bottom
            : 0;
      if (!by) return true;
      const holder = self ? element : scroller.current;
      if (holder) holder.scrollTop += by;
      else window.scrollBy(0, by);
      return true;
    },
    [element, self, view],
  );

  return {
    ref: setElement,
    /** Items in a row as drawn, once the width is known; 0 before. */
    perRow: shown.ready ? shown.perRow : 0,
    /** Whether the view has been measured, so `reveal` can scroll. */
    ready: shown.ready,
    start,
    end,
    before,
    after,
    reveal,
  };
}

/**
 * Brings the item with id `reveal` into view each time `reveal` changes to a new id, since items
 * out of view aren't drawn and can't be scrolled to through the page.
 */
export function useRevealItem(
  reveal: string | undefined,
  items: ReadonlyArray<{ id: string }>,
  scrollTo: (index: number) => boolean,
  ready: boolean,
) {
  const last = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (reveal === last.current) return;
    if (reveal === undefined) {
      last.current = undefined;
      return;
    }
    if (ready && scrollTo(items.findIndex((item) => item.id === reveal)))
      last.current = reveal;
  }, [reveal, items, scrollTo, ready]);
}
