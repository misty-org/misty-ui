import { useId, type ComponentProps, type ReactNode } from "react";
import { Crown } from "lucide-react";

import { cn } from "../../class_names";
import { Pressable } from "../../controls/Pressable";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import type { AvatarSize } from "../../display/Avatar";
import { RoleName } from "../../display/RoleName";
import { Text } from "../../display/Text";
import { Tooltip } from "../../overlays/Tooltip";
import { Skeleton, SkeletonList } from "../../feedback/Skeleton";

/**
 * The member list beside a channel's messages, filling the column it is given (a FramedPage's end
 * column), on that column's fill. While its members load (`loading`), it shows rows shaped like
 * its MemberRows under a heading's place.
 */
export function MemberList(props: {
  label: string;
  /** The members' first load: skeleton rows in place of the groups. */
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <aside
      aria-label={props.label}
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto px-2 pb-4"
    >
      {props.loading ? <MemberListSkeleton label={props.label} /> : props.children}
    </aside>
  );
}

function MemberListSkeleton(props: { label: string }) {
  return (
    <div className="flex flex-col">
      <div className="px-2 pt-5 pb-1">
        <Skeleton className="h-3 w-20 rounded-sm" />
      </div>
      <SkeletonList
        label={props.label}
        rows={6}
        leading="avatar"
        className="gap-0"
        rowClassName="min-h-10 px-2 py-1"
      />
    </div>
  );
}

/** A group's heading: its name, then how many are in it, muted beside it ("Online 3"). */
export function MemberGroupHeading(props: { title: string; count: number }) {
  return (
    <Text
      as="h3"
      bare
      size="caption"
      weight="semibold"
      tone="muted"
      className="flex min-w-0 items-center gap-1 px-2 pt-5 pb-1"
    >
      <OverflowFadeText className="min-w-0">{props.title}</OverflowFadeText>
      <span className="shrink-0 tabular-nums">{props.count}</span>
    </Text>
  );
}

/**
 * How someone shows: `online`, `idle` (no input for a while), `dnd` (do not disturb), `invisible`
 * (the person's own face while they hide) and `offline` are the person's own status; `working`
 * and `waiting` say their agent is at work or waits on them. `offline` draws no dot and dims a
 * member row.
 */
export type MemberPresence =
  | "online"
  | "idle"
  | "dnd"
  | "invisible"
  | "working"
  | "waiting"
  | "offline";

const dotColor: Record<MemberPresence, string> = {
  online: "var(--tone-done)",
  idle: "var(--tone-waiting)",
  dnd: "var(--tone-failed)",
  invisible: "var(--misty-theme-text-muted)",
  working: "var(--tone-working)",
  waiting: "var(--tone-waiting)",
  offline: "transparent",
};

const presenceNames: Record<MemberPresence, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do not disturb",
  invisible: "Invisible",
  working: "Working",
  waiting: "Needs them",
  offline: "Offline",
};

/** The size of the face a presence dot sits on: the Avatar's own sizes. */
export type PresenceFaceSize = AvatarSize;

const dotGeometry: Record<PresenceFaceSize, { face: number; dot: number; cut: number; inset: number }> = {
  xs: { face: 18, dot: 6.75, cut: 2.25, inset: 0 },
  sm: { face: 27, dot: 9, cut: 2.25, inset: 0 },
  default: { face: 36, dot: 11.25, cut: 2.25, inset: 0 },
  lg: { face: 45, dot: 13.5, cut: 2.25, inset: 0 },
  xl: { face: 72, dot: 18, cut: 4.5, inset: 4.5 },
};

/**
 * A status drawn as its own shape as well as its color, so it reads without color: a full dot
 * online (and for an agent at work), a crescent while idle, a bar through it on do not disturb,
 * and a hollow ring while invisible. It fills its box; `PresenceFace` places it on a face and
 * `PresenceDot` stands it alone.
 */
function PresenceShape({ presence }: { presence: MemberPresence }) {
  const mask = useId();
  const color = dotColor[presence];
  const cut =
    presence === "idle" ? (
      <circle cx="2.6" cy="2.6" r="3.6" fill="black" />
    ) : presence === "dnd" ? (
      <rect x="2" y="3.85" width="6" height="2.3" rx="1.15" fill="black" />
    ) : presence === "invisible" ? (
      <circle cx="5" cy="5" r="2.35" fill="black" />
    ) : null;
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className="block size-full">
      {cut ? (
        <mask id={mask}>
          <rect width="10" height="10" fill="white" />
          {cut}
        </mask>
      ) : null}
      <circle cx="5" cy="5" r="5" fill={color} mask={cut ? `url(#${mask})` : undefined} />
    </svg>
  );
}

/**
 * A status on its own, where it names a choice rather than a face: before "Online" in the status
 * menu, or the profile card's status row. It sits in the glyph's 18px box, the dot a step smaller,
 * so it lines up with the icons of the rows around it.
 */
export function PresenceDot({ presence }: { presence: MemberPresence }) {
  if (presence === "offline") return null;
  return (
    <span
      role="img"
      aria-label={presenceNames[presence]}
      className="grid size-4 flex-none place-items-center"
    >
      <span className="size-2.5">
        <PresenceShape presence={presence} />
      </span>
    </span>
  );
}

/**
 * Someone's status as a small dot on the corner of their face, wherever a face shows (a member
 * row, a DM, a friend, the profile card). The dot grows with the face (`face`, the Avatar's own
 * size), sits inside the face's box at its bottom right, and is cut out of the face by a clear ring
 * rather than painted over it, so it reads on any surface: the sidebar, a row's wash, a banner.
 * Each status has its own shape as well as its color. `offline` draws nothing.
 */
export function PresenceFace({
  presence,
  face = "default",
  children,
}: {
  presence: MemberPresence;
  face?: PresenceFaceSize;
  children: ReactNode;
}) {
  const shape = dotGeometry[face];
  const place = shape.face - shape.dot - shape.inset;
  const middle = place + shape.dot / 2;
  const reach = shape.dot / 2 + shape.cut;
  const hole = `radial-gradient(circle at ${middle}px ${middle}px, transparent ${reach}px, black ${reach + 0.5}px)`;
  const shown = presence !== "offline";
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="inline-flex"
        style={shown ? { maskImage: hole, WebkitMaskImage: hole } : undefined}
      >
        {children}
      </span>
      {shown ? (
        <span
          role="img"
          aria-label={presenceNames[presence]}
          className="absolute"
          style={{ left: place, top: place, width: shape.dot, height: shape.dot }}
        >
          <PresenceShape presence={presence} />
        </span>
      ) : null}
    </span>
  );
}

/**
 * One person: their face with a presence dot, their name in their role's color with a crown
 * for the Space's owner, and a quiet second line (what their agent is doing). A member that
 * isn't a person, such as a Space's integration, leaves `presence` out: its face shows bare,
 * with no dot, and the row is never dimmed as an offline person's is.
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
  presence?: MemberPresence;
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
      {props.presence ? (
        <PresenceFace presence={props.presence}>{props.avatar}</PresenceFace>
      ) : (
        props.avatar
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-center gap-1 text-control">
          <OverflowFadeText className="min-w-0">
            <RoleName color={props.presence === "offline" ? undefined : props.color}>
              {props.name}
            </RoleName>
          </OverflowFadeText>
          {props.owner ? (
            <Tooltip content="Space owner">
              <span className="flex shrink-0 text-[var(--tone-waiting)]">
                <Crown aria-label="Space owner" />
              </span>
            </Tooltip>
          ) : null}
        </span>
        {props.line ? (
          <span className="flex min-w-0 items-center gap-1">
            {props.lineMark}
            <OverflowFadeText className="min-w-0 text-meta text-cream-muted">
              {props.line}
            </OverflowFadeText>
          </span>
        ) : null}
      </span>
    </Pressable>
  );
}
