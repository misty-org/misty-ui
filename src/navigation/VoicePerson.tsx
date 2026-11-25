import type { ReactNode } from "react";

import { cn } from "../class_names";
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
