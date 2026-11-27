export interface PointerSpot {
  x: number;
  y: number;
}

export interface PointerPath {
  ms: number;
  at(progress: number): PointerSpot;
}

const TARGET = 24;
const SHORTEST_MS = 160;
const LONGEST_MS = 720;
const FOLLOW_MS = 75;
const OVERSHOOT_FROM = 260;

const reduced = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const minimumJerk = (k: number) => k * k * k * (10 - 15 * k + 6 * k * k);

const easeOut = (k: number) => 1 - (1 - k) * (1 - k);

const lerp = (a: PointerSpot, b: PointerSpot, k: number): PointerSpot => ({
  x: a.x + (b.x - a.x) * k,
  y: a.y + (b.y - a.y) * k,
});

const cubic = (
  p0: PointerSpot,
  p1: PointerSpot,
  p2: PointerSpot,
  p3: PointerSpot,
  k: number,
) => {
  const u = 1 - k;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * k * p1.x +
      3 * u * k * k * p2.x +
      k * k * k * p3.x,
    y:
      u * u * u * p0.y +
      3 * u * u * k * p1.y +
      3 * u * k * k * p2.y +
      k * k * k * p3.y,
  };
};

/**
 * How long a pointer takes to reach a spot `distance` pixels away, as a hand does: Fitts's law,
 * longer for farther, from 160 to 720ms, and 0 when the person asked for reduced motion. Whoever
 * moves an agent's `LivePointer` waits this long before acting, so the click lands as it arrives.
 */
export function pointerTravelMs(distance: number): number {
  if (!(distance >= 1) || reduced()) return 0;
  const ms = 140 + 120 * Math.log2(distance / TARGET + 1);
  return Math.round(Math.min(Math.max(ms, SHORTEST_MS), LONGEST_MS));
}

/**
 * The way a pointer moves from one spot to another, after ghost-cursor and WindMouse: a gentle
 * curve bent to one side, slow to start, quick through the middle and slow to arrive (minimum
 * jerk), and on a long move a small overshoot that comes back to the spot. `follow` is for a
 * pointer streamed as someone moves it, which glides straight and quickly instead.
 */
export function pointerPath(
  from: PointerSpot,
  to: PointerSpot,
  follow = false,
): PointerPath | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1 || reduced()) return null;
  if (follow || distance < TARGET / 2)
    return {
      ms: FOLLOW_MS,
      at: (k) => lerp(from, to, Math.min(Math.max(k, 0), 1)),
    };
  const ms = pointerTravelMs(distance);
  const along = { x: dx / distance, y: dy / distance };
  const across = { x: -along.y, y: along.x };
  const side = Math.random() < 0.5 ? -1 : 1;
  const bend = side * distance * (0.06 + Math.random() * 0.1);
  const overshoot =
    distance >= OVERSHOOT_FROM ? Math.min(14, distance * 0.03) : 0;
  const reach = {
    x: to.x + along.x * overshoot,
    y: to.y + along.y * overshoot,
  };
  const p1 = {
    x: from.x + dx * 0.3 + across.x * bend,
    y: from.y + dy * 0.3 + across.y * bend,
  };
  const p2 = {
    x: from.x + dx * 0.75 + across.x * bend * 0.5,
    y: from.y + dy * 0.75 + across.y * bend * 0.5,
  };
  const main = overshoot ? 0.85 : 1;
  return {
    ms,
    at: (progress) => {
      const k = Math.min(Math.max(progress, 0), 1);
      if (k <= main) return cubic(from, p1, p2, reach, minimumJerk(k / main));
      return lerp(reach, to, easeOut((k - main) / (1 - main)));
    },
  };
}
