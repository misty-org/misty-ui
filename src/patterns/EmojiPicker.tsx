import {
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";
import { IconButton } from "../controls/IconButton";
import { Text } from "../display/Text";
import { Skeleton } from "../feedback/Skeleton";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../overlays/DropdownMenu";
import { MenuRadioGroup, MenuRadioItem } from "../overlays/MenuItem";
import {
  PickerSearch,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../overlays/Popover";

/** One emoji to pick: the character itself and its name, which its tooltip and the footer show. */
export type EmojiChoice = { emoji: string; name: string };

/** A run of emoji under a heading, with the glyph its jump button wears. */
export type EmojiSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  emojis: EmojiChoice[];
};

/** The skin tone emoji are offered in: the six choices as they read, and the one in use. */
export type EmojiSkinTones = {
  /** Each tone's name and the hand that shows it, the default first. */
  options: { label: string; sample: string }[];
  value: number;
  onChange(value: number): void;
};

/**
 * The emoji picker: a search on top, a row of jump buttons for its sections, then the emoji in a
 * grid under their headings, and the one under the pointer named along the bottom. It brings no
 * emoji of its own: the caller hands in its `sections` (empty while they load, drawn as a
 * skeleton) and its `search`, and remembers what was picked. Shift-click picks without closing. Open it from its child (the trigger), or, with
 * `anchor`, from anything that sets `open`, such as a menu's "Add reaction".
 */
export function EmojiPicker(props: {
  /** The button that opens it. Leave it out to open the picker by `open` over `anchor`. */
  children?: ReactElement;
  /** Where it opens from when it has no trigger child. */
  anchor?: ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  /** Empty while the emoji load: the grid is a skeleton until they arrive. */
  sections: EmojiSection[];
  search(query: string): EmojiChoice[];
  onPick(emoji: string, keepOpen: boolean): void;
  skinTones?: EmojiSkinTones;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  const [ownOpen, setOwnOpen] = useState(false);
  const open = props.open ?? ownOpen;
  const change = (next: boolean) => {
    setOwnOpen(next);
    props.onOpenChange?.(next);
  };
  return (
    <Popover open={open} onOpenChange={change}>
      {props.children ? (
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      ) : (
        <PopoverAnchor asChild>{props.anchor ?? <span />}</PopoverAnchor>
      )}
      <PopoverContent
        kind="flush"
        size="lg"
        side={props.side ?? "top"}
        align={props.align ?? "end"}
        aria-label="Emoji"
        collisionPadding={16}
      >
        {open ? (
          <EmojiPickerBody
            sections={props.sections}
            search={props.search}
            skinTones={props.skinTones}
            onPick={(emoji, keepOpen) => {
              props.onPick(emoji, keepOpen);
              if (!keepOpen) change(false);
            }}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function EmojiPickerBody(props: {
  sections: EmojiSection[];
  search(query: string): EmojiChoice[];
  skinTones?: EmojiSkinTones;
  onPick(emoji: string, keepOpen: boolean): void;
}) {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<EmojiChoice | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const { search } = props;
  const results = useMemo(
    () => (query.trim() ? search(query) : null),
    [query, search],
  );
  const jump = (id: string) => {
    setQuery("");
    requestAnimationFrame(() =>
      grid.current
        ?.querySelector(`[data-emoji-section="${CSS.escape(id)}"]`)
        ?.scrollIntoView({ block: "start" }),
    );
  };
  const cells = (emojis: EmojiChoice[]) => (
    <div className="grid grid-cols-8 gap-0.5">
      {emojis.map((choice) => (
        <Pressable
          key={choice.emoji}
          type="button"
          wash="control"
          aria-label={choice.name}
          onPointerEnter={() => setHovered(choice)}
          onFocus={() => setHovered(choice)}
          onClick={(event) => props.onPick(choice.emoji, event.shiftKey)}
          className="grid size-9 place-items-center rounded-md text-display leading-none"
        >
          {choice.emoji}
        </Pressable>
      ))}
    </div>
  );
  const tone = props.skinTones;
  return (
    <div className="flex h-96 min-h-0 flex-col">
      <div className="flex min-w-0 items-center">
        <div className="min-w-0 flex-1">
          <PickerSearch
            autoFocus
            aria-label="Search emoji"
            placeholder="Search emoji"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              const first = results?.[0];
              if (!first) return;
              event.preventDefault();
              props.onPick(first.emoji, event.shiftKey);
            }}
          />
        </div>
        {tone ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton label="Skin tone" size="sm" className="mr-2">
                <span aria-hidden="true" className="text-control leading-none">
                  {tone.options[tone.value]?.sample}
                </span>
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <MenuRadioGroup
                value={String(tone.value)}
                onValueChange={(value) => tone.onChange(Number(value))}
              >
                {tone.options.map((option, index) => (
                  <MenuRadioItem
                    key={option.label}
                    value={String(index)}
                    label={`${option.sample} ${option.label}`}
                  />
                ))}
              </MenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      {props.sections.length && !results ? (
        <div
          className="flex shrink-0 items-center gap-0.5 px-1 pt-1"
          role="toolbar"
          aria-label="Emoji sections"
        >
          {props.sections.map((section) => {
            const Icon = section.icon;
            return (
              <IconButton
                key={section.id}
                label={section.title}
                size="sm"
                onClick={() => jump(section.id)}
              >
                <Icon />
              </IconButton>
            );
          })}
        </div>
      ) : null}
      <div ref={grid} className="min-h-0 flex-1 overflow-y-auto px-1 pb-1">
        {!props.sections.length ? (
          <div
            className="grid grid-cols-8 gap-0.5 pt-2"
            role="status"
            aria-label="Emoji"
          >
            {Array.from({ length: 40 }, (_, index) => (
              <Skeleton key={index} className="size-9 rounded-md" />
            ))}
          </div>
        ) : results ? (
          results.length ? (
            <div className="pt-1">{cells(results)}</div>
          ) : (
            <Text as="p" size="meta" tone="muted" className="px-2 py-3">
              No emoji match
            </Text>
          )
        ) : (
          props.sections.map((section) => (
            <section
              key={section.id}
              data-emoji-section={section.id}
              aria-label={section.title}
              className="[content-visibility:auto]"
            >
              <Text
                as="h3"
                size="caption"
                weight="medium"
                tone="muted"
                className="px-1 pt-2 pb-1"
              >
                {section.title}
              </Text>
              {cells(section.emojis)}
            </section>
          ))
        )}
      </div>
      <div
        className={cn(
          "flex h-10 shrink-0 items-center gap-2 border-t border-charcoal-border px-3",
          !hovered && "invisible",
        )}
        aria-hidden="true"
      >
        <span className="text-title leading-none">{hovered?.emoji}</span>
        <OverflowFadeText className="min-w-0 text-meta text-cream-muted">
          {hovered?.name ?? ""}
        </OverflowFadeText>
      </div>
    </div>
  );
}
