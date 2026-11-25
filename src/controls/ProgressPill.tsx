import * as React from "react";

import { cn } from "../class_names";
import { controlFrame } from "./control_frame";
import { useCompactControls } from "./RowContext";

const padding = { sm: "px-2", md: "px-3", lg: "px-4" } as const;

/**
 * A store item's one action while what it gets downloads (Get, Update), standing in the button's
 * place: the same frame, size and width (`widthOf`, the labels the button shows), so nothing beside
 * it shifts. The Get look fills it from the start as the download goes, with how far it has got as
 * its label ("42%"), the label turning dark where the fill has reached it. It is no button: it
 * can't be pressed, and it holds no spinner. With no `value` (the size isn't known yet) it is the
 * whole Get fill, breathing, until it is; a caller that knows nothing has arrived yet passes 0.
 * Neutral, as every store action is. `label` names it for assistive technology ("Downloading
 * Voicebox").
 *
 * ```tsx
 * <ProgressPill value={0.42} label="Downloading Voicebox" widthOf={["Get", "Manage", "Update", "Open"]} />
 * ```
 */
export function ProgressPill({
  value,
  label,
  size = "md",
  widthOf,
}: {
  /** How far it has got, 0 to 1; left out while that isn't known. */
  value?: number;
  /** What is happening, for assistive technology. */
  label: string;
  /** The size of the button it stands in for: sm 27, md 36, lg 40.5. */
  size?: "sm" | "md" | "lg";
  /** Every label the button it stands in for shows, so the pill keeps that button's width. */
  widthOf?: readonly string[];
}) {
  const compact = useCompactControls();
  const resolvedSize = compact ? "sm" : size;
  const known = value !== undefined && Number.isFinite(value);
  const percent = known ? Math.round(Math.min(1, Math.max(0, value)) * 100) : 0;
  const shown = known ? `${percent}%` : "";
  const text = (
    <span className="grid justify-items-center">
      {(widthOf ?? []).map((each) => (
        <span key={each} aria-hidden="true" className="invisible col-start-1 row-start-1">
          {each}
        </span>
      ))}
      <span className="col-start-1 row-start-1 tabular-nums">{shown}</span>
    </span>
  );
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={known ? percent : undefined}
      data-slot="progress-pill"
      data-size={resolvedSize}
      className={cn(
        "relative inline-flex shrink-0 cursor-default items-center justify-center overflow-hidden",
        "bg-control-hover text-control font-medium whitespace-nowrap text-cream-bright select-none",
        controlFrame[resolvedSize],
        padding[resolvedSize],
        !known && "animate-[misty-breathe_1.6s_ease-in-out_infinite] motion-reduce:animate-none",
      )}
    >
      {text}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 inline-flex items-center justify-center",
          "bg-cream-bright text-charcoal-bg transition-[clip-path] duration-200 ease-out",
          padding[resolvedSize],
        )}
        style={{ clipPath: `inset(0 ${known ? 100 - percent : 0}% 0 0)` }}
      >
        {text}
      </span>
    </span>
  );
}
