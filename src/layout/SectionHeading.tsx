import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../class_names";
import { Button } from "../controls/Button";
import { IconButton } from "../controls/IconButton";
import { Pressable } from "../controls/Pressable";
import { DropdownMenu, DropdownMenuContent } from "../overlays/DropdownMenu";
import { FoldChevron } from "../overlays/MenuChevron";
import { MenuTrigger } from "../overlays/MenuTrigger";
import { OverflowFadeText } from "./OverflowFadeText";

/**
 * A section heading's one action. With `icon` and no `showLabel` it is a 27px quiet IconButton
 * whose label is its tooltip; with `showLabel` (or no icon) a 27px quiet Button. With `menu` it
 * opens those MenuItem rows instead of calling `onSelect`.
 */
export type SectionHeadingAction = {
  label: string;
  icon?: LucideIcon;
  /** Shows the label beside the icon. Without an icon the label always shows. */
  showLabel?: boolean;
  onSelect?: () => void;
  /** MenuItem rows the action opens, such as the kinds of chat to start. */
  menu?: React.ReactNode;
  disabled?: boolean;
};

export type SectionHeadingProps = {
  title: string;
  /** A count after the title, in its type, such as the number of chats in the section. */
  count?: number;
  action?: SectionHeadingAction;
  /**
   * Makes the title a fold button with a chevron. Controlled: pass both, and render the section's
   * content only while `open`.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The id of the content the fold shows and hides. */
  controls?: string;
  /** The heading level. Defaults to h2. */
  as?: "h2" | "h3";
  /**
   * The title bright and semibold instead of muted, as a file manager's sidebar sections (Kura's
   * Quick access, Tags, Devices), where the heading leads its rows rather than sitting back.
   */
  strong?: boolean;
  /**
   * `row` (the default) is a 36px heading aligned with the rows under it, for the sidebar and
   * lists of bare rows. `label` sits tight over a RowGroup, set just inside the group's edge so it
   * starts on the same line as the page's title (RowGroupLabel is this).
   */
  kind?: "row" | "label";
  id?: string;
  /** Layout only: margins or placement. */
  className?: string;
};

/**
 * The heading over a group of rows: a Space home section, the sidebar's chat sections, a chat's
 * Channels and Direct messages. Plain muted text, not a chip, 36px tall and aligned with the rows
 * under it (or, with `kind="label"`, tight over a RowGroup), with an optional count, one action at the right end and an optional fold: the title
 * and its FoldChevron brighten under the pointer, with no wash, as a sidebar group's heading does.
 *
 * ```tsx
 * <SectionHeading title="Channels" count={channels.length} open={open} onOpenChange={setOpen}
 *   controls="channels" action={{ label: "New channel", icon: Plus, onSelect: create }} />
 * ```
 */
export function SectionHeading({
  title,
  count,
  action,
  open,
  onOpenChange,
  controls,
  as: Heading = "h2",
  strong = false,
  kind = "row",
  id,
  className,
}: SectionHeadingProps) {
  const folds = open !== undefined && onOpenChange !== undefined;
  const words = (
    <>
      <OverflowFadeText full className="min-w-0">
        {title}
      </OverflowFadeText>
      {count !== undefined ? " " : null}
      {count !== undefined ? (
        <span className="shrink-0 tabular-nums">{count}</span>
      ) : null}
    </>
  );
  return (
    <div
      data-slot="section-heading"
      data-kind={kind}
      className={cn(
        "flex min-w-0 items-center gap-2",
        kind === "label" ? "min-h-6 px-0.5" : "h-8 px-2",
        className,
      )}
    >
      <Heading
        id={id}
        className={cn(
          "m-0 flex min-w-0 flex-1 text-meta",
          strong ? "font-semibold text-cream-bright" : "font-medium text-cream-muted",
        )}
      >
        {folds ? (
          <Pressable
            type="button"
            aria-expanded={open}
            aria-controls={controls}
            onClick={() => onOpenChange(!open)}
            className={cn(
              "flex min-w-0 max-w-full items-center gap-1 rounded-md text-left",
              "hover:text-cream-bright focus-visible:text-cream-bright",
            )}
          >
            {words}
            <FoldChevron open={open} />
          </Pressable>
        ) : (
          <span className="flex min-w-0 items-center gap-1">{words}</span>
        )}
      </Heading>
      {action ? <HeadingAction action={action} /> : null}
    </div>
  );
}

function HeadingAction({ action }: { action: SectionHeadingAction }) {
  const iconOnly = Boolean(action.icon) && !action.showLabel;
  if (action.menu)
    return (
      <DropdownMenu modal={false}>
        <MenuTrigger
          label={action.label}
          icon={action.icon}
          iconOnly={iconOnly}
          chevron={false}
          size="sm"
          disabled={action.disabled}
        />
        <DropdownMenuContent align="end" width="md">
          {action.menu}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  if (iconOnly && action.icon) {
    const Icon = action.icon;
    return (
      <IconButton
        label={action.label}
        size="sm"
        variant="quiet"
        disabled={action.disabled}
        onClick={action.onSelect}
      >
        <Icon aria-hidden="true" />
      </IconButton>
    );
  }
  return (
    <Button
      size="sm"
      variant="quiet"
      icon={action.icon}
      disabled={action.disabled}
      onClick={action.onSelect}
    >
      {action.label}
    </Button>
  );
}
