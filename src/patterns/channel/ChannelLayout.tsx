import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../class_names";
import { IconButton } from "../../controls/IconButton";
import { ActionBar, renderIcon, type ActionBarItem } from "../../layout/ActionBar";
import { FramedBar } from "../../layout/FramedBar";
import { ToolbarDivider } from "../../layout/Separator";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { Text } from "../../display/Text";
import { PlaceholderIcon } from "../../icons/PlaceholderIcon";

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
 * The open chat's own bar, for a channel or a direct message: its icon (or the person's face) and
 * name, an agent chat's open `thread` after it ("Scout – Pricing audit"), an optional topic, then
 * its controls. It is a FramedBar (54px, one gutter, no fill or line
 * of its own), so it goes in a FramedPage's `header`, which paints the frame behind it and the
 * hairline under it. Each pane draws its own, so a split never loses a chat's controls. `actions`
 * are every control that may fold (calls, Threads, Pinned, Members, a ⋯ of the rest), icons only
 * with the label as the tooltip; `end` is what stays last and never folds, such as the message
 * search. The name fades first; then the actions give way into a ⋯ menu, lowest priority first.
 * It never wraps.
 */
export function ChannelHeader(props: {
  icon?: LucideIcon;
  /** A person's face for a direct message, in place of an icon. */
  leading?: ReactNode;
  name: string;
  /**
   * The open thread of an agent's chat, after the name as "Name – Thread": the dash muted, the
   * thread's name in the default text, fading first when room runs out.
   */
  thread?: string;
  topic?: string;
  /** The chat's icon buttons, which fold into ⋯ as room runs out; a toggle that is on is `pressed`. */
  actions?: ReadonlyArray<ActionBarItem>;
  /** Accessible name of the actions toolbar. Default "Chat actions". */
  actionsLabel?: string;
  /** Always shown at the end, after the actions, and never folds: the message search. */
  end?: ReactNode;
}) {
  const Icon = props.icon;
  return (
    <header className="min-w-0">
      <FramedBar
        start={
          <>
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
              className={props.topic || props.thread ? "min-w-16 shrink-0" : "min-w-32 flex-1"}
            >
              {props.name}
            </Text>
            {props.thread ? (
              <>
                <Text bare size="body" tone="muted" aria-hidden="true" className="shrink-0">
                  –
                </Text>
                <OverflowFadeText
                  className={cn("min-w-0 text-body text-cream", props.topic ? "shrink" : "flex-1")}
                >
                  {props.thread}
                </OverflowFadeText>
              </>
            ) : null}
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
              />
            ) : null}
          </>
        }
      >
        {props.end}
      </FramedBar>
    </header>
  );
}

/**
 * The top of a channel's history, once the very first message is in view: its icon, bare and
 * large (a PlaceholderIcon), a welcome and where this channel begins. A direct message opens the
 * same way with the person's face as its `mark` (an xl Avatar in a PresenceFace with `face="xl"`, or
 * a group's faces) and its name as the title, and may offer a few buttons under the line
 * (`actions`). A direct message's welcome, one-to-one or a group, and an agent chat's are
 * `align="center"`, the face centered over its name as every profile's is; a channel's sits at the start.
 */
export function ChannelWelcome(props: {
  icon?: LucideIcon;
  /** A person's face for a direct message, in place of the icon. */
  mark?: ReactNode;
  title: string;
  line: ReactNode;
  /** A few secondary or quiet Buttons under the line, at the default size. */
  actions?: ReactNode;
  /** "center" for a direct message or an agent chat: the face, name, line and buttons centered. */
  align?: "start" | "center";
}) {
  const Icon = props.icon;
  const center = props.align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-1 pt-4 pb-4",
        center ? "items-center text-center" : "items-start",
      )}
    >
      {props.mark ? (
        <span className="mb-2 flex">{props.mark}</span>
      ) : Icon ? (
        <span className="mb-2 flex">
          <PlaceholderIcon icon={Icon} />
        </span>
      ) : null}
      <Text as="h2" size="display" weight="semibold" tone="bright" wrap>
        {props.title}
      </Text>
      <Text as="p" size="body" tone="muted" wrap className={cn(center && "max-w-prose")}>
        {props.line}
      </Text>
      {props.actions ? (
        <div className={cn("mt-3 flex items-center gap-2", center && "justify-center")}>
          {props.actions}
        </div>
      ) : null}
    </div>
  );
}

/**
 * A line across the history with a label in it: a day (`date`), or where the messages the
 * person hasn't read begin (`new`): a quiet "New" in the muted text on the strong edge's line, so
 * it marks the place without shouting.
 */
export function ChannelDivider(props: { label?: string; kind?: "date" | "new" }) {
  const isNew = props.kind === "new";
  const line = cn("h-px flex-1", isNew ? "bg-charcoal-border-strong" : "bg-charcoal-border");
  return (
    <div
      role="separator"
      aria-label={isNew ? `New messages${props.label ? `, ${props.label}` : ""}` : props.label}
      className="mt-6 mb-2 flex items-center gap-2 first:mt-0"
    >
      <span className={line} />
      {props.label ? (
        <Text bare size="caption" weight="medium" tone="muted">
          {props.label}
        </Text>
      ) : null}
      {props.label || !isNew ? <span className={line} /> : null}
      {isNew ? (
        <Text bare size="caption" weight="medium" tone="muted">
          New
        </Text>
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
    <div role="status" aria-live="polite" className="flex h-5 shrink-0 items-center gap-1.5 px-4">
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
