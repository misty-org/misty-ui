import { Crown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../class_names";
import { Pressable } from "../../controls/Pressable";
import { RowTools } from "../../controls/RowTools";
import { OverflowFadeText } from "../../layout/OverflowFadeText";
import { RowActions } from "../../overlays/RowActions";
import { Tooltip } from "../../overlays/Tooltip";

export interface PersonRowProps {
  /** Their face: an Avatar at the default size in a `PresenceFace`. */
  face: ReactNode;
  name: string;
  /** The Space's owner: a crown after the name, named in its tooltip. */
  owner?: boolean;
  /**
   * One quiet line about them now, said in plain words: their own status, where they are ("In
   * Lounge in Weekend build"), what their agent is doing, or a request's state.
   */
  line?: string;
  /** Offline: the row dims until it is hovered. */
  away?: boolean;
  /** Opens them, such as their direct message. */
  onOpen?: () => void;
  /**
   * Buttons that always show at the row's end, for something waiting on the person (Accept and
   * Ignore on a friend request): labeled `Button`s at `sm`.
   */
  actions?: ReactNode;
  /** IconButtons shown at the row's end while it is hovered (Message, Call). */
  tools?: ReactNode;
  /** The rows of its ⋯ menu, also opened by a right-click; its name is "`name` actions". */
  menu?: ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * One person in a list of people, such as Friends: their face with its presence dot, their name,
 * and one quiet line about them under it, on a 54px row with no hairlines between rows. A request
 * keeps its answers in view (`actions`); otherwise the row's buttons show on hover (`tools`) before
 * one ⋯ (`menu`). A list of them goes in RowGroupSections (Requests, Online, Offline). A Space's
 * member list is `MemberRow`; a DM's sidebar row is a `NavRow`.
 */
export function PersonRow({
  face,
  name,
  owner = false,
  line,
  away = false,
  onOpen,
  actions,
  tools,
  menu,
  className,
}: PersonRowProps) {
  return (
    <div
      data-slot="person-row"
      className={cn(
        "group/row relative flex h-12 min-w-0 items-center gap-1 rounded-lg pr-1.5",
        "hover:bg-control-hover has-[[data-state=open]]:bg-control-hover",
        away && "opacity-55 hover:opacity-100 has-[[data-state=open]]:opacity-100",
        className,
      )}
    >
      <Pressable
        className="flex h-full min-w-0 flex-1 items-center gap-3 rounded-lg pl-2 text-left"
        onClick={onOpen}
        disabled={!onOpen}
      >
        {face}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex min-w-0 items-center gap-1">
            <OverflowFadeText className="min-w-0 text-control font-medium text-cream-bright">
              {name}
            </OverflowFadeText>
            {owner ? (
              <Tooltip content="Space owner">
                <span className="flex shrink-0 text-[var(--tone-waiting)]">
                  <Crown aria-label="Space owner" />
                </span>
              </Tooltip>
            ) : null}
          </span>
          {line ? (
            <OverflowFadeText className="min-w-0 text-meta text-cream-muted">{line}</OverflowFadeText>
          ) : null}
        </span>
      </Pressable>
      {actions ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
      {tools ? <RowTools reveal="hover">{tools}</RowTools> : null}
      {menu ? <RowActions label={`${name} actions`}>{menu}</RowActions> : null}
    </div>
  );
}
