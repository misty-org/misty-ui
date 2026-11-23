import * as React from "react";
import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { renderIcon, type ActionBarItem, type IconSource } from "./ActionBar";
import { OverflowFadeText } from "./OverflowFadeText";

export type ViewHeaderProps = {
  /** The view's name: a channel, a chat, an app. Text fades when it doesn't fit. */
  title: React.ReactNode;
  /** The icon that belongs to what the view shows, drawn muted before the title. */
  lead?: IconSource;
  /**
   * The view's icon buttons at the right (Notifications, Pinned, Members), icons only. A toggle that is
   * on is `pressed`. A header has no search.
   */
  actions?: ReadonlyArray<ActionBarItem>;
  /** Accessible name of the actions toolbar. Default "View actions". */
  actionsLabel?: string;
  /** Layout only: margins or placement. */
  className?: string;
};

/**
 * The band at the top of every view of a Space: 54px (`--ui-header`), the title on the left and the
 * view's icon buttons on the right, with no line under it, since the panes read as one sheet. It
 * holds no search box and no create button. The title fades first, and only then do the buttons give
 * way. It never wraps.
 */
export function ViewHeader({
  title,
  lead,
  actions,
  actionsLabel = "View actions",
  className,
}: ViewHeaderProps) {
  return (
    <header
      data-slot="view-header"
      className={cn("flex h-(--ui-header) min-w-0 shrink-0 items-center gap-2 px-4", className)}
    >
      {lead ? <span className="flex shrink-0 text-cream-muted">{renderIcon(lead)}</span> : null}
      {typeof title === "string" || typeof title === "number" ? (
        <OverflowFadeText
          as="h1"
          full
          className="m-0 min-w-32 flex-1 text-control font-semibold text-cream-bright"
        >
          {title}
        </OverflowFadeText>
      ) : (
        <h1 className="m-0 flex min-w-0 flex-1 items-center text-control font-semibold text-cream-bright">
          {title}
        </h1>
      )}
      {actions?.length ? (
        <div role="toolbar" aria-label={actionsLabel} className="flex shrink-0 items-center gap-1">
          {actions.map((action) => (
            <IconButton
              key={action.id}
              label={action.label}
              variant="quiet"
              disabled={action.disabled}
              aria-pressed={action.pressed}
              className={action.pressed ? "text-cream-bright" : "text-cream-muted"}
              onClick={action.onSelect}
            >
              {renderIcon(action.icon)}
            </IconButton>
          ))}
        </div>
      ) : null}
    </header>
  );
}
