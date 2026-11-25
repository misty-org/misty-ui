import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../class_names";
import { Mark } from "../icons/Mark";
import { Avatar, type AvatarSize, type AvatarTone } from "./Avatar";

const step = 4.5;

const glyphSteps: Record<AvatarSize, number> = {
  glyph: 4,
  xs: 3,
  sm: 4,
  default: 5,
  lg: 5.5,
  xl: 10,
};

const glyphClass: Record<AvatarSize, string> = {
  glyph: "[&_svg]:size-3 text-micro",
  xs: "[&_svg]:size-3 text-caption",
  sm: "[&_svg]:size-4 text-control",
  default: "[&_svg]:size-5 text-title",
  lg: "[&_svg]:size-5.5 text-title",
  xl: "[&_svg]:size-10 text-display",
};

/**
 * An agent's face, round and at an Avatar's size, so an agent sits in a chat, a list or a call
 * exactly where a person's face would. It wears one thing: its engine's `mark` (an id from the
 * marks registry), a persona's `icon` on the persona's `color` (one of `personaTones`), or as
 * children an emoji, or with `picture` an image that fills it. The mark or glyph is drawn at the
 * face's own size; a feature never sizes it. An engine's mark, an emoji or an initial sits on the
 * agent's own pastel (`tone`, as a person's face takes theirs), so it reads as a face of a person's
 * size; a one-color mark and an initial take the dark ink people's initials wear there, while a
 * colored mark keeps its own colors. Without a `tone` they stand bare in the face's box. A person's face is an `Avatar`; an app's logo is
 * `AppLogoImage`.
 *
 * ```tsx
 * <AgentFace size="lg" mark="engine:claude" />
 * <AgentFace size="sm" icon={PenTool} color={personaTone(persona.id)} />
 * ```
 */
export function AgentFace({
  size = "default",
  mark,
  icon: Icon,
  color,
  tone,
  picture = false,
  className,
  children,
}: {
  size?: AvatarSize;
  /** The engine's mark, as `Mark`'s `of`. */
  mark?: string;
  /** A persona's glyph. */
  icon?: LucideIcon;
  /** A persona's color, from `personaTone(id)`: the face is filled with it and its glyph is white. */
  color?: string;
  /**
   * The agent's own pastel behind its mark, emoji or initial, picked per agent as a person's is.
   * Not with `color` or `picture`, which fill the face themselves.
   */
  tone?: AvatarTone;
  /** The children are a picture that fills the whole face. */
  picture?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const toned = Boolean(tone) && !color && !picture;
  return (
    <Avatar
      size={size}
      aria-hidden="true"
      tone={toned ? tone : undefined}
      className={cn(color ? "border-0" : !picture && !toned && "border-0 bg-transparent", className)}
      style={color ? ({ background: color } as CSSProperties) : undefined}
    >
      <span
        className={cn(
          "grid size-full place-items-center leading-none",
          color
            ? "text-white [&_svg]:[stroke-width:1.75]"
            : toned
              ? "text-ink-on-color [&_span[data-mark]]:bg-ink-on-color!"
              : "text-cream-bright",
          picture ? "[&>*]:size-full" : glyphClass[size],
        )}
      >
        {mark ? <Mark of={mark} size={glyphSteps[size] * step} /> : Icon ? <Icon /> : children}
      </span>
    </Avatar>
  );
}
