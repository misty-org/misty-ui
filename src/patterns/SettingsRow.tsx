import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../class_names";
import type { SectionHeadingAction } from "../layout/SectionHeading";
import { RowGroupSection } from "../layout/RowGroup";

/**
 * A section of a settings page: its label over one RowGroup of SettingsRows, as the profile card
 * groups its rows. No card edge and no line between rows; sections sit 22.5px apart in a
 * RowGroupStack. Leave `title` off where the page's own title already names the only section.
 *
 * ```tsx
 * <SettingsSection title="Startup">
 *   <SettingsRow label="Launch on login"><Switch … /></SettingsRow>
 * </SettingsSection>
 * ```
 */
export function SettingsSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  /** A muted line about the whole section, only where it explains something its rows don't. */
  description?: ReactNode;
  action?: SectionHeadingAction;
  children: ReactNode;
  /** Layout only. */
  className?: string;
}) {
  return (
    <RowGroupSection
      title={title}
      description={description}
      action={action}
      className={cn("@container/settings", className)}
    >
      {children}
    </RowGroupSection>
  );
}

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  /**
   * A muted line under the label, only where it explains something the label doesn't ("Space
   * drives stay in sync while Misty is in the menu bar"). Most rows have none.
   */
  description?: ReactNode;
  /** The row's control (a Switch, an OptionSelect, a field, a value), at its end. */
  children?: ReactNode;
  /** A row that only applies under the one above it, set in a step. */
  sub?: boolean;
  /** Doesn't apply right now (its parent setting is off): dimmed, with its control kept in place. */
  disabled?: boolean;
  /** The control under the label instead of beside it, for a wide control (a list, a textarea). */
  stacked?: boolean;
  /** A picture before the label, such as an engine's mark. */
  leading?: ReactNode;
}

/**
 * One setting in a SettingsSection: 45px, its label in the control role at the default tone, an
 * optional muted description under it, and its control at the end. On a narrow pane the control
 * drops under the label. `sub` sets a dependent row in a step; `disabled` dims it while it
 * doesn't apply. The row passes other attributes on, so a settings page can mark it for search.
 */
export function SettingsRow({
  label,
  description,
  children,
  sub = false,
  disabled = false,
  stacked = false,
  leading,
  className,
  ...props
}: SettingsRowProps) {
  return (
    <div
      data-slot="settings-row"
      aria-disabled={disabled || undefined}
      {...props}
      className={cn(
        "grid min-h-10 min-w-0 items-center gap-x-4 gap-y-2 rounded-lg py-1.5 pr-2",
        sub ? "pl-7" : "pl-3",
        stacked
          ? "grid-cols-[minmax(0,1fr)]"
          : "grid-cols-[minmax(0,1fr)_auto] @max-[35rem]/settings:grid-cols-[minmax(0,1fr)]",
        "transition-colors duration-700 data-[flash=true]:bg-control-hover data-[flash=true]:duration-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 items-center gap-3",
          disabled && "opacity-45",
        )}
      >
        {leading}
        <div className="grid min-w-0 gap-px">
          <span className="text-control text-cream">{label}</span>
          {description ? (
            <span className="text-meta text-cream-muted">{description}</span>
          ) : null}
        </div>
      </div>
      {children !== undefined ? (
        <div
          data-slot="settings-row-control"
          className={cn(
            "flex min-w-0 items-center gap-2",
            stacked ? "justify-start" : "justify-end @max-[35rem]/settings:justify-start",
            disabled && "opacity-45",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
