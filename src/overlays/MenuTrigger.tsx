import * as React from "react";
import { Button, type ButtonIcon, type ButtonProps } from "../controls/Button";
import { IconButton, type IconButtonProps } from "../controls/IconButton";
import { Pressable } from "../controls/Pressable";
import { cn } from "../class_names";
import { Text } from "../display/Text";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import { MenuChevron } from "./MenuChevron";
import { MenuIconSlot } from "./MenuItem";
import { DropdownMenuTrigger } from "./DropdownMenu";
import { PopoverTrigger } from "./Popover";

type MenuTriggerProps = Omit<
  ButtonProps,
  "asChild" | "size" | "children" | "value" | "variant" | "icon" | "iconEnd" | "title"
> & {
  /** Accessible name and tooltip; also the visible text unless `value` is given. */
  label: string;
  /** An 18px glyph: a Lucide icon (`icon={Settings}`) or an element. */
  icon?: ButtonIcon;
  /** Current selection shown in place of the label, e.g. a picked model. It fades when long. */
  value?: React.ReactNode;
  /** Just the icon, as a toolbar button; `label` becomes its tooltip. */
  iconOnly?: boolean;
  /**
   * The chevron that turns over while open. On by default for labeled triggers; icon-only ones
   * turn it on where the menu holds a choice rather than actions.
   */
  chevron?: boolean;
  /** The command's shortcut, shown in the tooltip while shortcut hints are on (icon-only). */
  shortcut?: string;
  /** Opens a DropdownMenu by default; "popover" for a Popover with rich content. */
  kind?: "menu" | "popover";
  /** Defaults to quiet. */
  variant?: IconButtonProps["variant"];
  /** sm 27 or md 36 (the default), so a trigger matches the row it sits in. */
  size?: IconButtonProps["size"];
  /**
   * Quiet text instead of a button, for a value at the end of a row that opens its menu (the
   * session card's folder): caption size and muted, with no box and no fill, brightening under
   * the pointer and while open. Takes no icon or chevron.
   */
  plain?: boolean;
  /**
   * Shows the whole value, never fading it, for a title whose length is capped where it is typed
   * (a Space's name). Its neighbours give way instead.
   */
  fit?: boolean;
  /**
   * The name of a place that opens its menu, set as a name rather than a control: a sidebar's
   * Space, a docs site's section, a channel column's place. Semibold and bright, with `mark` before
   * it and the chevron right after, as one compact button only as wide as what it holds. The name
   * is shown whole, never faded: a long one wraps onto a second line. It stands alone in its row;
   * the place's actions (Invite people) live in its menu.
   */
  heading?: boolean;
  /** With `heading`: the place's own mark before the name, such as the Space's avatar. */
  mark?: React.ReactNode;
};

/**
 * The one button that opens a DropdownMenu, or a Popover with kind="popover": a labeled button,
 * an icon (`iconOnly`), quiet text at a row's end (`plain`) or a place's name (`heading`, the
 * sidebar's Space). Labeled triggers end in the MenuChevron unless `chevron={false}`. Features
 * never draw their own; a field that picks a value is Select instead.
 *
 * ```tsx
 * <DropdownMenu>
 *   <MenuTrigger label="Model" value={model.name} icon={Cpu} />
 *   <DropdownMenuContent>…</DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  (
    {
      label,
      icon,
      value,
      iconOnly = false,
      chevron,
      shortcut,
      variant,
      className,
      kind = "menu",
      size,
      plain = false,
      fit = false,
      heading = false,
      mark,
      ...props
    },
    ref,
  ) => {
    const Trigger = kind === "popover" ? PopoverTrigger : DropdownMenuTrigger;
    if (plain) {
      const { justify: _justify, ...rest } = props;
      return (
        <Trigger asChild>
          <Pressable
            ref={ref}
            wash="text"
            aria-label={value === undefined ? undefined : label}
            className={cn(
              "inline-flex min-w-0 max-w-full items-center rounded-md px-0.5",
              "text-meta font-normal whitespace-nowrap text-cream",
              "data-[state=open]:text-cream-bright",
              className,
            )}
            {...rest}
          >
            <OverflowFadeText full>{value ?? label}</OverflowFadeText>
          </Pressable>
        </Trigger>
      );
    }
    if (heading) {
      const { justify: _justify, ...rest } = props;
      return (
        <Trigger asChild>
          <Pressable
            ref={ref}
            type="button"
            wash="control"
            data-slot="menu-trigger-heading"
            aria-label={value === undefined ? undefined : label}
            className={cn(
              "inline-flex min-h-8 w-fit max-w-full min-w-0 flex-none items-center gap-1 rounded-md px-2 py-1",
              "text-left data-[state=open]:bg-control-active",
              className,
            )}
            {...rest}
          >
            {mark ? <span className="mr-1 grid size-4 flex-none place-items-center">{mark}</span> : null}
            <Text tone="bright" size="body" weight="semibold" wrap className="min-w-0 break-words">
              {value ?? label}
            </Text>
            <MenuChevron />
          </Pressable>
        </Trigger>
      );
    }
    if (iconOnly) {
      const withChevron = chevron ?? false;
      return (
        <Trigger asChild>
          <IconButton
            ref={ref}
            label={label}
            shortcut={shortcut}
            size={size}
            variant={variant ?? "quiet"}
            className={cn(withChevron && "w-auto min-w-fit gap-0.5 px-1", className)}
            {...props}
          >
            <MenuIconSlot icon={icon} />
            {withChevron && <MenuChevron />}
          </IconButton>
        </Trigger>
      );
    }
    const withChevron = chevron ?? true;
    return (
      <Trigger asChild>
        <Button
          ref={ref}
          type="button"
          variant={(variant === "overlay" ? "quiet" : variant) ?? "quiet"}
          size={size ?? "md"}
          icon={icon}
          aria-label={value === undefined ? undefined : label}
          className={cn(
            fit ? "shrink-0 gap-1.5" : "min-w-0 gap-1.5",
            className,
          )}
          {...props}
        >
          {fit ? (
            <span className="whitespace-nowrap">{value ?? label}</span>
          ) : (
            <OverflowFadeText full>{value ?? label}</OverflowFadeText>
          )}
          {withChevron && <MenuChevron />}
        </Button>
      </Trigger>
    );
  },
);
MenuTrigger.displayName = "MenuTrigger";

export { MenuTrigger };
export type { MenuTriggerProps };
