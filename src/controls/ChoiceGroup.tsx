import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../class_names";
import { controlFrame } from "./control_frame";
import { renderIcon, type IconSource } from "../layout/ActionBar";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import { Tooltip } from "../overlays/Tooltip";

export type ChoiceGroupOption<T extends string> = {
  value: T;
  /** Shown as the text, or as the tooltip and accessible name when `iconOnly`. */
  label: string;
  icon?: IconSource;
  /** Shows only the icon; the label becomes its tooltip. Needs `icon`. */
  iconOnly?: boolean;
  disabled?: boolean;
  /** Why a disabled option can't be chosen, shown in its tooltip. */
  reason?: string;
  /**
   * The shortcut that picks it, as it reads ("⌘1"), shown after the label in its tooltip while
   * shortcut hints are on. A text option with a shortcut gets a tooltip for it.
   */
  shortcut?: string;
};

export type ChoiceGroupProps<T extends string> = {
  /** Accessible name of the group. */
  label: string;
  value: T;
  options: ReadonlyArray<ChoiceGroupOption<T>>;
  onChange: (value: T) => void;
  /** sm 27, md 36 (default). The track is inside that height. */
  size?: "sm" | "md";
  disabled?: boolean;
  /** Stretch the options to fill the row in equal parts; long labels then fade. */
  fill?: boolean;
  /**
   * The track's look: `outline` (default) is a hairline around the sidebar's fill, the options
   * inset in it. `well` is a faint wash with no edge or inset and 2.25px between the options, the
   * chosen option a stronger wash
   * filling its whole height with the track's own corners, and every icon in the text color: the
   * sidebar's Personal/Spaces switch.
   */
  track?: "outline" | "well";
  /** Layout only: margins or alignment. */
  className?: string;
};

const trackSize = controlFrame;

const itemSize = {
  sm: "rounded-sm px-2",
  md: "rounded-md px-2.5",
} as const;

const iconOnlySize = { sm: "w-5 px-0", md: "w-7 px-0" } as const;

const wellItemSize = { sm: "rounded-md px-2", md: "rounded-lg px-3" } as const;
const wellIconOnlySize = { sm: "w-8 px-0", md: "w-10 px-0" } as const;

/**
 * The one segmented control: mutually exclusive choices on a track, such as a view mode or
 * Month/Agenda. It is a radio group, so the chosen option is the tab stop and arrow keys, Home and
 * End move the choice. The whole control, track included, is one control height, so it lines up
 * with buttons in the same row.
 *
 * ```tsx
 * <ChoiceGroup label="Calendar view" value={view} onChange={setView}
 *   options={[{ value: "month", label: "Month" }, { value: "agenda", label: "Agenda" }]} />
 * ```
 */
export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "md",
  disabled,
  fill = false,
  track = "outline",
  className,
}: ChoiceGroupProps<T>) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      disabled={disabled}
      orientation="horizontal"
      aria-label={label}
      data-slot="choice-group"
      data-size={size}
      className={cn(
        "flex min-w-0 shrink-0 items-stretch",
        track === "well"
          ? "gap-0.5 bg-row-hover"
          : "gap-0.5 border border-charcoal-border bg-charcoal-sidebar p-0.5",
        trackSize[size],
        fill ? "w-full" : "w-fit",
        disabled && "opacity-50",
        className,
      )}
      onValueChange={(next) => onChange(next as T)}
      onKeyDown={(event) => {
        if (disabled || (event.key !== "Home" && event.key !== "End")) return;
        const available = options.filter((option) => !option.disabled);
        const edge = event.key === "Home" ? available[0] : available[available.length - 1];
        if (edge && edge.value !== value) onChange(edge.value);
      }}
    >
      {options.map((option) => {
        const iconOnly = Boolean(option.iconOnly && option.icon);
        const item = (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            aria-label={iconOnly ? option.label : undefined}
            className={cn(
              "inline-flex min-w-0 items-center justify-center gap-1.5 leading-none whitespace-nowrap",
              "cursor-pointer text-control font-medium outline-none select-none",
              track === "well" ? "text-cream" : "text-cream-muted",
              "hover:bg-control-hover hover:text-cream",
              "focus-visible:bg-control-hover focus-visible:text-cream",
              "aria-checked:bg-control-active aria-checked:text-cream-bright",
              "aria-checked:hover:bg-control-active",
              "disabled:pointer-events-none disabled:opacity-50",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              track === "well" ? wellItemSize[size] : itemSize[size],
              iconOnly && (track === "well" ? wellIconOnlySize[size] : iconOnlySize[size]),
              fill && !iconOnly && "flex-1 basis-0",
            )}
          >
            {renderIcon(option.icon)}
            {iconOnly ? null : <OverflowFadeText>{option.label}</OverflowFadeText>}
          </RadioGroupPrimitive.Item>
        );
        if (option.disabled && option.reason)
          return (
            <Tooltip key={option.value} content={option.reason}>
              <span className={cn("flex min-w-0 cursor-not-allowed", fill && !iconOnly && "flex-1 basis-0")}>
                {item}
              </span>
            </Tooltip>
          );
        if (iconOnly || option.shortcut)
          return (
            <Tooltip key={option.value} content={option.label} shortcut={option.shortcut}>
              {item}
            </Tooltip>
          );
        return item;
      })}
    </RadioGroupPrimitive.Root>
  );
}
