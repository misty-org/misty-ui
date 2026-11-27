import type { ReactNode } from "react";

import { cn } from "../class_names";
import { Text } from "../display/Text";
import { Tooltip } from "../overlays/Tooltip";
import { NavRow, NavRowLabel, type NavRowTone } from "./NavRow";

export type VoicePersonProps = {
  /** Their face, at 22.5px (an `Avatar size="xs"`). */
  avatar: ReactNode;
  name: string;
  /** Talking now: a ring in the done tone circles their face. */
  speaking?: boolean;
  /** Muted by themself: their name stays quiet. */
  muted?: boolean;
  tone?: NavRowTone;
  className?: string;
};

/**
 * One person in a voice channel, listed under the channel's row in the sidebar: their face and
 * name, set in past the channel's mark. While they speak, a ring in the done tone circles
 * their face. It shows who is there and is not a control: joining is the channel's own row.
 *
 * ```tsx
 * <VoicePerson avatar={<Avatar size="xs">…</Avatar>} name="Ana" speaking />
 * ```
 */
export function VoicePerson({ avatar, name, speaking, muted, tone, className }: VoicePersonProps) {
  return (
    <NavRow
      still
      tone={tone}
      data-slot="voice-person"
      aria-label={speaking ? `${name}, speaking` : name}
      className={cn("h-7 gap-2 pl-8", className)}
    >
      <span
        data-speaking={speaking || undefined}
        className={cn(
          "flex size-5 flex-none items-center justify-center rounded-full",
          "data-[speaking]:outline-2 data-[speaking]:outline-offset-1 data-[speaking]:outline-solid",
          "data-[speaking]:outline-[var(--tone-done)]",
        )}
      >
        {avatar}
      </span>
      <NavRowLabel bright={speaking && !muted} className="flex-1">
        {name}
      </NavRowLabel>
    </NavRow>
  );
}

/** One person in a voice channel, for `VoiceFaces`. */
export type VoiceFace = {
  /** Their name: the face's tooltip and accessible name. */
  name: string;
  /** Their face, at 22.5px (an `Avatar size="xs"`). */
  avatar: ReactNode;
  /** Talking now: a ring in the done tone circles their face. */
  speaking?: boolean;
};

/**
 * Who is in a voice channel, at the end of the channel's row in the sidebar: up to three faces
 * overlapping, each cut out of the one under it by a ring of the window's color and named in
 * Misty's tooltip, then "+N" for the rest. Whoever is talking is ringed in the done tone. It shows
 * who is there and is not a control: joining is the channel's own row. A list of them under the
 * row, one per line, is `VoicePerson`, for where the room has space for names.
 */
export function VoiceFaces({ people, className }: { people: VoiceFace[]; className?: string }) {
  if (!people.length) return null;
  const shown = people.slice(0, 3);
  const rest = people.length - shown.length;
  const label = people.map((person) => person.name).join(", ");
  return (
    <span
      role="group"
      aria-label={`In the channel: ${label}`}
      data-slot="voice-faces"
      className={cn("flex shrink-0 items-center", className)}
    >
      <span className="flex items-center -space-x-1">
        {shown.map((person, index) => (
          <Tooltip key={`${person.name}-${index}`} content={person.name}>
            <span
              role="img"
              aria-label={person.name}
              data-speaking={person.speaking || undefined}
              className={cn(
                "grid rounded-full ring-2 ring-[var(--misty-window-chrome,var(--misty-theme-workspace))]",
                "data-[speaking]:relative data-[speaking]:z-[var(--stack-above)] data-[speaking]:ring-state-done",
              )}
            >
              {person.avatar}
            </span>
          </Tooltip>
        ))}
      </span>
      {rest > 0 ? (
        <Text bare size="caption" tone="muted" className="ml-1">
          {`+${rest}`}
        </Text>
      ) : null}
    </span>
  );
}
