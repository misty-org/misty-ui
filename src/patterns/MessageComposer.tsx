import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import { ArrowUp, X, type LucideIcon } from "lucide-react";
import { Textarea } from "../controls/Textarea";
import { IconButton, type IconButtonProps } from "../controls/IconButton";
import { CompactControls } from "../controls/RowContext";
import {
  ActionBar,
  type ActionBarItem,
  type ActionBarSize,
} from "../layout/ActionBar";
import { PathLine, type PathLineSegment } from "../layout/PathLine";
import { cn } from "../class_names";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import { uiPx } from "../lib/ui_scale";

/** The text box without its inset and type; the box grows to 180px, then scrolls. */
const textBaseClass =
  "block w-full max-h-40 min-w-0 resize-none whitespace-pre-wrap break-words";

/**
 * Shared by the plain composer's input and a mention overlay drawn over it, so their text wraps
 * identically. Body text at every window size.
 */
export const messageComposerTextClass = `${textBaseClass} px-1 py-2 text-body`;

/** The text box grows between these heights: one line, then up to max-h-40. */
const minInputPx = 38;
const maxInputPx = 160;
const channelInputPx = 32;

const channelTextClass = "px-1 py-1.5 text-body leading-5";

/**
 * plain: a bordered box that sits in its pane. card: the box floats as one roomy rounded card
 * on its raised fill alone (no edge, no shadow), the text and its bar inset alike
 * so the + glyph lines up with the text above it. dock: every chat's composer, as the chat's own
 * foot rather than a box in it: flush across the pane from edge to edge on the pane's color, with
 * one hairline along its top, edge to edge, so where the chat ends and the composer begins reads at
 * a glance; one line of text over its bar at rest, growing upward as the text does; its
 * bar sits 9px up from the pane's bottom, on the line of the profile row at the sidebar's foot.
 * It sits in `composerDockClass`. channel: one bar that never wraps: the leading `items` (the +
 * menu), the text, then `end` (emoji, Send), all in one row; as the text grows to more lines the
 * buttons stay on its last line's row.
 */
export type MessageComposerVariant = "plain" | "card" | "dock" | "channel";

const boxClass = {
  plain: "rounded-xl border",
  card: "relative rounded-xl",
  dock: "relative -mx-4 flex flex-col border-t border-charcoal-border px-2 pt-1.5 pb-2",
  channel: "relative rounded-xl",
} as const;
/** The box's edge and fill while nothing is dragged over it. */
const restingClass = {
  plain: "border-charcoal-border bg-charcoal-card",
  card: "bg-charcoal-card",
  dock: "",
  channel: "bg-charcoal-hover",
} as const;
/** Files dragged over the box. */
const draggingClass = {
  plain: "border-cream-muted bg-charcoal-hover",
  card: "bg-charcoal-hover hairline-outline outline-charcoal-border-strong",
  dock: "bg-charcoal-hover",
  channel: "bg-charcoal-active hairline-outline outline-charcoal-border-strong",
} as const;

/** The card's text: 15px in a 24.75px line, or body type in a taller box when roomy. */
const cardTextClass = {
  compact: "min-h-11 px-0.5 py-1 text-control leading-5.5",
  roomy: "min-h-16 px-0.5 py-1.5 text-body",
} as const;

/** The dock's text: one line at rest, 15px in a 24.75px line, the height of a control. */
const dockTextClass = "min-h-8 px-0.5 py-1.5 text-control leading-5.5";

export type MessageComposerProps = Omit<ComponentProps<"div">, "children"> & {
  inputProps: ComponentProps<typeof Textarea> & {
    [key: `data-${string}`]: unknown;
  };
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  /** plain (default), card or channel; see MessageComposerVariant. */
  variant?: MessageComposerVariant;
  /** card only: a taller box in body type, for a chat with nothing in it yet. */
  roomy?: boolean;
  /** Files are dragged over the box: its edge and fill say it will take them. */
  dragging?: boolean;
  /**
   * Above the text, inside the box: a reply banner, attachment chips. In the card it is laid in
   * one row that scrolls sideways when it outruns the box, never a stack.
   */
  context?: ReactNode;
  /** Drawn over the text box, such as mention highlights or a suggestion popup's anchor. */
  overlay?: ReactNode;
  /**
   * card only: rows about the chat's state at the top of the box, above the text, such as
   * messages queued to send next: each a ComposerStatusRow, together on one faint fill.
   */
  status?: ReactNode;
  /**
   * The bar under the text, in order: the leading controls (the + menu with attach and screen
   * capture, the mode), then the one long name that may shorten, such as the model, marked
   * `shrink`. It never wraps: labels turn into icons, the shrink item fades, then items fold
   * into ⋯, in the order their priorities say. In the channel variant they sit before the text,
   * in its row.
   */
  items?: ReadonlyArray<ActionBarItem>;
  /**
   * The bar's end, which never folds: the last controls and the send (or stop) button. In the
   * channel variant it sits after the text, in its row.
   */
  end?: ReactNode;
  /** The bar's accessible name. Default "Message options". */
  barLabel?: string;
  /** The bar's control height: md 36 (default) or sm 27. */
  barSize?: ActionBarSize;
  /** Where the chat works, as one quiet line under the box: Space › folder › branch. */
  path?: ReadonlyArray<PathLineSegment>;
  /** The path line's accessible name. Default "Where this chat works". */
  pathLabel?: string;
  /** Layout classes for the wrapper that holds the box and its path line, when there is one. */
  frameClassName?: string;
};

/**
 * The foot of a chat's pane that holds its `dock` composer, with what goes just above it (who is
 * typing, an error, the context bar) set 18px in from the pane's sides. The composer itself runs
 * edge to edge, flush with the pane's bottom. Wrap the composer in an element with this class.
 */
export const composerDockClass = "w-full shrink-0 px-4";

/**
 * The message box every chat uses. Layout only: feature adapters keep drafts, uploads, mentions
 * and sending. The text grows with its content, the bar under it gives way instead of wrapping,
 * and the path line sits under the box.
 *
 * ```tsx
 * <MessageComposer
 *   inputProps={{ value, onChange, "aria-label": "Message" }}
 *   items={[
 *     { id: "add", icon: Plus, label: "Add", priority: 3, render: () => <AddMenu />, menu: <AddRows /> },
 *     { id: "model", icon: Cpu, label: model.name, priority: 2, shrink: true, render: …, menu: … },
 *   ]}
 *   end={<MessageComposerSend label="Send" disabled={!value.trim()} />}
 *   path={[{ icon: Layers, label: space.name }, { icon: GitBranch, label: branch, menu: <BranchRows /> }]}
 * />
 * ```
 */
export const MessageComposer = forwardRef<HTMLDivElement, MessageComposerProps>(
  function MessageComposer(
    {
      inputProps,
      inputRef,
      context,
      overlay,
      status,
      items,
      end,
      barLabel = "Message options",
      barSize = "md",
      path,
      pathLabel = "Where this chat works",
      frameClassName,
      variant = "plain",
      roomy = false,
      dragging = false,
      className,
      ...props
    },
    ref,
  ) {
    const localRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = inputRef ?? localRef;
    const measured = useRef<string | null>(null);
    const oneBar = variant === "channel";
    const leastPx = oneBar ? channelInputPx : minInputPx;
    const resize = useCallback(() => {
      const input = textareaRef.current;
      if (!input) return;
      input.style.height = "0px";
      input.style.height = `${Math.min(uiPx(maxInputPx), Math.max(uiPx(leastPx), input.scrollHeight))}px`;
      measured.current = input.value;
    }, [textareaRef, leastPx]);
    useLayoutEffect(() => {
      const input = textareaRef.current;
      if (!input) return;
      if (
        measured.current !== null &&
        input.value.startsWith(measured.current) &&
        input.scrollHeight <= input.clientHeight
      )
        measured.current = input.value;
      else resize();
    }, [inputProps.value, textareaRef, resize]);
    useLayoutEffect(() => {
      const input = textareaRef.current;
      if (!input || typeof ResizeObserver === "undefined") return;
      let width = input.clientWidth;
      const observer = new ResizeObserver(() => {
        if (width === input.clientWidth) return;
        width = input.clientWidth;
        resize();
      });
      observer.observe(input);
      return () => observer.disconnect();
    }, [textareaRef, resize]);

    const hasBar = Boolean(items?.length || end);
    const docked = variant === "dock";
    const card = variant === "card" || variant === "channel" || docked;
    const box = (
      <div
        ref={ref}
        data-slot="message-composer"
        data-variant={variant}
        className={cn(
          "min-w-0 text-cream",
          boxClass[variant],
          dragging ? draggingClass[variant] : restingClass[variant],
          className,
        )}
        {...props}
      >
        {card && status ? (
          <div
            data-slot="message-composer-status"
            className="m-1 mb-0 flex min-w-0 flex-col gap-0.5 rounded-lg bg-row-hover empty:hidden"
          >
            {status}
          </div>
        ) : null}
        {card && context ? (
          <div
            data-slot="message-composer-context"
            className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden px-3 pt-2.5"
          >
            {context}
          </div>
        ) : (
          context
        )}
        <div
          data-slot="message-composer-text"
          className={cn(
            "flex min-w-0 items-end gap-1",
            oneBar
              ? "p-1"
              : docked
                ? "px-3"
                : card
                  ? hasBar
                    ? "px-3 pt-2.5"
                    : "px-3 py-2.5"
                  : hasBar
                    ? "px-2 pt-1.5"
                    : "p-1.5",
          )}
        >
          {oneBar && items?.length ? (
            <div
              data-slot="message-composer-start"
              className="flex h-8 shrink-0 items-center"
            >
              <ActionBar
                label={barLabel}
                size={barSize}
                width="content"
                items={items}
              />
            </div>
          ) : null}
          <div className="relative min-w-0 flex-1">
            {overlay}
            <Textarea
              {...inputProps}
              variant="composer"
              ref={textareaRef}
              rows={1}
              className={cn(
                oneBar
                  ? [textBaseClass, channelTextClass]
                  : docked
                    ? [textBaseClass, dockTextClass]
                    : card
                      ? [
                          textBaseClass,
                          cardTextClass[roomy ? "roomy" : "compact"],
                        ]
                      : messageComposerTextClass,
                inputProps.className,
              )}
            />
          </div>
          {oneBar && end ? (
            <div
              data-slot="message-composer-end"
              className="flex h-8 shrink-0 items-center gap-1"
            >
              {end}
            </div>
          ) : null}
        </div>
        {hasBar && !oneBar && (
          <div
            data-slot="message-composer-bar"
            className={cn(
              "flex min-w-0",
              docked ? "px-2" : card ? "px-2 pt-1 pb-2" : "px-1.5 pb-1.5",
            )}
          >
            <ActionBar
              label={barLabel}
              size={barSize}
              items={items ?? []}
              end={end}
            />
          </div>
        )}
      </div>
    );
    if (!path?.length) return box;
    return (
      <div
        data-slot="message-composer-frame"
        className={cn("flex min-w-0 flex-col", frameClassName)}
      >
        {box}
        <PathLine label={pathLabel} segments={path} className="px-3" />
      </div>
    );
  },
);

/**
 * The send button every composer shares, the height of every other control in the composer's row
 * (controls in one row share one height); a running agent can put its Stop button (the same size)
 * there instead.
 */
export function MessageComposerSend({
  busy,
  disabled,
  ...props
}: Omit<IconButtonProps, "children"> & {
  /** Sending: the button is disabled until it finishes. */
  busy?: boolean;
}) {
  return (
    <IconButton variant="primary" {...props} disabled={disabled || busy}>
      <ArrowUp />
    </IconButton>
  );
}

/**
 * A button that takes the send button's place, such as Stop while a reply runs: a solid square
 * like Send, in a soft wash instead of Send's bright fill, so the slot keeps its size and shape.
 * The tools beside Send (voice input, mention, emoji) are plain quiet IconButtons, washed only
 * under the pointer.
 */
export function MessageComposerAction({
  className,
  ...props
}: Omit<IconButtonProps, "variant" | "size">) {
  return <IconButton {...props} variant="soft" className={className} />;
}

/**
 * One row at the top of a card composer, about the chat's state: a muted glyph, what it says
 * (fading at the edge), and its actions at the end. 36px, the rows together on one faint fill;
 * the row makes its actions 27px, buttons and icon buttons alike.
 */
export function ComposerStatusRow(props: {
  icon: LucideIcon;
  /** A short muted word before the text, such as "Queued". */
  label?: string;
  children: ReactNode;
  /** Small quiet buttons at the row's end. */
  actions?: ReactNode;
}) {
  const Icon = props.icon;
  return (
    <div
      data-slot="composer-status-row"
      className={cn(
        "flex h-8 min-w-0 items-center gap-2 rounded-lg pr-1 pl-2 text-meta text-cream-muted",
      )}
    >
      <Icon aria-hidden className="shrink-0" />
      {props.label ? <span className="shrink-0">{props.label}</span> : null}
      <OverflowFadeText className="flex-1 text-cream">
        {props.children}
      </OverflowFadeText>
      {props.actions ? (
        <span className="flex shrink-0 items-center gap-0.5">
          <CompactControls>{props.actions}</CompactControls>
        </span>
      ) : null}
    </div>
  );
}

/**
 * A file waiting to go with the message, in the composer's `context` row: its kind's glyph, its
 * name (fading when long) and a × that takes it off. For pictures shown as thumbnails, a chat
 * draws its own tile.
 */
export function ComposerAttachment(props: {
  icon: LucideIcon;
  name: string;
  onRemove(): void;
}) {
  const Icon = props.icon;
  return (
    <div
      data-slot="composer-attachment"
      className="flex h-8 max-w-56 min-w-0 shrink-0 items-center gap-1.5 rounded-md bg-control-hover pr-0.5 pl-2 text-control text-cream"
    >
      <Icon aria-hidden className="shrink-0 text-cream-muted" />
      <OverflowFadeText className="min-w-0">{props.name}</OverflowFadeText>
      <IconButton
        size="sm"
        label={`Remove ${props.name}`}
        onClick={props.onRemove}
      >
        <X />
      </IconButton>
    </div>
  );
}
