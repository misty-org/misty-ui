import * as React from "react";
import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";
import { IndicatorDot } from "../display/IndicatorDot";
import { Tooltip } from "../overlays/Tooltip";

/** One side of a `PlaceSwitch`: Personal or the shared Spaces. */
export type PlaceSwitchOption<T extends string> = {
  value: T;
  /** Its tooltip and accessible name ("Personal", "Shared Spaces"). */
  label: string;
  /** Its glyph. */
  icon: React.ReactNode;
  /** Something waits on the person on this side: an amber dot on it while the other is open. */
  waiting?: boolean;
};

/**
 * Which half of Misty the window shows, Personal or the shared Spaces, as two icon buttons on one
 * faint track at the end of the sidebar's title bar, after Back and Forward. The open side is
 * filled and bright; the other is muted and carries an amber dot while something there waits on
 * the person, so nothing on the closed side goes unseen. It is a radio group: arrow keys move the
 * choice. The shared Spaces themselves are picked in the `SpaceDock`.
 */
export function PlaceSwitch<T extends string>(props: {
  label: string;
  value: T;
  options: [PlaceSwitchOption<T>, PlaceSwitchOption<T>];
  onChange(value: T): void;
  className?: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const index = props.options.findIndex((option) => option.value === props.value);
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      data-slot="place-switch"
      className={cn("flex flex-none gap-0.5 rounded-lg bg-row-hover p-0.5", props.className)}
    >
      {props.options.map((option, at) => {
        const on = option.value === props.value;
        return (
          <Tooltip key={option.value} content={option.label}>
            <Pressable
              ref={(node) => {
                refs.current[at] = node;
              }}
              role="radio"
              aria-checked={on}
              aria-label={option.waiting && !on ? `${option.label}, waiting for you` : option.label}
              tabIndex={on || (index < 0 && at === 0) ? 0 : -1}
              onClick={() => props.onChange(option.value)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key))
                  return;
                event.preventDefault();
                const next = props.options[at === 0 ? 1 : 0];
                props.onChange(next.value);
                refs.current[at === 0 ? 1 : 0]?.focus();
              }}
              className={cn(
                "relative grid h-7 w-8 place-items-center rounded-md text-cream-muted",
                "hover:text-cream-bright",
                "aria-checked:bg-control-active aria-checked:text-cream-bright",
              )}
            >
              {option.icon}
              {option.waiting && !on ? (
                <IndicatorDot state="waiting" ring="chrome" className="top-0.5 right-1 size-1.5" />
              ) : null}
            </Pressable>
          </Tooltip>
        );
      })}
    </div>
  );
}
