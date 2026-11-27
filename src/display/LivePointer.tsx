import { MousePointer2 } from "lucide-react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../class_names";
import type { ItemTone } from "../icons/item_tones";
import { pointerPath, type PointerSpot } from "./pointer_motion";
import { Text } from "./Text";

const STREAMED_MS = 120;
const STREAMED_PX = 48;

const placed = (spot: PointerSpot) => `translate(${spot.x}px, ${spot.y}px)`;

/** A tone as the pointer's fill and its name tag's, written out so Tailwind keeps the classes. */
const pointerTone: Record<ItemTone, { glyph: string; tag: string }> = {
  blue: { glyph: "text-tone-blue fill-tone-blue", tag: "bg-tone-blue" },
  red: { glyph: "text-tone-red fill-tone-red", tag: "bg-tone-red" },
  green: { glyph: "text-tone-green fill-tone-green", tag: "bg-tone-green" },
  orange: { glyph: "text-tone-orange fill-tone-orange", tag: "bg-tone-orange" },
  violet: { glyph: "text-tone-violet fill-tone-violet", tag: "bg-tone-violet" },
  pink: { glyph: "text-tone-pink fill-tone-pink", tag: "bg-tone-pink" },
  amber: { glyph: "text-tone-amber fill-tone-amber", tag: "bg-tone-amber" },
  teal: { glyph: "text-tone-teal fill-tone-teal", tag: "bg-tone-teal" },
  sand: { glyph: "text-tone-sand fill-tone-sand", tag: "bg-tone-sand" },
};

/**
 * Someone else's pointer over a page people work on together, with their name, in their tone (the
 * same one as their avatar). It's placed by its parent, at `left` and `top` in pixels. A pointer
 * told where to be in quick small steps (a person's, streamed as they move it) follows them
 * straight; one sent to a new spot (an agent's, heading for what it acts on) moves there as a hand
 * does, curving a little, slow to start and slow to arrive, overshooting a long move by a touch
 * (`pointerPath`), so whoever drives it waits `pointerTravelMs` before acting. With reduced motion
 * it jumps. `doing` adds a line under the name saying what they are doing there now, such as an
 * agent's "Insert › Picture from File", fading when long; leave it off when the pointer itself
 * says enough. `face` puts their face at the start of the tag, at the glyph size (an `Avatar` or
 * `AgentFace` with `size="glyph"`), so an agent's pointer wears the face it has everywhere else.
 */
export function LivePointer({
  name,
  tone,
  left,
  top,
  doing,
  face,
}: {
  name: string;
  tone: ItemTone;
  left: number;
  top: number;
  doing?: string;
  face?: ReactNode;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const at = useRef<PointerSpot | null>(null);
  const told = useRef(0);
  const [first] = useState(() => placed({ x: left, y: top }));

  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const to = { x: left, y: top };
    const from = at.current;
    const now = performance.now();
    const quick = now - told.current < STREAMED_MS;
    told.current = now;
    const put = (spot: PointerSpot) => {
      at.current = spot;
      element.style.transform = placed(spot);
    };
    const near = from
      ? Math.hypot(to.x - from.x, to.y - from.y) < STREAMED_PX
      : true;
    const path = from ? pointerPath(from, to, quick && near) : null;
    if (!path) {
      put(to);
      return;
    }
    const start = now;
    let frame = window.requestAnimationFrame(function step(time) {
      const progress = path.ms ? (time - start) / path.ms : 1;
      put(path.at(progress));
      if (progress < 1) frame = window.requestAnimationFrame(step);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [left, top]);

  return (
    <span
      ref={box}
      className="absolute top-0 left-0 flex items-start will-change-transform"
      style={{ transform: first }}
      aria-hidden="true"
    >
      <MousePointer2 className={pointerTone[tone].glyph} />
      <span
        className={cn(
          "mt-3.5 -ml-1 flex max-w-60 items-center gap-1 rounded-sm px-1.5 text-ink-on-color",
          face && "py-0.5 pl-0.5",
          pointerTone[tone].tag,
        )}
      >
        {face}
        <span className="flex min-w-0 flex-col">
          <Text bare size="caption" weight="medium">
            {name}
          </Text>
          {doing ? <Text size="caption">{doing}</Text> : null}
        </span>
      </span>
    </span>
  );
}
