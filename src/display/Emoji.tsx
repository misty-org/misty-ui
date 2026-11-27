import { parse } from "@twemoji/parser";
import { Fragment, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "../class_names";

let urls: Record<string, string> | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function load() {
  loading ??= import("./twemoji_urls").then(
    (module) => {
      urls = module.twemojiUrls;
      for (const listener of listeners) listener();
    },
    () => {
      loading = null;
    },
  );
}

function useTwemoji() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      load();
      return () => listeners.delete(listener);
    },
    () => urls,
    () => null,
  );
}

const fileOf = (url: string) => url.slice(url.lastIndexOf("/") + 1, -4);

/** Where an emoji's drawing is in the bundled set, or null until it loads or when it has none. */
export function emojiImage(emoji: string): string | null {
  const found = parse(emoji, { assetType: "svg" })[0];
  return (found && urls?.[fileOf(found.url)]) || null;
}

/**
 * Text cut into its plain runs and its emoji, in order, for a renderer that draws each emoji
 * itself (Markdown, rich text): each piece is `{ text }` or `{ emoji }`. Text with no emoji comes
 * back as one piece.
 */
export function splitEmoji(
  text: string,
): ({ text: string } | { emoji: string })[] {
  const found = parse(text, { assetType: "svg" });
  if (!found.length) return [{ text }];
  const pieces: ({ text: string } | { emoji: string })[] = [];
  let at = 0;
  for (const entity of found) {
    const [start, end] = entity.indices;
    if (start > at) pieces.push({ text: text.slice(at, start) });
    pieces.push({ emoji: entity.text });
    at = end;
  }
  if (at < text.length) pieces.push({ text: text.slice(at) });
  return pieces;
}

/**
 * One emoji, drawn from Misty's bundled Twemoji set, so it looks the same on macOS, Windows and
 * Linux whatever emoji font the system has: an image sized to the text around it, which reads as
 * the emoji itself to assistive technology and when copied. Until the set has loaded, or for an
 * emoji newer than it, the system's own emoji shows. Text with emoji among its words is
 * `EmojiText`.
 */
export function Emoji(props: { emoji: string; className?: string }) {
  const loaded = useTwemoji();
  const found = loaded ? emojiImage(props.emoji) : null;
  if (!found) return <span className={props.className}>{props.emoji}</span>;
  return (
    <img
      src={found}
      alt={props.emoji}
      draggable={false}
      className={cn(
        "inline-block size-[1.25em] align-[-0.3em]",
        props.className,
      )}
    />
  );
}

/**
 * Text whose emoji are drawn from Misty's bundled Twemoji set (`Emoji`), the words between them
 * left as they are: a message's text, a name, a status.
 */
export function EmojiText(props: { children: string }): ReactNode {
  useTwemoji();
  const pieces = splitEmoji(props.children);
  if (pieces.length === 1 && "text" in pieces[0]!) return props.children;
  return pieces.map((piece, index) =>
    "emoji" in piece ? (
      <Emoji key={index} emoji={piece.emoji} />
    ) : (
      <Fragment key={index}>{piece.text}</Fragment>
    ),
  );
}
