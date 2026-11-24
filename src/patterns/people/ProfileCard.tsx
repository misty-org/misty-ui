import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ImagePlus, Pencil, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../class_names";
import { IconButton } from "../../controls/IconButton";
import { Text } from "../../display/Text";
import { RowGroup } from "../../layout/RowGroup";

/**
 * The profile card's banner, edge to edge across its top: the person's own picture, cropped to
 * `profileBannerSize`. With none it is a quiet fill. `onChange` adds the button that changes it,
 * shown while the banner is hovered or holds focus, over its top right corner.
 *
 * ```tsx
 * <DropdownMenuContent kind="card">
 *   <ProfileCardBanner src={banner} onChange={pickBanner} />
 *   <ProfileCardHeader face={…} />
 *   <ProfileCardName name="ana" line="Misty Cloud" status={<ProfileCardStatus … />} />
 *   <ProfileCardGroup><MenuItem … /></ProfileCardGroup>
 * </DropdownMenuContent>
 * ```
 */
export function ProfileCardBanner({
  src,
  onChange,
  changeLabel,
}: {
  src?: string | null;
  onChange?: () => void;
  changeLabel?: string;
}) {
  return (
    <div className="group/banner relative h-24 w-full flex-none overflow-hidden bg-charcoal-active">
      {src ? (
        <img src={src} alt="" draggable={false} className="block size-full object-cover" />
      ) : null}
      {onChange ? (
        <span className="absolute top-2 right-2 opacity-0 transition-opacity group-hover/banner:opacity-100 group-focus-within/banner:opacity-100">
          <IconButton
            variant="overlay"
            label={changeLabel ?? (src ? "Change banner" : "Add a banner")}
            onClick={onChange}
          >
            {src ? <Pencil /> : <ImagePlus />}
          </IconButton>
        </span>
      ) : null}
    </div>
  );
}

/**
 * Under the banner: the person's face, large (an xl Avatar in a `PresenceFace` with `face="xl"`),
 * centered and set half into the banner on a plate of the card's own color. Their name, line and
 * status follow in `ProfileCardName`, centered under it.
 */
export function ProfileCardHeader({ face }: { face: ReactNode }) {
  return (
    <div className="flex justify-center px-3">
      <span className="-mt-9 inline-flex flex-none rounded-full bg-charcoal-card p-1">{face}</span>
    </div>
  );
}

/**
 * The person's custom status as a bubble under their name: its emoji and words, or, with none
 * set, a muted "Set a status". Choosing it opens where the status is set. It is a row of the card's
 * menu, so the keyboard reaches it like the others.
 */
export function ProfileCardStatus({
  emoji,
  text,
  placeholder = "Set a status",
  onSelect,
}: {
  emoji?: string;
  text?: string;
  placeholder?: string;
  onSelect: () => void;
}) {
  const set = Boolean(emoji || text);
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(
        "flex min-h-8 max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-row-hover px-3 py-1.5 outline-none",
        "hover:bg-control-active focus:bg-control-active data-highlighted:bg-control-active",
        set ? "text-cream" : "text-cream-muted",
        "hover:text-cream-bright focus:text-cream-bright data-highlighted:text-cream-bright",
      )}
    >
      {set ? (
        emoji ? (
          <Text bare size="control" className="flex-none">
            {emoji}
          </Text>
        ) : null
      ) : (
        <Plus aria-hidden="true" />
      )}
      <Text size="meta" lines={2} className="min-w-0">
        {set ? text || "" : placeholder}
      </Text>
    </DropdownMenuPrimitive.Item>
  );
}

/**
 * The person's name, centered under their face, then one quiet line under it (their server, or
 * their handle), then their status bubble (`ProfileCardStatus`).
 */
export function ProfileCardName({
  name,
  line,
  status,
}: {
  name: ReactNode;
  line?: ReactNode;
  status?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 pt-2 pb-3 text-center">
      <Text size="title" weight="semibold" tone="bright" className="max-w-full">
        {name}
      </Text>
      {line ? (
        <Text size="meta" tone="muted" className="max-w-full">
          {line}
        </Text>
      ) : null}
      {status ? <div className="mt-2 flex max-w-full justify-center">{status}</div> : null}
    </div>
  );
}

/**
 * A group of the card's rows (MenuItem, MenuSubmenu): a RowGroup set into the card, apart from
 * the next group by a step: the person's own (Edit profile, Status), the account's, then help and
 * signing out.
 */
export function ProfileCardGroup({ children }: { children: ReactNode }) {
  return <RowGroup className="mx-2 mb-2">{children}</RowGroup>;
}

/**
 * The banner's size in pixels, the one it is cropped and scaled to when it's uploaded: 3:1, sharp
 * on the card (324 by 108) at more than four times over. A picture smaller than this keeps its own
 * size at the same shape.
 */
export const profileBannerSize = { width: 1500, height: 500 } as const;
