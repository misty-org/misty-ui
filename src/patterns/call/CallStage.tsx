import { MicOff } from "lucide-react";
import * as React from "react";

import { cn } from "../../classNames";
import { OverflowFadeText } from "../../layout/OverflowFadeText";

/** How many columns the tiles take, by how many people are in the call. */
function columns(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  return "grid-cols-4";
}

export interface CallStageProps {
  /**
   * The tile everyone is looking at (a shared screen, a person picked), drawn large with the rest
   * of the tiles in a strip beside it. Without it every tile shares the stage equally.
   */
  focus?: React.ReactNode;
  /** The call's tiles (`CallTile`), one per person. */
  children: React.ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * Where a call's people are seen, as Discord's voice channel and call views draw them: every tile
 * shares the stage, in columns that fit how many there are (one fills it, two side by side, then a
 * grid, up to eight), with an odd last tile in a pair of columns taking the whole row. With
 * `focus`, that tile fills the stage and the rest sit in a strip beside it. It fills its parent;
 * the call's controls (`CallBar`) go under it.
 *
 * ```tsx
 * <CallStage focus={sharing ? <CallTile name="Ana's screen" fit="contain" picture={screen} /> : undefined}>
 *   <CallTile name="Ana" speaking picture={camera} />
 *   <CallTile name="Sam" muted face={<Avatar>…</Avatar>} />
 * </CallStage>
 * ```
 */
export function CallStage({ focus, children, className }: CallStageProps) {
  const count = React.Children.count(children);
  if (focus)
    return (
      <div
        data-slot="call-stage"
        className={cn("grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_13rem] gap-2", className)}
      >
        <div className="grid min-h-0 [&>*]:h-full">{focus}</div>
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&>*]:aspect-video [&>*]:flex-none">
          {children}
        </div>
      </div>
    );
  return (
    <div
      data-slot="call-stage"
      className={cn(
        "grid min-h-0 flex-1 auto-rows-fr gap-2",
        columns(count),
        count > 1 && count <= 4 && "[&>*:last-child:nth-child(odd)]:col-span-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface CallTileProps {
  /** Who it is, at its foot. */
  name: string;
  /** Their camera or a shared screen: a `video` element, filling the tile. */
  picture?: React.ReactNode;
  /** Shown in the middle when there is no picture: their avatar, at `lg`. */
  face?: React.ReactNode;
  /** In place of a picture or a face, such as a shared screen waiting to be watched. */
  children?: React.ReactNode;
  /** How the picture fills the tile: a camera covers it, a screen is shown whole. */
  fit?: "cover" | "contain";
  /** Talking now: a ring in the done tone, as `VoicePerson` draws it in the sidebar. */
  speaking?: boolean;
  /** Their microphone is off: a crossed-out microphone by the name. */
  muted?: boolean;
  /** IconButtons at its top right, shown while it is hovered or holds focus. */
  actions?: React.ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * One person in a call, in a `CallStage`: their camera or shared screen filling a rounded tile,
 * else their face in the middle of a quiet well, and their name at its foot on a dark chip so it
 * reads over any picture. Whoever is talking is ringed in the done tone. The tile's own buttons
 * (full screen, stop watching) show on hover at its top right.
 */
export function CallTile({
  name,
  picture,
  face,
  children,
  fit = "cover",
  speaking = false,
  muted = false,
  actions,
  className,
}: CallTileProps) {
  return (
    <figure
      data-slot="call-tile"
      data-speaking={speaking || undefined}
      aria-label={speaking ? `${name}, speaking` : name}
      className={cn(
        "group/tile relative m-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-xl",
        "bg-[var(--color-control-hover)] outline-[length:var(--hairline)] outline-solid outline-[var(--misty-theme-border)]",
        "data-[speaking]:outline-2 data-[speaking]:-outline-offset-2 data-[speaking]:outline-[var(--tone-done)]",
        fit === "cover"
          ? "[&>video]:size-full [&>video]:object-cover"
          : "[&>video]:size-full [&>video]:object-contain",
        className,
      )}
    >
      {picture ?? children ?? face}
      <figcaption
        className={cn(
          "pointer-events-none absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] min-w-0 items-center gap-1.5",
          "rounded-md bg-black/55 px-2 py-0.5 text-caption text-white backdrop-blur-sm",
        )}
      >
        {muted ? <MicOff aria-label="Muted" className="shrink-0 opacity-70" /> : null}
        <OverflowFadeText className="min-w-0">{name}</OverflowFadeText>
      </figcaption>
      {actions ? (
        <div
          className={cn(
            "absolute top-2 right-2 flex items-center gap-0.5 rounded-lg bg-black/55 p-0.5 text-white backdrop-blur-sm",
            "opacity-0 transition-opacity duration-150 group-hover/tile:opacity-100 group-focus-within/tile:opacity-100",
            "[&_[data-slot=button]]:text-white",
          )}
        >
          {actions}
        </div>
      ) : null}
    </figure>
  );
}

export interface CallBarProps {
  /** Its accessible name, such as "Call controls". */
  label?: string;
  /**
   * The call's controls as IconButtons: microphone, camera, screen, then the rest, with a
   * `ToolbarDivider` before Leave (`variant="danger"`).
   */
  children: React.ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * A call's controls in one centered row under its `CallStage`, the same in every place the call
 * shows (a voice channel's page, a DM, full screen). It never wraps; Leave, the one danger button,
 * comes last.
 */
export function CallBar({ label = "Call controls", children, className }: CallBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      data-slot="call-bar"
      className={cn("flex flex-none items-center justify-center gap-1 pt-3", className)}
    >
      {children}
    </div>
  );
}
