import type { KeyboardEvent, PointerEvent } from "react";
import { designPx } from "../lib/ui_scale";

const KEY_STEP = 16;

export function ColumnSeam(props: {
  side: "start" | "end";
  label: string;
  width: number;
  min: number;
  max: number;
  reset: number;
  onResize(width: number, save: boolean): void;
  onDragging(dragging: boolean): void;
}) {
  const sign = props.side === "start" ? 1 : -1;
  const { min } = props;
  const most = Math.max(min, props.max);
  const clamp = (value: number) => Math.round(Math.min(Math.max(value, min), most));
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    const startX = event.clientX;
    const startWidth = props.width;
    const { onResize, onDragging } = props;
    let last = startWidth;
    let moved = false;
    let done = false;
    handle.setPointerCapture(event.pointerId);
    handle.dataset.dragging = "";
    onDragging(true);
    const move = (next: globalThis.PointerEvent) => {
      const width = clamp(startWidth + sign * designPx(next.clientX - startX));
      if (width === last && !moved) return;
      moved = true;
      last = width;
      onResize(width, false);
    };
    const end = () => {
      if (done) return;
      done = true;
      delete handle.dataset.dragging;
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
      handle.removeEventListener("lostpointercapture", end);
      onDragging(false);
      if (moved) onResize(last, true);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
    handle.addEventListener("lostpointercapture", end);
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | undefined;
    if (event.key === "ArrowRight") next = props.width + sign * KEY_STEP;
    else if (event.key === "ArrowLeft") next = props.width - sign * KEY_STEP;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = most;
    if (next === undefined) return;
    event.preventDefault();
    props.onResize(clamp(next), true);
  };
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={props.label}
      aria-valuenow={Math.round(props.width)}
      aria-valuemin={Math.round(min)}
      aria-valuemax={Math.round(most)}
      tabIndex={0}
      data-slot="column-seam"
      className={[
        "relative z-(--stack-float) w-px shrink-0 cursor-col-resize touch-none",
        "bg-charcoal-border transition-colors",
        "hover:bg-charcoal-border-strong focus-visible:bg-charcoal-border-strong",
        "data-[dragging]:bg-charcoal-border-strong",
        "before:absolute before:inset-y-0 before:-inset-x-1 before:content-['']",
      ].join(" ")}
      onPointerDown={drag}
      onKeyDown={keys}
      onDoubleClick={() => props.onResize(props.reset, true)}
    />
  );
}
