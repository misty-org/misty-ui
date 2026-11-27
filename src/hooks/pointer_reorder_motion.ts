/** Tab-only layout previews. Hit testing stays in layout coordinates while paint moves. */
const layouts = new WeakMap<
  HTMLElement,
  { rect: DOMRect; list: HTMLElement; x: number; y: number }
>();
let settleCurrent: (() => void) | undefined;
let hoveredItem: string | null = null;
export function settleReorderMotion() {
  settleCurrent?.();
}

/**
 * The tab a dragged tab will go into: the one its pointer has rested on for a moment. While the
 * pointer moves, tabs only slide apart to show where the drag will land; a pause on a tab's near
 * half joins it instead. It wears `data-reorder-target` while it is, and the page's root wears
 * `data-pointer-joining`, so the row and the dragged preview can show it.
 */
export function reorderHoveredItem(): string | null {
  return hoveredItem;
}

const timing = { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
const joinDelay = 450;
const joinSlack = 8;
const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function reorderLayoutRect(element: HTMLElement): DOMRect {
  const saved = layouts.get(element);
  if (!saved) return element.getBoundingClientRect();
  return new DOMRect(
    saved.rect.x + saved.x - saved.list.scrollLeft,
    saved.rect.y + saved.y - saved.list.scrollTop,
    saved.rect.width,
    saved.rect.height,
  );
}

export function startReorderMotion(surface: HTMLElement, ids: string[], axis: "x" | "y") {
  const list = surface.closest<HTMLElement>('[data-reorder-animated="true"]');
  if (!list) return;
  const listItems = () =>
    [...list.querySelectorAll<HTMLElement>("[data-reorder-item]")].filter(
      (item) => item.closest("[data-reorder-list]") === list,
    );
  let items = listItems();
  let moving = items.filter((item) => ids.includes(item.dataset.reorderItem!));
  const animations = new Map<HTMLElement, Animation>();
  const original = new Map(items.map((item) => [item, item.style.transform]));
  let lastOrder = items;
  let shown: { target: string; after: boolean } | undefined;
  const offsets = new Map<HTMLElement, number>();
  let finishFrame = 0;
  let settlingPreview: HTMLElement | undefined;
  let settlingAnimation: Animation | undefined;
  let joinTimer = 0;
  let joinCandidate: string | null = null;
  let joinPoint = { x: 0, y: 0 };
  let joined: string | null = null;
  const restore = () => {
    for (const item of items) {
      animations.get(item)?.cancel();
      item.style.transform = original.get(item) ?? "";
      layouts.delete(item);
      delete item.dataset.reorderLifted;
      delete item.dataset.reorderTarget;
    }
  };
  const markTarget = () => {
    for (const item of items) {
      const target = Boolean(hoveredItem) && item.dataset.reorderItem === hoveredItem;
      if (target) item.dataset.reorderTarget = "true";
      else delete item.dataset.reorderTarget;
    }
  };
  const setJoined = (next: string | null) => {
    joined = next;
    hoveredItem = next;
    markTarget();
    if (next) document.documentElement.dataset.pointerJoining = "true";
    else delete document.documentElement.dataset.pointerJoining;
  };
  const stopJoining = () => {
    window.clearTimeout(joinTimer);
    joinCandidate = null;
    if (joined) setJoined(null);
  };
  const cleanup = () => {
    cancelAnimationFrame(finishFrame);
    window.clearTimeout(joinTimer);
    delete document.documentElement.dataset.pointerJoining;
    settlingAnimation?.cancel();
    settlingPreview?.remove();
    restore();
    hoveredItem = null;
    if (settleCurrent === cleanup) settleCurrent = undefined;
  };
  settleCurrent = cleanup;
  const measure = () => {
    for (const item of items) {
      layouts.set(item, {
        rect: item.getBoundingClientRect(),
        list,
        x: list.scrollLeft,
        y: list.scrollTop,
      });
    }
    for (const item of moving) item.dataset.reorderLifted = "true";
  };
  measure();
  const sync = () => {
    const now = listItems();
    if (now.length === items.length && now.every((item, index) => item === items[index])) return;
    for (const item of items) {
      animations.get(item)?.cancel();
      item.style.transform = original.get(item) ?? "";
      layouts.delete(item);
    }
    for (const item of now) if (!original.has(item)) original.set(item, item.style.transform);
    items = now;
    moving = items.filter((item) => ids.includes(item.dataset.reorderItem!));
    measure();
    lastOrder = items;
    shown = undefined;
    offsets.clear();
  };
  const blockRect = () => {
    const rects = (moving.length ? moving : [surface]).map(reorderLayoutRect);
    const left = Math.min(...rects.map((rect) => rect.left));
    const top = Math.min(...rects.map((rect) => rect.top));
    return new DOMRect(
      left,
      top,
      Math.max(...rects.map((rect) => rect.right)) - left,
      Math.max(...rects.map((rect) => rect.bottom)) - top,
    );
  };
  const start = (rect: DOMRect) => (axis === "x" ? rect.left : rect.top);
  const size = (rect: DOMRect) => (axis === "x" ? rect.width : rect.height);
  const transform = (delta: number) =>
    axis === "x" ? `translateX(${delta}px)` : `translateY(${delta}px)`;
  const animate = (item: HTMLElement, from: string, to: string) => {
    animations.get(item)?.cancel();
    if (!reduceMotion() && item.animate && from !== to) {
      const animation = item.animate([{ transform: from }, { transform: to }], timing);
      animations.set(item, animation);
      animation.onfinish = () => {
        if (animations.get(item) === animation) animations.delete(item);
      };
    }
  };
  const orderFor = (target: string | undefined, after: boolean) => {
    if (!target || ids.includes(target)) return items;
    const rest = items.filter((item) => !moving.includes(item));
    const index = rest.findIndex((item) => item.dataset.reorderItem === target);
    if (index < 0) return items;
    const insertion = index + (after ? 1 : 0);
    return [...rest.slice(0, insertion), ...moving, ...rest.slice(insertion)];
  };
  const id = (item: HTMLElement | undefined) => item?.dataset.reorderItem;
  const paint = (order: HTMLElement[]) => {
    if (order.every((item, index) => item === lastOrder[index])) return;
    lastOrder = order;
    const at = order.indexOf(moving[0]);
    const next = id(order[at + moving.length]);
    const previous = id(order[at - 1]);
    shown = order.every((item, index) => item === items[index])
      ? undefined
      : next
        ? { target: next, after: false }
        : previous
          ? { target: previous, after: true }
          : undefined;
    const gap =
      Number.parseFloat(getComputedStyle(list)[axis === "x" ? "columnGap" : "rowGap"]) || 0;
    const margins = (item: HTMLElement) => {
      const style = getComputedStyle(item);
      return [
        Number.parseFloat(style[axis === "x" ? "marginLeft" : "marginTop"]) || 0,
        Number.parseFloat(style[axis === "x" ? "marginRight" : "marginBottom"]) || 0,
      ];
    };
    let cursor = start(reorderLayoutRect(items[0])) - margins(items[0])[0];
    for (const item of order) {
      const [leading, trailing] = margins(item);
      cursor += leading;
      const rect = reorderLayoutRect(item);
      const delta = cursor - start(rect);
      offsets.set(item, delta);
      const painted = getComputedStyle(item).transform;
      const next = transform(delta);
      item.style.transform = next;
      animate(item, painted === "none" ? transform(0) : painted, next);
      cursor += size(rect) + trailing + gap;
    }
  };
  return {
    list,
    placement(point: { x: number; y: number }, offset: { x: number; y: number }) {
      const bounds = list.getBoundingClientRect();
      const source = blockRect();
      const horizontal = axis === "x";
      const along = horizontal ? point.x : point.y;
      const across = horizontal ? point.y : point.x;
      const crossMin = horizontal ? bounds.top : bounds.left;
      const crossMax = horizontal ? bounds.bottom : bounds.right;
      if (across < crossMin - 40 || across > crossMax + 40) return;
      const first = reorderLayoutRect(items[0]);
      const last = reorderLayoutRect(items[items.length - 1]);
      const edge = Math.max(
        start(first),
        Math.min(
          along - (horizontal ? offset.x : offset.y),
          start(last) + size(last) - size(source),
        ),
      );
      const left = horizontal ? edge : source.left;
      const top = horizontal ? source.top : edge;
      const travel = edge - start(source);
      const hit =
        edge <= start(first)
          ? start(first)
          : edge >= start(last) + size(last) - size(source)
            ? start(last) + size(last)
            : travel > 0
              ? edge + size(source) - 0.5
              : travel < 0
                ? edge + 0.5
                : edge + size(source) / 2;
      return {
        left,
        top,
        hitX: horizontal ? hit : left + source.width / 2,
        hitY: horizontal ? top + source.height / 2 : hit,
      };
    },
    follow(target: string | undefined, _after: boolean, point: { x: number; y: number }) {
      sync();
      const along = axis === "x" ? point.x : point.y;
      const across = axis === "x" ? point.y : point.x;
      const rest = lastOrder.filter((item) => !moving.includes(item));
      const shownAt = (item: HTMLElement) => {
        const rect = reorderLayoutRect(item);
        const from = start(rect) + (offsets.get(item) ?? 0);
        return { from, to: from + size(rect), rect };
      };
      const over = (item: HTMLElement) => {
        const { from, to, rect } = shownAt(item);
        const [low, high] = axis === "x" ? [rect.top, rect.bottom] : [rect.left, rect.right];
        return along >= from && along <= to && across >= low - 40 && across <= high + 40;
      };
      if (target === undefined) {
        stopJoining();
        paint(items);
        return;
      }
      if (joined) {
        const held = rest.find((item) => id(item) === joined);
        if (held && over(held)) return;
        setJoined(null);
      }
      const middle = (item: HTMLElement) => {
        const { from, to } = shownAt(item);
        return (from + to) / 2;
      };
      let at = lastOrder.indexOf(moving[0]);
      while (at < rest.length && along > middle(rest[at])) at++;
      while (at > 0 && along < middle(rest[at - 1])) at--;
      paint([...rest.slice(0, at), ...moving, ...rest.slice(at)]);
      const candidate = id(rest.find(over)) ?? null;
      const moved = Math.hypot(point.x - joinPoint.x, point.y - joinPoint.y) > joinSlack;
      if (candidate !== joinCandidate || moved) {
        window.clearTimeout(joinTimer);
        joinCandidate = candidate;
        joinPoint = point;
        if (candidate) joinTimer = window.setTimeout(() => setJoined(candidate), joinDelay);
      }
    },
    dropAt(): { target: string; after: boolean; onto?: boolean } | undefined {
      return hoveredItem ? { target: hoveredItem, after: false, onto: true } : shown;
    },
    update(target?: string, after = false) {
      paint(orderFor(target, after));
    },
    finish(preview?: HTMLElement) {
      const painted = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
      const previewRect = preview?.getBoundingClientRect();
      settlingPreview = preview;
      finishFrame = requestAnimationFrame(() => {
        restore();
        for (const item of items) {
          if (!item.isConnected) continue;
          const before = moving.includes(item) ? undefined : painted.get(item);
          if (!before) continue;
          const delta = start(before) - start(item.getBoundingClientRect());
          animate(item, transform(delta), original.get(item) || transform(0));
        }
        const destination = surface.isConnected ? surface.getBoundingClientRect() : undefined;
        if (preview && previewRect && destination && !reduceMotion() && preview.animate) {
          for (const item of moving) item.dataset.reorderLifted = "true";
          const animation = preview.animate(
            [
              { transform: "translate(0, 0)" },
              {
                transform: `translate(${destination.left - previewRect.left}px, ${destination.top - previewRect.top}px)`,
              },
            ],
            timing,
          );
          const done = () => {
            preview.remove();
            for (const item of moving) delete item.dataset.reorderLifted;
          };
          settlingAnimation = animation;
          animation.onfinish = done;
          animation.oncancel = done;
        } else preview?.remove();
      });
    },
  };
}
