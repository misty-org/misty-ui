import { Plus } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../classNames";
import { Pressable } from "../../controls/Pressable";
import { Text } from "../../display/Text";
import { AppLogo, type OfficialAppId } from "../../icons/AppLogos";
import { OverflowFadeText } from "../../layout/OverflowFadeText";

/** The apps of a Space home: tiles that fill the row, as many as fit, each at least this wide. */
export const homeAppsClass = "grid grid-cols-[repeat(auto-fill,minmax(5.75rem,1fr))] gap-2";

const tileClass =
  "relative grid min-w-0 justify-items-center gap-2 rounded-xl px-1 py-3 text-center text-meta";

/** One installed app on a Space home: its logo over its name, washing under the pointer. */
export function AppTile({
  app,
  mark,
  label,
  badge,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  /** One of Misty's own apps, drawn on its color tile. */
  app?: OfficialAppId;
  /** The logo of any other app, as it comes from its maker. */
  mark?: ReactNode;
  label: string;
  /** What waits in the app (unread, due), as a count at the logo's corner. */
  badge?: number;
}) {
  return (
    <Pressable wash="row" className={cn(tileClass, className)} {...props}>
      {app ? <AppLogo app={app} size="launcher" /> : mark}
      {badge ? (
        <span
          className={cn(
            "absolute top-1.5 right-3.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center",
            "rounded-full bg-[var(--misty-theme-danger)] px-1.5 text-micro font-semibold text-white",
          )}
        >
          {badge}
        </span>
      ) : null}
      <OverflowFadeText className="w-full text-cream">{label}</OverflowFadeText>
    </Pressable>
  );
}

/** The tile that ends the grid for a Space's mods: a dashed square with a plus, then "Add app". */
export function AddAppTile({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children">) {
  return (
    <Pressable wash="row" className={cn(tileClass, className)} {...props}>
      <span className="grid size-14 place-items-center rounded-[0.875rem] border border-dashed border-charcoal-border-strong">
        <Text bare tone="muted" className="inline-flex">
          <Plus aria-hidden="true" className="size-4" />
        </Text>
      </span>
      <Text size="meta" tone="muted">
        Add app
      </Text>
    </Pressable>
  );
}
