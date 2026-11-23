import { Hand, HeadphoneOff, MicOff, SignalLow, Smile } from "lucide-react";
import * as React from "react";

import { cn } from "../../class_names";
import { IconButton } from "../../controls/IconButton";
import { SplitButton } from "../../controls/SplitButton";
import { Text } from "../../display/Text";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { DropdownMenu, DropdownMenuContent } from "../../overlays/DropdownMenu";
import { MenuTrigger } from "../../overlays/MenuTrigger";
import { Popover, PopoverContent, PopoverTrigger } from "../../overlays/Popover";

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
  /**
   * The call has lost its connection and is getting it back: every tile dims until it does. Say so
   * in words beside it (a notice), since dimming alone doesn't tell why.
   */
  dimmed?: boolean;
  /** Layout only. */
  className?: string;
}

/**
 * Where a call's people are seen, in a voice channel or a direct message's call: every tile
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
export function CallStage({ focus, children, dimmed = false, className }: CallStageProps) {
  const count = React.Children.count(children);
  const dim = "transition-opacity duration-300 data-[dimmed]:opacity-45";
  if (focus)
    return (
      <div
        data-slot="call-stage"
        data-dimmed={dimmed || undefined}
        aria-busy={dimmed || undefined}
        className={cn("grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_13rem] gap-2", dim, className)}
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
      data-dimmed={dimmed || undefined}
      aria-busy={dimmed || undefined}
      className={cn(
        "grid min-h-0 flex-1 auto-rows-fr gap-2",
        dim,
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
  /** They hear nothing of the call (an agent away doing what it was asked): crossed-out headphones by the name. */
  deafened?: boolean;
  /**
   * Their connection is poor, so their picture or voice may stutter: a low signal mark and the words
   * at the tile's bottom right, in the waiting tone. Leave it off while the connection is fine.
   */
  weak?: boolean;
  /**
   * Their hand is up: a ring in the waiting tone (unless they're talking) and a hand before their
   * name, until they or someone lowers it.
   */
  hand?: boolean;
  /**
   * Where their raised hand stands in line, 1 being first, shown after the hand while more than
   * one hand is up. Leave it off while theirs is the only one.
   */
  handPlace?: number;
  /**
   * A reaction they just sent, rising off the tile and fading. Give each a new `key` so the same
   * emoji twice plays twice; leave it off once it has played.
   */
  reaction?: { key: string | number; emoji: string };
  /**
   * How far the picture is zoomed in, 1 being whole. Above 1 the picture grows inside the tile,
   * which scrolls to move around it: for reading a shared screen.
   */
  zoom?: number;
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
  deafened = false,
  weak = false,
  hand = false,
  handPlace,
  reaction,
  zoom = 1,
  actions,
  className,
}: CallTileProps) {
  const zoomed = picture && zoom > 1;
  return (
    <figure
      data-slot="call-tile"
      data-speaking={speaking || undefined}
      data-hand={(hand && !speaking) || undefined}
      aria-label={speaking ? `${name}, speaking` : name}
      className={cn(
        "group/tile relative m-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-xl",
        "bg-[var(--color-control-hover)] outline-[length:var(--hairline)] outline-solid outline-[var(--misty-theme-border)]",
        "data-[speaking]:outline-2 data-[speaking]:-outline-offset-2 data-[speaking]:outline-[var(--tone-done)]",
        "data-[hand]:outline-2 data-[hand]:-outline-offset-2 data-[hand]:outline-[var(--tone-waiting)]",
        fit === "cover"
          ? "[&>video]:size-full [&>video]:object-cover"
          : "[&>video]:size-full [&>video]:object-contain",
        className,
      )}
    >
      {zoomed ? (
        <div className="absolute inset-0 overflow-auto [scrollbar-width:none]">
          <div
            className="[&>video]:size-full [&>video]:object-contain"
            style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
          >
            {picture}
          </div>
        </div>
      ) : (
        (picture ?? children ?? face)
      )}
      {reaction ? (
        <span
          key={reaction.key}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 text-display animate-[misty-rise-fade_2.4s_ease-out_forwards] motion-reduce:animate-none"
        >
          {reaction.emoji}
        </span>
      ) : null}
      <figcaption
        className={cn(
          "pointer-events-none absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] min-w-0 items-center gap-1.5",
          "rounded-md bg-black/55 px-2 py-0.5 text-caption text-white backdrop-blur-sm",
        )}
      >
        {hand ? (
          <span className="flex shrink-0 items-center gap-0.5 text-[var(--tone-waiting)]">
            <Hand
              aria-label={handPlace ? `Hand raised, ${ordinal(handPlace)} in line` : "Hand raised"}
            />
            {handPlace ? <span aria-hidden="true">{handPlace}</span> : null}
          </span>
        ) : null}
        {muted ? <MicOff aria-label="Muted" className="shrink-0" /> : null}
        {deafened ? <HeadphoneOff aria-label="Deafened" className="shrink-0" /> : null}
        <OverflowFadeText className="min-w-0">{name}</OverflowFadeText>
      </figcaption>
      {weak ? (
        <span
          className={cn(
            "pointer-events-none absolute right-2 bottom-2 flex items-center gap-1.5",
            "rounded-md bg-black/55 px-2 py-0.5 text-caption text-[var(--tone-waiting)] backdrop-blur-sm",
          )}
        >
          <SignalLow aria-hidden="true" className="shrink-0" />
          Weak connection
        </span>
      ) : null}
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

function ordinal(place: number): string {
  const tens = place % 100;
  if (tens >= 11 && tens <= 13) return `${place}th`;
  return `${place}${["th", "st", "nd", "rd"][place % 10] ?? "th"}`;
}

export interface CallCaptionLine {
  key: string | number;
  /** Who said it. */
  name: string;
  text: string;
}

export interface CallCaptionsProps {
  /** The last few things said, oldest first; each leaves on its own after a few seconds. */
  lines: CallCaptionLine[];
  /** Layout only. */
  className?: string;
}

/**
 * Live captions in a call, between its `CallStage` and its `CallBar`: the last few lines said, each
 * after its speaker's name, in a strip that keeps its height while captions are on, so the stage
 * never jumps as lines come and go. It is read out to screen readers as it changes.
 */
export function CallCaptions({ lines, className }: CallCaptionsProps) {
  return (
    <div
      data-slot="call-captions"
      role="log"
      aria-live="polite"
      aria-label="Captions"
      className={cn("grid min-h-18 flex-none content-end justify-items-center gap-1 pt-3", className)}
    >
      {lines.map((line) => (
        <p key={line.key} className="m-0 max-w-[72ch] text-center">
          <Text as="span" bare size="body" weight="semibold" tone="bright">
            {`${line.name} `}
          </Text>
          <Text as="span" bare size="body" tone="default" wrap>
            {line.text}
          </Text>
        </p>
      ))}
    </div>
  );
}

export interface CallBarProps {
  /** Its accessible name, such as "Call controls". */
  label?: string;
  /**
   * The call's controls as IconButtons: microphone, camera, screen, then the rest, with a
   * `ToolbarDivider`'s space before Leave (`variant="danger"`).
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

export interface CallControlProps {
  /** What pressing it does now, such as "Mute" or "Turn camera on": its accessible name and tooltip. */
  label: string;
  /** The glyph for its state now: a microphone, or a crossed-out one while muted. */
  children: React.ReactNode;
  /**
   * The thing is off (muted, camera off). The button fills, white in the dark theme and black in the
   * light one, so being muted reads at a glance from across the room, not only from the glyph.
   */
  off?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** The device menu's name, such as "Audio devices". Needed with `menu`. */
  menuLabel?: string;
  /**
   * The menu its chevron opens, as menu rows (`MenuLabel`, `MenuRadioGroup` of devices, a
   * `MenuCheckItem`): which microphone, speaker or camera the call uses. Without it there is no
   * chevron.
   */
  menu?: React.ReactNode;
  /** The device menu open or shut, for opening it from elsewhere (a notice's action). */
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
}

/**
 * One of a call's own toggles in its `CallBar`, the microphone or the camera: the button that turns
 * it on and off, filled while off so the state reads at a glance, and, with `menu`, a chevron
 * joined to it that opens the devices to pick from, above the bar. Other buttons in the bar (share
 * screen, full screen, Leave) stay plain IconButtons.
 *
 * ```tsx
 * <CallControl label={micOn ? "Mute" : "Unmute"} off={!micOn} onClick={toggleMic}
 *   menuLabel="Audio devices" menu={<MenuRadioGroup value={mic} onValueChange={pick}>…</MenuRadioGroup>}>
 *   {micOn ? <Mic /> : <MicOff />}
 * </CallControl>
 * ```
 */
export function CallControl({
  label,
  children,
  off = false,
  onClick,
  disabled,
  menuLabel,
  menu,
  menuOpen,
  onMenuOpenChange,
}: CallControlProps) {
  const variant = off ? "primary" : "secondary";
  const button = (
    <IconButton
      label={label}
      variant={variant}
      aria-pressed={off}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
  if (!menu) return button;
  return (
    <SplitButton label={label}>
      {button}
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <MenuTrigger iconOnly chevron variant={variant} label={menuLabel ?? label} />
        <DropdownMenuContent side="top" align="center" width="lg">
          {menu}
        </DropdownMenuContent>
      </DropdownMenu>
    </SplitButton>
  );
}

export interface CallReactionsProps {
  /** The reactions offered, each with its name for its tooltip and accessible name. */
  reactions: { emoji: string; label: string }[];
  /** Sends one into the call. The row stays open, so several can go in a row. */
  onPick: (emoji: string) => void;
  disabled?: boolean;
}

/**
 * Reactions in a call: a button in its `CallBar` that opens one row of emoji above it. A pick rises
 * off the sender's tile for everyone (`CallTile`'s `reaction`) and fades; nothing is kept.
 */
export function CallReactions({ reactions, onPick, disabled }: CallReactionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton label="Reactions" variant="secondary" disabled={disabled}>
          <Smile />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent kind="list" side="top" align="center" size="md">
        <div role="group" aria-label="Reactions" className="flex items-center gap-0.5">
          {reactions.map((reaction) => (
            <IconButton key={reaction.emoji} label={reaction.label} onClick={() => onPick(reaction.emoji)}>
              <span aria-hidden="true" className="text-title">
                {reaction.emoji}
              </span>
            </IconButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface CallLobbyProps {
  /** Your own picture before you join: a `CallTile` with your camera, or your face. */
  preview: React.ReactNode;
  /** The microphone and camera `CallControl`s, set as they'll be when you join. */
  controls: React.ReactNode;
  /** Where you're about to go, such as the voice channel's name. */
  title: string;
  /** Who is there now, in plain words ("Ana and Sam are here"). */
  line?: string;
  /** The one action, Join, as a primary `Button` at `lg`. */
  action: React.ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * Before joining a call: your own camera (or face) with the microphone and camera controls under
 * it, so you can see and set how you'll arrive, and beside it where you're going, who's there and
 * Join. Side by side on a wide pane, one over the other on a narrow one. A direct call rings
 * instead and has no lobby.
 */
export function CallLobby({ preview, controls, title, line, action, className }: CallLobbyProps) {
  return (
    <div
      data-slot="call-lobby"
      className={cn(
        "grid min-h-0 flex-1 content-center items-center gap-8 overflow-y-auto p-6",
        "md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="grid min-w-0 gap-3">
        <div className="grid aspect-video min-h-0 [&>*]:h-full">{preview}</div>
        <div className="flex items-center justify-center gap-1">{controls}</div>
      </div>
      <div className="grid min-w-0 justify-items-center gap-2 text-center md:justify-items-start md:text-left">
        <h2 className="m-0 min-w-0">
          <Text size="display" weight="semibold" tone="bright" wrap>
            {title}
          </Text>
        </h2>
        {line ? (
          <Text size="body" tone="muted" wrap>
            {line}
          </Text>
        ) : null}
        <div className="pt-3">{action}</div>
      </div>
    </div>
  );
}
