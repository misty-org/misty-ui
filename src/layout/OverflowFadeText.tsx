import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { cn } from "../class_names";
import { Tooltip, type TooltipSide } from "../overlays/Tooltip";

/** The elements a label can be. A label is one line of text, or two with `lines={2}`. */
export type OverflowFadeElement =
  | "span"
  | "div"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "dt"
  | "dd"
  | "label"
  | "td"
  | "th"
  | "strong"
  | "em"
  | "small"
  | "code"
  | "time"
  | "figcaption"
  | "legend"
  | "summary"
  | "ul"
  | "ol"
  | "blockquote";

export interface OverflowFadeTextProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Defaults to `span`, laid out as a block so it can clip. */
  as?: OverflowFadeElement;
  /** With `as="time"`: the machine-readable moment it shows. */
  dateTime?: string;
  /**
   * Shows the whole text in a tooltip, only while it doesn't fit. `true` uses the label's own
   * text; a string is shown instead, for a label whose children aren't plain text.
   */
  full?: boolean | string;
  /**
   * Which side of the label that tooltip opens on. Defaults to top, flipping when there's no room;
   * a label in a bar along the window's top, such as a tab, opens beside it so the tooltip never
   * drops over a native page under the bar.
   */
  fullSide?: TooltipSide;
  /**
   * How many lines the text may take before its last line fades. Text over more than one line
   * wraps between words; a caller's `whitespace-pre-wrap` keeps its own line breaks.
   */
  lines?: number;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}

const layoutClass = (lines: number) =>
  lines === 1
    ? "block min-w-0 overflow-hidden whitespace-nowrap"
    : lines === 2
      ? "block min-w-0 overflow-hidden whitespace-normal [overflow-wrap:anywhere] max-h-[2lh]"
      : "block min-w-0 overflow-hidden whitespace-normal [overflow-wrap:anywhere]";
const fadeClass = (lines: number) =>
  lines === 1 ? "fade-end" : lines === 2 ? "fade-end-2" : "fade-end-lines";

/**
 * Long text (names, models, paths, branches) shortens with a fade at its end, never an ellipsis.
 * The fade appears only while the text doesn't fit, and follows the label as its box or text
 * changes. This is the default for every label in shared components. Every label shares one
 * ResizeObserver, and plain text is measured again only when it changes, so long lists of them
 * stay cheap.
 */
export function OverflowFadeText({
  as: Tag = "span",
  className,
  children,
  full,
  fullSide,
  lines = 1,
  ref,
  ...props
}: OverflowFadeTextProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [text, setText] = useState("");

  const attach = useCallback(
    (node: HTMLElement | null) => {
      setElement(node);
      assignRef(ref, node);
    },
    [ref],
  );

  const measure = useCallback(() => {
    if (!element) return;
    const next =
      lines > 1
        ? element.scrollHeight > element.clientHeight + 1
        : element.scrollWidth > element.clientWidth + 1;
    setOverflowing((current) => (current === next ? current : next));
    if (full === true && next) setText(element.textContent ?? "");
  }, [element, lines, full]);

  const plain = typeof children === "string" || typeof children === "number";

  useLayoutEffect(() => {
    if (!element) return;
    const stopResize = watchSize(element, measure);
    if (!sizeObserved()) measure();
    if (plain || typeof MutationObserver === "undefined") return stopResize;
    const mutations = new MutationObserver(measure);
    mutations.observe(element, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => {
      stopResize();
      mutations.disconnect();
    };
  }, [element, measure, plain]);

  const measured = useRef<{ element: HTMLElement | null; children: ReactNode }>(
    {
      element: null,
      children: undefined,
    },
  );
  useLayoutEffect(() => {
    const last = measured.current;
    measured.current = { element, children };
    if (!element || last.element !== element) return;
    if (plain && last.children === children) return;
    measure();
  }, [element, children, plain, measure]);

  const label = (
    <Tag
      {...props}
      ref={attach}
      className={cn(
        layoutClass(lines),
        className,
        overflowing && fadeClass(lines),
      )}
      style={
        lines > 2 ? { maxHeight: `${lines}lh`, ...props.style } : props.style
      }
      data-text-overflowing={overflowing ? "true" : "false"}
    >
      {children}
    </Tag>
  );

  const tooltip = typeof full === "string" ? full : full ? text : "";
  if (!overflowing || !tooltip) return label;
  return (
    <Tooltip content={tooltip} side={fullSide}>
      {label}
    </Tooltip>
  );
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as RefObject<T | null>).current = value;
}

const sizeWatchers = new Map<Element, () => void>();
let sizeObserver: ResizeObserver | null = null;

function sizeObserved() {
  return typeof ResizeObserver !== "undefined";
}

function watchSize(element: HTMLElement, update: () => void) {
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }
  sizeObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) sizeWatchers.get(entry.target)?.();
  });
  sizeWatchers.set(element, update);
  sizeObserver.observe(element);
  return () => {
    if (sizeWatchers.get(element) === update) sizeWatchers.delete(element);
    sizeObserver?.unobserve(element);
  };
}
