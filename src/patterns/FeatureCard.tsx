import * as React from "react";

import { cn } from "../classNames";
import { Text } from "../display/Text";

/**
 * A featured pick at the top of a store page, as the App Store's: its banner fills the card, and
 * a short label, a title and one line sit at its bottom left over the page's own color fading in
 * from that side, so they read on any picture in either theme. The whole card opens the pick.
 * Show one only for something that has a banner; put two side by side in a FeatureRow.
 *
 * ```tsx
 * <FeatureCard banner={app.banner} eyebrow="App of the week" title="Cut a film with your agents"
 *   line="FilmCraft edits right in your Space." onOpen={() => openDetails(app)} />
 * ```
 */
export function FeatureCard({
  banner,
  eyebrow,
  title,
  line,
  onOpen,
}: {
  /** The picture that fills it: the app's banner. */
  banner: string;
  /** A short label over the title, such as "App of the week". */
  eyebrow?: string;
  title: string;
  line?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "relative flex min-h-60 min-w-0 items-end overflow-hidden rounded-xl text-left",
        "border border-charcoal-border bg-cover bg-center outline-none transition-colors",
        "hover:border-charcoal-border-strong focus-visible:border-charcoal-border-strong",
      )}
      style={{ backgroundImage: `url("${banner}")` }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--misty-theme-bg) 94%, transparent) 0%, " +
            "color-mix(in srgb, var(--misty-theme-bg) 72%, transparent) 45%, transparent 80%)",
        }}
      />
      <span className="relative grid max-w-[60%] gap-1.5 p-6">
        {eyebrow ? (
          <Text size="caption" tone="muted" weight="semibold">
            {eyebrow}
          </Text>
        ) : null}
        <Text as="span" size="display" tone="bright" weight="semibold" wrap>
          {title}
        </Text>
        {line ? (
          <Text as="span" size="control" tone="muted" wrap>
            {line}
          </Text>
        ) : null}
      </span>
    </button>
  );
}

/** Featured picks side by side: two to a row on a wide pane, one under another on a narrow one. */
export function FeatureRow({ children }: { children: React.ReactNode }) {
  return <div className="grid min-w-0 gap-4 lg:grid-cols-2">{children}</div>;
}
