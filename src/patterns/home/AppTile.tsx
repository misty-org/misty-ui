import { Plus } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../classNames";
import { Pressable } from "../../controls/Pressable";
import { Text } from "../../display/Text";
import { OverflowFadeText } from "../../layout/OverflowFadeText";

/** The apps of a Space home: tiles that fill the row, as many as fit, each at least this wide. */
export const homeAppsClass =
  "grid grid-cols-[repeat(auto-fill,minmax(--spacing(23),1fr))] gap-2";

const tileClass =
  "relative grid min-w-0 justify-items-center gap-2 rounded-xl px-1 py-3 text-center text-meta";

/** One installed app on a Space home: its logo over its name, washing under the pointer. */
export function AppTile({
  mark,
  label,
  badge,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  /** The app's logo, as it comes from its maker (`AppLogoImage`). */
  mark?: ReactNode;
  label: string;
  /** What waits in the app (unread, due), as a count at the logo's corner. */
  badge?: number;
}) {
  return (
    <Pressable wash="row" className={cn(tileClass, className)} {...props}>
      {mark}
      {badge ? (
        <span
          className={cn(
            "absolute top-1.5 right-3.5 grid h-4.5 min-w-4.5 place-items-center",
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

/**
 * The tile that ends a grid on a Space home: a dashed square with a plus, then what it adds
 * ("Add app" by default, "New agent" after the agents).
 */
export function AddAppTile({
  label = "Add app",
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & { label?: string }) {
  return (
    <Pressable wash="row" className={cn(tileClass, className)} {...props}>
      <span className="grid size-14 place-items-center rounded-[calc(var(--spacing)*3.5)] border border-dashed border-charcoal-border-strong">
        <Text bare tone="muted" className="inline-flex">
          <Plus aria-hidden="true" className="size-4" />
        </Text>
      </span>
      <Text size="meta" tone="muted">
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * One agent on a Space home, in the apps' grid: its face over its name, then one quiet line of
 * what it is doing ("Writing the launch plan", "Needs you", or whose it is). While it works its
 * face breathes a blue dot at the corner; while it waits on the person, an amber one.
 */
export function AgentTile({
  face,
  label,
  line,
  state,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  /** The agent's own avatar at the launcher size (63px). */
  face: ReactNode;
  label: string;
  line?: string;
  state?: "working" | "waiting";
}) {
  return (
    <Pressable
      wash="row"
      className={cn(tileClass, "gap-1", className)}
      {...props}
    >
      <span className="relative mb-1">
        {face}
        {state ? (
          <span
            aria-label={state === "working" ? "Working" : "Needs you"}
            role="img"
            className={cn(
              "absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-charcoal-workspace",
              state === "working"
                ? "bg-[var(--tone-working)] animate-[misty-breathe_1.6s_ease-in-out_infinite] motion-reduce:animate-none"
                : "bg-[var(--tone-waiting)]",
            )}
          />
        ) : null}
      </span>
      <OverflowFadeText className="w-full text-cream">{label}</OverflowFadeText>
      {line ? (
        <OverflowFadeText className="w-full text-caption text-cream-muted">
          {line}
        </OverflowFadeText>
      ) : null}
    </Pressable>
  );
}
