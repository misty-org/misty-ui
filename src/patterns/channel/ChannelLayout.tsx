import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../class_names";
import { IconButton } from "../../controls/IconButton";
import { ActionBar, renderIcon, type ActionBarItem } from "../../layout/ActionBar";
import { ToolbarDivider } from "../../layout/Separator";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { Text } from "../../display/Text";

/** The whole page: the channel column, then the open channel. */
export function ChannelPage({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex h-full min-h-0 min-w-0", className)} {...props} />;
}

/**
 * The channel column, on the sidebar's fill: a bar naming the place (`header`, a MenuTrigger
 * `heading` that opens the place's menu), then the list.
 */
export function ChannelSidebar(props: {
  header: ReactNode;
  children: ReactNode;
  "aria-label": string;
}) {
  return (
    <aside
      aria-label={props["aria-label"]}
      className="flex h-full min-h-0 w-60 shrink-0 flex-col bg-charcoal-sidebar"
    >
      <div className={cn(headerBar, "px-2")}>{props.header}</div>
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pt-3 pb-2">
        {props.children}
      </div>
    </aside>
  );
}

/** Both headers' height and the line under them, so the two read as one bar across the page. */
const headerBar = "flex h-11 shrink-0 items-center border-b border-charcoal-border";

/**
 * The open channel on the page's own color, as the tab row and bottom bar are: its header across the top, the chat, then `side` (the
 * member list, a thread, search results) after a line, on the same fill.
 */
export function ChannelMain(props: { header: ReactNode; side?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-pane">
      {props.header}
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{props.children}</div>
        {props.side ? (
          <div className="flex min-h-0 shrink-0 border-l border-charcoal-border">{props.side}</div>
        ) : null}
      </div>
    </section>
  );
}

/** A header action drawn as its icon alone, muted until it is a toggle that is on. */
function iconOnly(item: ActionBarItem): ActionBarItem {
  if (item.render) return item;
  return {
    ...item,
    render: () => (
      <IconButton
        label={item.label}
        shortcut={item.shortcut}
        variant="quiet"
        disabled={item.disabled}
        aria-pressed={item.pressed}
        className={item.pressed ? "text-cream-bright" : "text-cream-muted"}
        onClick={item.onSelect}
      >
        {renderIcon(item.icon)}
      </IconButton>
    ),
  };
}

/**
 * The open chat's own bar, under the window's tabs, for a channel or a direct message: its icon (or the person's face) and name, an optional topic, then its controls. Each
 * pane draws its own, so a split never loses a chat's controls. `actions` are its icon buttons
 * (calls, Threads, Pinned, Members, a ⋯ of the rest), icons only with the label as the tooltip;
 * `end` is what stays last and never folds, such as the message search. The name fades first; then
 * the actions give way into a ⋯ menu, lowest priority first. It never wraps.
 */
export function ChannelHeader(props: {
  icon?: LucideIcon;
  /** A person's face for a direct message, in place of an icon. */
  leading?: ReactNode;
  name: string;
  topic?: string;
  /** The chat's icon buttons; a toggle that is on is `pressed`. */
  actions?: ReadonlyArray<ActionBarItem>;
  /** Accessible name of the actions toolbar. Default "Chat actions". */
  actionsLabel?: string;
  /** Always shown at the end, after the actions, and never folds: the message search. */
  end?: ReactNode;
}) {
  const Icon = props.icon;
  return (
    <header className={cn(headerBar, "gap-2 px-4")}>
      {props.leading ??
        (Icon ? (
          <Text bare tone="muted" className="flex shrink-0">
            <Icon aria-hidden="true" />
          </Text>
        ) : null)}
      <Text
        as="h1"
        size="body"
        weight="semibold"
        tone="bright"
        full
        className={props.topic ? "min-w-32 shrink" : "min-w-32 flex-1"}
      >
        {props.name}
      </Text>
      {props.topic ? (
        <>
          <ToolbarDivider />
          <OverflowFadeText className="min-w-0 flex-1 text-meta text-cream-muted">
            {props.topic}
          </OverflowFadeText>
        </>
      ) : null}
      {props.actions?.length ? (
        <ActionBar
          label={props.actionsLabel ?? "Chat actions"}
          width="content"
          items={props.actions.map(iconOnly)}
          end={props.end}
        />
      ) : props.end ? (
        <div className="flex shrink-0 items-center gap-2">{props.end}</div>
      ) : null}
    </header>
  );
}

/**
 * The top of a channel's history, once the very first message is in view: a large mark, a
 * welcome and where this channel begins. A direct message opens the same way with the person's
 * face as its `mark` (an xl Avatar in a PresenceFace with `face="xl"`, or a group's faces) and its name as the
 * title, and may offer a few buttons under the line (`actions`, such as Call).
 */
export function ChannelWelcome(props: {
  icon?: LucideIcon;
  /** A person's face for a direct message, in place of the icon. */
  mark?: ReactNode;
  title: string;
  line: string;
  /** A few secondary or quiet Buttons under the line, at the default size. */
  actions?: ReactNode;
}) {
  const Icon = props.icon;
  return (
    <div className="flex flex-col items-start gap-1 pt-4 pb-4">
      {props.mark ? (
        <span className="mb-2 flex">{props.mark}</span>
      ) : (
        <span className="mb-2 flex size-16 items-center justify-center rounded-full bg-control-active text-cream-bright">
          {Icon ? <Icon aria-hidden="true" className="size-9" /> : null}
        </span>
      )}
      <Text as="h2" size="display" weight="semibold" tone="bright" wrap>
        {props.title}
      </Text>
      <Text as="p" size="body" tone="muted" wrap>
        {props.line}
      </Text>
      {props.actions ? <div className="mt-3 flex items-center gap-2">{props.actions}</div> : null}
    </div>
  );
}

/**
 * A line across the history with a label in it: a day (`date`), or where the messages the
 * person hasn't read begin (`new`), drawn in the danger color with a "New" tag at its end.
 */
export function ChannelDivider(props: { label?: string; kind?: "date" | "new" }) {
  const isNew = props.kind === "new";
  const line = cn("h-px flex-1", isNew ? "bg-danger/50" : "bg-charcoal-border");
  return (
    <div
      role="separator"
      aria-label={isNew ? `New messages${props.label ? `, ${props.label}` : ""}` : props.label}
      className="mt-6 mb-2 flex items-center gap-2 first:mt-0"
    >
      <span className={line} />
      {props.label ? (
        <Text bare size="caption" weight="semibold" tone={isNew ? "danger" : "muted"}>
          {props.label}
        </Text>
      ) : null}
      {props.label || !isNew ? <span className={line} /> : null}
      {isNew ? (
        <span className="rounded-sm bg-danger px-1 text-micro font-semibold text-white">New</span>
      ) : null}
    </div>
  );
}

/**
 * "X is typing…" in the strip just above the composer, so it reads beside what is being
 * written: the strip keeps its height when empty, so the history never jumps as it comes and goes.
 */
export function TypingLine(props: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex h-6 shrink-0 items-center gap-1.5 px-4">
      {props.label ? (
        <>
          <span aria-hidden="true" className="flex gap-0.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1 animate-[misty-dot-blink_1.1s_ease-in-out_infinite] rounded-full bg-cream-muted"
                style={{ animationDelay: `${dot * 160}ms` }}
              />
            ))}
          </span>
          <Text bare size="caption" tone="muted">
            {props.label}
          </Text>
        </>
      ) : null}
    </div>
  );
}

/**
 * The mark on a message that mentions the person reading it, by name or by a role they hold: a
 * thin bar down its left edge, in the waiting tone. The message is the positioning box.
 */
export function MentionMark() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-0.5 rounded-full bg-[var(--tone-waiting)]"
    />
  );
}
