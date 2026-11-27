import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Field = HTMLInputElement | HTMLTextAreaElement;

interface Place {
  left: number;
  top: number;
  height: number;
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const mirrored = [
  "direction",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "font-stretch",
  "font-feature-settings",
  "font-variation-settings",
  "font-optical-sizing",
  "font-variant-ligatures",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-align",
  "text-indent",
  "text-transform",
  "tab-size",
  "word-break",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
] as const;

const marker = "data-misty-caret";
const ownCarets = ".cm-editor, .xterm";

function isField(element: Element): element is Field {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

function targetOf(element: Element | null): HTMLElement | null {
  if (!(element instanceof HTMLElement) || element.closest(ownCarets)) return null;
  const style = getComputedStyle(element);
  if (style.opacity === "0" || style.visibility === "hidden") return null;
  if (style.caretColor === "transparent" || style.caretColor === "rgba(0, 0, 0, 0)") return null;
  if (isField(element)) {
    if (element.disabled || element.readOnly) return null;
    try {
      if (typeof element.selectionStart !== "number") return null;
    } catch {
      return null;
    }
    return element;
  }
  return element.isContentEditable ? element : null;
}

function clip(element: Element, start: Box): Box {
  const box = { ...start };
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    if (style.overflowX === "visible" && style.overflowY === "visible") continue;
    const rect = parent.getBoundingClientRect();
    box.left = Math.max(box.left, rect.left);
    box.top = Math.max(box.top, rect.top);
    box.right = Math.min(box.right, rect.right);
    box.bottom = Math.min(box.bottom, rect.bottom);
  }
  box.left = Math.max(box.left, 0);
  box.top = Math.max(box.top, 0);
  box.right = Math.min(box.right, window.innerWidth);
  box.bottom = Math.min(box.bottom, window.innerHeight);
  return box;
}

function fieldPlace(field: Field): [Place, Box] | null {
  const at = field.selectionStart;
  if (at === null || at !== field.selectionEnd) return null;
  const area = field instanceof HTMLTextAreaElement;
  const style = getComputedStyle(field);
  const mirror = document.createElement("div");
  for (const name of mirrored) mirror.style.setProperty(name, style.getPropertyValue(name));
  Object.assign(mirror.style, {
    position: "fixed",
    visibility: "hidden",
    top: "0",
    left: "-9999px",
    boxSizing: "border-box",
    border: "0",
    width: `${field.clientWidth}px`,
    whiteSpace: area ? "pre-wrap" : "pre",
    overflowWrap: area ? "break-word" : "normal",
  });
  const value = field.type === "password" ? "●".repeat(field.value.length) : field.value;
  mirror.textContent = value.slice(0, at);
  const mark = document.createElement("span");
  mark.textContent = value.slice(at) || ".";
  mirror.append(mark);
  document.body.append(mirror);
  const box = mirror.getBoundingClientRect();
  const first = mark.getClientRects()[0];
  mirror.remove();
  if (!first) return null;
  const rect = field.getBoundingClientRect();
  const innerLeft = rect.left + field.clientLeft;
  const innerTop = rect.top + field.clientTop;
  const place = {
    left: innerLeft + first.left - box.left - field.scrollLeft,
    top: area
      ? innerTop + first.top - box.top - field.scrollTop
      : innerTop + (field.clientHeight - first.height) / 2,
    height: first.height,
  };
  const inner = {
    left: innerLeft,
    top: innerTop,
    right: innerLeft + field.clientWidth,
    bottom: innerTop + field.clientHeight,
  };
  return [place, inner];
}

function charRect(text: Text, from: number, end: "start" | "end"): Place | null {
  const range = document.createRange();
  range.setStart(text, from);
  range.setEnd(text, from + 1);
  const rects = range.getClientRects();
  const rect = end === "start" ? rects[0] : rects[rects.length - 1];
  if (!rect || !rect.height) return null;
  return { left: end === "start" ? rect.left : rect.right, top: rect.top, height: rect.height };
}

function blockPlace(node: Node): Place | null {
  const element = node instanceof Element ? node : node.parentElement;
  if (!element) return null;
  const host = element instanceof HTMLBRElement && element.parentElement ? element.parentElement : element;
  const style = getComputedStyle(host);
  const size = parseFloat(style.fontSize);
  const line = parseFloat(style.lineHeight) || size * 1.2;
  const height = size * 1.2;
  const rect = element.getBoundingClientRect();
  if (element !== host) {
    return { left: rect.left, top: rect.top + (Math.max(rect.height, line) - height) / 2, height };
  }
  return {
    left: rect.left + parseFloat(style.paddingLeft) + parseFloat(style.textIndent || "0"),
    top: rect.top + parseFloat(style.paddingTop) + (line - height) / 2,
    height,
  };
}

function editablePlace(root: HTMLElement): [Place, Box] | null {
  const selection = document.getSelection();
  if (!selection || !selection.rangeCount || !selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) return null;
  const collapsed = range.getClientRects()[0];
  let place: Place | null =
    collapsed && collapsed.height
      ? { left: collapsed.left, top: collapsed.top, height: collapsed.height }
      : null;
  const node = range.startContainer;
  const offset = range.startOffset;
  if (!place && node instanceof Text) {
    if (offset < node.length) place = charRect(node, offset, "start");
    if (!place && offset > 0) place = charRect(node, offset - 1, "end");
  }
  if (!place) place = blockPlace(node.childNodes[offset] ?? node);
  if (!place) return null;
  const rect = root.getBoundingClientRect();
  return [place, { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }];
}

function measure(target: HTMLElement): Place | null {
  const found = isField(target) ? fieldPlace(target) : editablePlace(target);
  if (!found) return null;
  const [place, inner] = found;
  const box = clip(target, inner);
  const middle = place.top + place.height / 2;
  if (middle < box.top || middle > box.bottom) return null;
  if (place.left < box.left - 1 || place.left > box.right + 1) return null;
  const pixel = window.devicePixelRatio || 1;
  return { ...place, left: Math.round(place.left * pixel) / pixel };
}

function same(a: Place | null, b: Place | null) {
  return a === b || (!!a && !!b && a.left === b.left && a.top === b.top && a.height === b.height);
}

function moving(target: HTMLElement) {
  return document.getAnimations().some((animation) => {
    if (animation.playState !== "running") return false;
    const effect = animation.effect;
    if (!(effect instanceof KeyframeEffect) || !(effect.target instanceof Element)) return false;
    if (!Number.isFinite(effect.getComputedTiming().endTime ?? Infinity)) return false;
    return effect.target.contains(target);
  });
}

const events = [
  "selectionchange",
  "select",
  "input",
  "keydown",
  "keyup",
  "pointerdown",
  "pointerup",
  "compositionupdate",
  "scroll",
] as const;

/**
 * The caret of every text field and every editable text (`input`, `textarea`, and rich text such
 * as a note's body): a thin line in the text's own caret color that blinks as the system's does,
 * drawn in place of WebKit's, which no style can make thinner. While it stands in, the focused
 * text's own caret is hidden. It follows the selection, shows only while nothing is selected and
 * the window has focus, stays inside the field and whatever scrolls around it, and follows the
 * field while something around it animates (a dialog opening), until that animation ends. Fields
 * whose caret can't be placed (email, number), fields that hide their caret, and editors that draw
 * a thin caret of their own (CodeMirror, the terminal) keep theirs. Mount it once at the app root,
 * beside `NoticeViewport`.
 */
export function TextCaret() {
  const [place, setPlace] = useState<Place | null>(null);
  const [color, setColor] = useState("");
  const [moves, setMoves] = useState(0);
  const target = useRef<HTMLElement | null>(null);
  const shown = useRef<Place | null>(null);
  const frame = useRef(0);
  const following = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const show = (next: Place | null) => {
      if (same(shown.current, next)) return;
      shown.current = next;
      setPlace(next);
      setMoves((count) => count + 1);
    };
    const update = () => {
      const current = target.current;
      show(current && document.hasFocus() && current.isConnected ? measure(current) : null);
    };
    const schedule = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(update);
    };
    const follow = () => {
      cancelAnimationFrame(following.current);
      const step = () => {
        const current = target.current;
        if (!current) return;
        update();
        if (moving(current)) following.current = requestAnimationFrame(step);
      };
      following.current = requestAnimationFrame(step);
    };
    const resized = new ResizeObserver(schedule);
    const release = () => {
      const current = target.current;
      if (!current) return;
      root.removeAttribute(marker);
      resized.unobserve(current);
      target.current = null;
    };
    const take = () => {
      const active = document.activeElement;
      if (active && active === target.current) return schedule();
      release();
      const next = targetOf(active);
      if (next) {
        setColor(getComputedStyle(next).caretColor);
        root.setAttribute(marker, "");
        resized.observe(next);
        target.current = next;
        follow();
      }
      schedule();
    };
    const animating = (event: Event) => {
      const current = target.current;
      if (current && event.target instanceof Element && event.target.contains(current)) follow();
    };
    document.addEventListener("focusin", take);
    document.addEventListener("focusout", take);
    for (const name of events) document.addEventListener(name, schedule, true);
    document.addEventListener("animationstart", animating, true);
    document.addEventListener("transitionrun", animating, true);
    window.addEventListener("resize", schedule);
    window.addEventListener("focus", schedule);
    window.addEventListener("blur", schedule);
    take();
    return () => {
      cancelAnimationFrame(frame.current);
      cancelAnimationFrame(following.current);
      document.removeEventListener("focusin", take);
      document.removeEventListener("focusout", take);
      for (const name of events) document.removeEventListener(name, schedule, true);
      document.removeEventListener("animationstart", animating, true);
      document.removeEventListener("transitionrun", animating, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("focus", schedule);
      window.removeEventListener("blur", schedule);
      release();
      resized.disconnect();
    };
  }, []);

  if (!place) return null;
  return createPortal(
    <span
      key={moves}
      aria-hidden="true"
      className="layer-caret pointer-events-none fixed top-0 left-0 w-px motion-safe:animate-[misty-caret-blink_1s_step-end_0.5s_infinite]"
      style={{
        height: place.height,
        backgroundColor: color,
        transform: `translate(${place.left}px, ${place.top}px)`,
      }}
    />,
    document.body,
  );
}
