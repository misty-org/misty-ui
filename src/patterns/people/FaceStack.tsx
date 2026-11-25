import type { ReactNode } from "react";

import { cn } from "../../class_names";
import { Pressable } from "../../controls/Pressable";
import { Text } from "../../display/Text";
import { Tooltip } from "../../overlays/Tooltip";

export type FaceStackPerson = {
  /** Stable id, handed back to `onSelect`. */
  id: string;
  /** Their name, in the face's tooltip and accessible name. */
  name: string;
  /** Their face: an `Avatar` at `sm`, with no presence dot. */
  face: ReactNode;
};

export type FaceStackProps = {
  /** Who is around, in the order to show them. */
  people: FaceStackPerson[];
  /** What the faces add up to, after them: "7 online". Shown alone while `people` is empty. */
  label: string;
  /** Picks one of them, such as opening their profile beside the list. */
  onSelect?: (id: string) => void;
  /** How many faces show before the rest are only counted in `label`. Default 5. */
  most?: number;
  /** Layout only. */
  className?: string;
};

/**
 * Who is around right now, as one quiet group in a page's bar: a few faces overlapping, each cut
 * out of the one under it by a ring of the frame's color and named in Misty's tooltip, then a muted
 * count ("7 online"). Pressing a face picks that person. It sits in a FramedBar beside the page's
 * search, as on Friends. Who has a file open is `InUseMark`; a Space's people are its member list.
 *
 * `<FaceStack people={online} label="7 online" onSelect={open} />`
 */
export function FaceStack({ people, label, onSelect, most = 5, className }: FaceStackProps) {
  const shown = people.slice(0, most);
  return (
    <span data-slot="face-stack" className={cn("flex min-w-0 shrink-0 items-center gap-2", className)}>
      {shown.length ? (
        <span className="flex items-center -space-x-1.5">
          {shown.map((person) => (
            <Tooltip key={person.id} content={person.name}>
              <Pressable
                aria-label={person.name}
                disabled={!onSelect}
                onClick={() => onSelect?.(person.id)}
                className="flex rounded-full ring-2 ring-charcoal-sidebar"
              >
                {person.face}
              </Pressable>
            </Tooltip>
          ))}
        </span>
      ) : null}
      <Text size="meta" tone="muted">
        {label}
      </Text>
    </span>
  );
}
