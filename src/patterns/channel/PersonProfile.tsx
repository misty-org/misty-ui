import type { ReactNode } from "react";

import { Text } from "../../display/Text";

/**
 * The other person's profile beside a one-to-one direct message, where a channel has its member
 * list: their face large (a `PresenceFace` with `face="xl"`), their name, their
 * own status line, then `PersonProfileSection`s about them. It sits in `ChannelMain`'s `side`, on
 * the chat's own fill, and carries no banner. A group's people are a `MemberList` instead.
 */
export function PersonProfile(props: {
  /** Accessible name of the panel, such as "Profile". */
  label: string;
  face: ReactNode;
  name: string;
  /** What the person says about themselves right now: their custom status. */
  line?: string;
  /** `PersonProfileSection`s. */
  children?: ReactNode;
}) {
  return (
    <aside
      aria-label={props.label}
      className="flex h-full min-h-0 w-72 shrink-0 flex-col overflow-y-auto pb-4"
    >
      <div className="flex flex-col items-start px-4 pt-6 pb-3">
        {props.face}
        <Text as="h2" size="title" weight="semibold" tone="bright" full className="mt-3 w-full">
          {props.name}
        </Text>
        {props.line ? (
          <Text as="p" size="control" wrap className="mt-2">
            {props.line}
          </Text>
        ) : null}
      </div>
      {props.children}
    </aside>
  );
}

/** One part of a `PersonProfile` under its muted heading, such as Friends since. */
export function PersonProfileSection(props: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 pt-2 pb-3">
      <Text as="h3" size="caption" weight="semibold" tone="muted" className="pb-1">
        {props.title}
      </Text>
      {props.children}
    </section>
  );
}
