import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Text } from "../../display/Text";
import { DropdownMenu, DropdownMenuContent } from "../../overlays/DropdownMenu";
import { MenuTrigger } from "../../overlays/MenuTrigger";
import { ProfileCardBanner } from "../people/ProfileCard";

/**
 * The other person's profile beside a one-to-one direct message, where a channel has its member
 * list, laid out like the profile card: their banner edge to edge (a quiet fill without one), their
 * face large (a `PresenceFace` with `face="xl"`) centered and set half into it on a plate of the
 * column's color, their name and their own status line centered under it, then
 * `PersonProfileSection`s about them. `menu` puts a ⋯ over the banner's corner with what can be
 * done about the person (Remove friend, Block). It fills the column it is given (a FramedPage's end
 * column), on that column's fill. A group's people are a `MemberList` instead.
 */
export function PersonProfile(props: {
  /** Accessible name of the panel, such as "Profile". */
  label: string;
  /** Their banner picture, cropped to `profileBannerSize`; without one it is a quiet fill. */
  banner?: string | null;
  face: ReactNode;
  name: string;
  /** What the person says about themselves right now: their custom status. */
  line?: string;
  /** Rows of the ⋯ menu over the banner (MenuItems). */
  menu?: ReactNode;
  /** `PersonProfileSection`s. */
  children?: ReactNode;
}) {
  return (
    <aside
      aria-label={props.label}
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto pb-4"
    >
      <div className="relative flex-none">
        <ProfileCardBanner src={props.banner} />
        {props.menu ? (
          <span className="absolute top-2 right-2">
            <DropdownMenu>
              <MenuTrigger label="More" icon={MoreHorizontal} iconOnly variant="overlay" />
              <DropdownMenuContent align="end" aria-label={`${props.name}, more`}>
                {props.menu}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        ) : null}
      </div>
      <div className="flex flex-col items-center px-4 pb-3 text-center">
        <span className="-mt-9 inline-flex flex-none rounded-full bg-charcoal-sidebar p-1">
          {props.face}
        </span>
        <Text as="h2" size="title" weight="semibold" tone="bright" full className="mt-2 max-w-full">
          {props.name}
        </Text>
        {props.line ? (
          <Text as="p" size="control" wrap className="mt-1 max-w-full">
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
