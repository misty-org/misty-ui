import type { ComponentProps, ReactNode } from "react";
import { Crown } from "lucide-react";

import { cn } from "../../classNames";
import { Pressable } from "../../controls/Pressable";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { RoleName } from "../../display/RoleName";
import { Text } from "../../display/Text";
import { Tooltip } from "../../overlays/Tooltip";

/** The member list beside a channel's messages, on the channel's own fill, as Discord's. */
export function MemberList(props: { label: string; children: ReactNode }) {
  return (
    <aside
      aria-label={props.label}
      className="flex h-full min-h-0 w-60 shrink-0 flex-col overflow-y-auto px-2 pb-4"
    >
      {props.children}
    </aside>
  );
}

/** A group's heading: its name, a dash and how many are in it ("Online — 3"). */
export function MemberGroupHeading(props: { title: string; count: number }) {
  return (
    <Text as="h3" size="caption" weight="semibold" tone="muted" className="px-2 pt-5 pb-1">
      {`${props.title} — ${props.count}`}
    </Text>
  );
}

/**
 * How someone shows: `online`, `idle` (no input for a while), `dnd` (do not disturb) and
 * `offline` are the person's own status; `working` and `waiting` say their agent is at work or
 * waits on them. `offline` draws no dot and dims a member row.
 */
export type MemberPresence = "online" | "idle" | "dnd" | "working" | "waiting" | "offline";

const dotClass: Record<MemberPresence, string> = {
  online: "bg-[var(--tone-done)]",
  idle: "bg-[var(--tone-waiting)]",
  dnd: "bg-[var(--tone-failed)]",
  working: "bg-[var(--tone-working)]",
  waiting: "bg-[var(--tone-waiting)]",
  offline: "hidden",
};

const presenceNames: Record<MemberPresence, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do not disturb",
  working: "Working",
  waiting: "Needs them",
  offline: "Offline",
};

/**
 * Someone's status as a small dot on the corner of their face, wherever a face shows (a member
 * row, a DM, a friend): green online, amber idle, red do not disturb, nothing offline. The face
 * and the dot sit in this box; the dot's ring is the surface's own color (`ring` is the sidebar
 * where the face sits on the sidebar). `size="lg"` is for a large face (an xl Avatar), such as a
 * profile's or a direct message's opening, whose dot grows with it.
 */
export function PresenceFace({
  presence,
  ring = "pane",
  size = "default",
  children,
}: {
  presence: MemberPresence;
  ring?: "pane" | "sidebar";
  size?: "default" | "lg";
  children: ReactNode;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      {children}
      <span
        role="img"
        aria-label={presenceNames[presence]}
        className={cn(
          "absolute rounded-full",
          size === "lg" ? "right-0.5 bottom-0.5 size-5 border-4" : "-right-0.5 -bottom-0.5 size-3 border-2",
          ring === "sidebar" ? "border-sidebar" : "border-pane",
          dotClass[presence],
        )}
      />
    </span>
  );
}

/**
 * One person: their face with a presence dot, their name in their role's color with a crown
 * for the Space's owner, and a quiet second line (what their agent is doing).
 */
export function MemberRow({
  avatar,
  name,
  color,
  owner,
  presence,
  lineMark,
  line,
  onOpen,
  className,
  ...rest
}: Omit<ComponentProps<typeof Pressable>, "children" | "wash"> & {
  avatar: ReactNode;
  name: string;
  color?: string;
  owner?: boolean;
  presence: MemberPresence;
  /** A small mark before the line, such as the agent's engine. */
  lineMark?: ReactNode;
  line?: string;
  onOpen?: () => void;
}) {
  const props = { avatar, name, color, owner, presence, lineMark, line };
  return (
    <Pressable
      type="button"
      wash="row"
      onClick={onOpen}
      {...rest}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 rounded-md px-2 py-1 text-left",
        presence === "offline" && "opacity-30 hover:opacity-100 data-[state=open]:opacity-100",
        className,
      )}
    >
      <PresenceFace presence={props.presence}>{props.avatar}</PresenceFace>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-center gap-1 text-body">
          <OverflowFadeText className="min-w-0">
            <RoleName color={props.presence === "offline" ? undefined : props.color}>
              {props.name}
            </RoleName>
          </OverflowFadeText>
          {props.owner ? (
            <Tooltip content="Space owner">
              <span className="shrink-0 text-[var(--tone-waiting)] [&_svg]:size-3.5">
                <Crown aria-label="Space owner" />
              </span>
            </Tooltip>
          ) : null}
        </span>
        {props.line ? (
          <span className="flex min-w-0 items-center gap-1">
            {props.lineMark}
            <OverflowFadeText className="min-w-0 text-caption text-cream-muted">
              {props.line}
            </OverflowFadeText>
          </span>
        ) : null}
      </span>
    </Pressable>
  );
}
