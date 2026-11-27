import type { ComponentProps, ReactNode } from "react";
import { CornerUpLeft, MessagesSquare, SmilePlus } from "lucide-react";

import { cn } from "../../class_names";
import { Emoji } from "../../display/Emoji";
import { Pressable } from "../../controls/Pressable";
import { IconButton } from "../../controls/IconButton";
import { CompactControls } from "../../controls/RowContext";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { RoleName } from "../../display/RoleName";
import { Text } from "../../display/Text";
import { Tooltip } from "../../overlays/Tooltip";
import { MentionMark } from "./ChannelLayout";

/**
 * One message in a channel. `grouped` folds it under the sender's previous message: no face or
 * name, its short time in the face's column on hover. `tools` are the message's own buttons
 * (reactions, reply, edit, its ⋯), drawn 27px in a small bar at its top right while it is hovered,
 * holds focus or has a menu open (`active`). `mentioned` marks a message that names the reader;
 * `editing` washes the one being edited; `pending` dims one still being sent.
 */
export function ChannelMessage({
  avatar,
  name,
  color,
  badge,
  time,
  timeFull,
  dateTime,
  shortTime,
  grouped = false,
  reply,
  tools,
  active = false,
  mentioned = false,
  editing = false,
  pending = false,
  children,
  after,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  /** The sender's face at 45px (an Avatar lg, or an agent's mark). Unused when grouped. */
  avatar?: ReactNode;
  name: string;
  /** The sender's highest colored role's color. */
  color?: string;
  /** A small mark after the name, such as a Badge saying the sender is an agent. */
  badge?: ReactNode;
  /** When it was said, as the header reads it: "Today at 3:45 PM". */
  time: string;
  /** The same moment in full, for its tooltip. */
  timeFull?: string;
  /** The moment as an ISO string, for `<time>`. */
  dateTime: string;
  /** The time alone ("3:45 PM"), shown in the face's column of a grouped message on hover. */
  shortTime?: string;
  grouped?: boolean;
  /** A ChannelReply over the message, when it answers another. */
  reply?: ReactNode;
  tools?: ReactNode;
  active?: boolean;
  mentioned?: boolean;
  editing?: boolean;
  pending?: boolean;
  /** The message's text (ChannelMessageText), or an edit box in its place. */
  children: ReactNode;
  /** What hangs off the text: files, previews, ChannelReactions, a thread's replies. */
  after?: ReactNode;
}) {
  return (
    <div
      role="article"
      data-message=""
      data-active={active || undefined}
      tabIndex={-1}
      aria-label={`Message from ${name}`}
      className={cn(
        "group/message relative grid grid-cols-[--spacing(10)_minmax(0,1fr)] gap-x-4 px-4 py-0.5 outline-none",
        grouped ? "items-baseline" : "mt-4 first:mt-0",
        "hover:bg-row-hover focus-within:bg-row-hover data-[active]:bg-row-hover",
        mentioned &&
          "bg-[color-mix(in_srgb,var(--tone-waiting)_8%,transparent)]",
        editing && "bg-row-hover",
        className,
      )}
      {...props}
    >
      {mentioned ? <MentionMark /> : null}
      {reply ? <div className="col-span-2 min-w-0">{reply}</div> : null}
      <div className="flex min-w-0 justify-center">
        {grouped ? (
          <Text
            as="time"
            bare
            size="micro"
            tone="muted"
            dateTime={dateTime}
            className="whitespace-nowrap tabular-nums opacity-0 group-hover/message:opacity-100 group-data-[active]/message:opacity-100"
          >
            {shortTime ?? time}
          </Text>
        ) : (
          <span className="pt-0.5">{avatar}</span>
        )}
      </div>
      <div className={cn("min-w-0", pending && "opacity-60")}>
        {grouped ? null : (
          <div className="flex min-w-0 items-center gap-2">
            <OverflowFadeText className="min-w-0 shrink text-body">
              <RoleName color={color} weight="semibold">
                {name}
              </RoleName>
            </OverflowFadeText>
            {badge}
            <Tooltip content={timeFull ?? time}>
              <Text
                as="time"
                bare
                size="caption"
                tone="muted"
                dateTime={dateTime}
                className="shrink-0"
              >
                {time}
              </Text>
            </Tooltip>
          </div>
        )}
        {children}
        {after ? (
          <div className="grid min-w-0 justify-items-start gap-1 pt-1">
            {after}
          </div>
        ) : null}
      </div>
      {tools ? (
        <div
          className={cn(
            "absolute -top-4 right-4 z-[var(--stack-raised)] flex items-center gap-0.5 rounded-md bg-charcoal-card p-0.5 hairline-outline outline-charcoal-border",
            "invisible group-hover/message:visible group-focus-within/message:visible group-data-[active]/message:visible",
            "[@media(hover:none)]:visible",
          )}
          role="toolbar"
          aria-label="Message actions"
        >
          <CompactControls>{tools}</CompactControls>
        </div>
      ) : null}
    </div>
  );
}

/**
 * A message's text: body type at an easy reading measure (72 characters) and line height, keeping
 * its line breaks and wrapping long words. `jumbo` sets a
 * message of only a few emoji large; `edited` adds the quiet "(edited)" after it,
 * with when in its tooltip.
 */
export function ChannelMessageText(props: {
  children: ReactNode;
  jumbo?: boolean;
  edited?: string;
  failed?: boolean;
}) {
  return (
    <div
      dir="auto"
      className={cn(
        "min-w-0 max-w-[72ch] whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
        props.jumbo ? "text-display leading-snug" : "text-body leading-normal",
        props.failed ? "text-danger" : "text-cream",
      )}
    >
      {props.children}
      {props.edited ? (
        <Tooltip content={props.edited}>
          <Text
            as="span"
            bare
            size="micro"
            tone="muted"
            className="ml-1 inline align-baseline"
          >
            (edited)
          </Text>
        </Tooltip>
      ) : null}
    </div>
  );
}

/**
 * The line over a message that answers another: a bent arrow from the face's column, the
 * original's sender (an 18px face and their name) and one line of what they said, the whole line
 * a button that brings the original into view. `missing` says the original isn't drawn: still
 * further back (`earlier`) or deleted.
 */
export function ChannelReply(props: {
  avatar?: ReactNode;
  name?: string;
  color?: string;
  text?: string;
  missing?: "earlier" | "deleted";
  onOpen(): void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 pb-0.5 pl-5">
      <Text bare tone="muted" className="flex w-9 shrink-0 justify-end">
        <CornerUpLeft aria-hidden="true" className="-scale-x-100" />
      </Text>
      <Pressable
        type="button"
        onClick={props.onOpen}
        className="flex min-w-0 items-center gap-1.5 text-left text-meta"
      >
        {props.missing ? (
          <Text
            bare
            size="meta"
            tone="muted"
            className="italic hover:text-cream"
          >
            {props.missing === "earlier"
              ? "Show the original message"
              : "The original message was deleted"}
          </Text>
        ) : (
          <>
            {props.avatar}
            <RoleName color={props.color} className="shrink-0">
              {`@${props.name ?? ""}`}
            </RoleName>
            <OverflowFadeText className="min-w-0 text-cream-muted hover:text-cream">
              {props.text || "Attachment"}
            </OverflowFadeText>
          </>
        )}
      </Pressable>
    </div>
  );
}

/**
 * The reactions under a message, in a row that wraps: each a ReactionChip, then, for someone who
 * may react, the button that opens the emoji picker (`add`, usually an EmojiPicker's trigger).
 */
export function ChannelReactions(props: {
  children: ReactNode;
  add?: ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-1"
      role="group"
      aria-label="Reactions"
    >
      {props.children}
      {props.add}
    </div>
  );
}

/**
 * One reaction: the emoji and how many gave it, pressed (`mine`) when the reader is one of them.
 * Pressing it adds or takes back the reader's own.
 */
export function ReactionChip(props: {
  emoji: string;
  count: number;
  mine?: boolean;
  disabled?: boolean;
  onToggle(): void;
}) {
  const label = `${props.emoji}, ${props.count} ${props.count === 1 ? "reaction" : "reactions"}`;
  const chip = (
    <Pressable
      type="button"
      aria-pressed={props.mine === true}
      aria-label={label}
      disabled={props.disabled}
      onClick={props.onToggle}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md px-2 hairline-outline",
        props.mine
          ? "bg-control-active outline-cream-muted text-cream-bright hover:bg-control-hover"
          : "bg-row-hover outline-transparent text-cream hover:bg-control-hover hover:outline-charcoal-border-strong",
      )}
    >
      <span aria-hidden="true" className="text-control leading-none">
        <Emoji emoji={props.emoji} />
      </span>
      <span className="text-meta font-medium tabular-nums">{props.count}</span>
    </Pressable>
  );
  if (props.disabled) return chip;
  return (
    <Tooltip
      content={props.mine ? "Remove your reaction" : "Add your reaction"}
    >
      {chip}
    </Tooltip>
  );
}

/** The button after the reactions that opens the emoji picker. Forwards its props to IconButton. */
export function AddReactionButton(
  props: Omit<ComponentProps<typeof IconButton>, "label" | "children">,
) {
  return (
    <IconButton label="Add reaction" size="sm" {...props}>
      <SmilePlus />
    </IconButton>
  );
}

/** How many replies a message's thread has, as a quiet button that opens the thread. */
export function ThreadRepliesButton(props: { count: number; onOpen(): void }) {
  return (
    <Pressable
      type="button"
      wash="control"
      onClick={props.onOpen}
      className="-ml-1 flex h-7 items-center gap-1.5 rounded-md px-1 text-meta font-medium text-cream-bright"
    >
      <MessagesSquare aria-hidden="true" />
      {`${props.count} ${props.count === 1 ? "reply" : "replies"}`}
    </Pressable>
  );
}
