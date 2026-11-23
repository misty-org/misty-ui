import type { CSSProperties } from "react";
import { LogoInitial, LogoPlate } from "./LogoFallbacks";
import { markAssets } from "./mark_assets";
import markData from "./marks.json";
import { MistyMark } from "./MistyMark";

export type MarkRender = "theme" | "color" | "plate-dark" | "plate-light";
export type MarkKind = "brand" | "engine" | "provider";

export interface MarkEntry {
  name: string;
  kinds: MarkKind[];
  render: MarkRender;
  aliases?: string[];
  source: string;
}

/**
 * Every third-party mark Misty shows, by id, from `marks.json`: its name, what it marks (a brand, an
 * engine, a provider), how it renders, the other names it is asked for by (`engine:claude`, `twitter`)
 * and where its artwork came from. The artwork is `marks/<id>.svg`; `npm run marks` checks the two agree.
 */
export const marks = markData as Record<string, MarkEntry>;

const aliasTable: Record<string, string> = Object.fromEntries(
  Object.entries(marks).flatMap(([id, entry]) => (entry.aliases ?? []).map((alias) => [alias, id])),
);

export interface ResolvedMark {
  id: string;
  name: string;
  render: MarkRender;
  src: string;
}

function lookup(key: string): string | undefined {
  if (Object.prototype.hasOwnProperty.call(marks, key)) return key;
  if (Object.prototype.hasOwnProperty.call(aliasTable, key)) return aliasTable[key];
  return undefined;
}

/** The mark asked for by an id or any of its aliases, or nothing when Misty has no artwork for it. */
export function markFor(value: string | null | undefined): ResolvedMark | undefined {
  if (!value) return undefined;
  const key = value.trim().toLowerCase().replace(/[ _]+/g, "-");
  const id = lookup(key) ?? lookup(key.replace(/^(?:builtin|integration|provider):/, ""));
  if (!id) return undefined;
  const entry = marks[id];
  return { id, name: entry.name, render: entry.render, src: markAssets[id] };
}

/** Whether Misty has artwork for this id or alias; Misty's own mark counts. */
export const hasMark = (value: string | null | undefined): boolean =>
  isMisty(value) || Boolean(markFor(value));

const isMisty = (value: string | null | undefined) => value === "misty" || value === "engine:misty";

interface MarkProps {
  /** The mark's id or one of its aliases, such as `anthropic`, `engine:claude` or `twitter`. */
  of: string | null | undefined;
  size?: number | string;
  /**
   * The subject's name, for a mark that stands alone: its accessible name, and the initial shown when
   * there's no artwork. Leave it out when a label beside the mark already says it.
   */
  label?: string;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

/**
 * The one way to draw a third-party mark (a brand, an engine, a provider): its official artwork, rendered
 * as its entry in `marks.json` says. A `theme` mark is one color and follows the theme, black on light and
 * white on dark; a `color` mark keeps its own colors; a `plate-*` mark sits on a small plate on the theme
 * where it would disappear. Misty's own mark is `misty`. With no artwork it shows the subject's initial,
 * never nothing and never a stand-in glyph. An app's own icon is `AppLogoImage`, not this.
 */
export function Mark({ of, size = 24, label, className, style, ...aria }: MarkProps) {
  const hidden = aria["aria-hidden"] ?? !label;
  const role = label ? "img" : undefined;
  if (isMisty(of))
    return (
      <MistyMark size={size} className={className} style={style} aria-hidden={hidden} aria-label={label} role={role} />
    );
  const mark = markFor(of);
  if (!mark)
    return (
      <span
        role={role}
        aria-label={label}
        aria-hidden={hidden}
        className={className}
        data-mark=""
        style={{ display: "inline-flex", flexShrink: 0, verticalAlign: "middle", ...style }}
      >
        <LogoInitial name={label ?? (of ?? "").replace(/^[a-z]+:/, "")} size={size} />
      </span>
    );
  if (mark.render === "theme") {
    const mask = `url("${mark.src}") center / contain no-repeat`;
    return (
      <span
        role={role}
        aria-label={label}
        aria-hidden={hidden}
        className={className}
        data-mark={mark.id}
        style={{
          display: "inline-block",
          flexShrink: 0,
          verticalAlign: "middle",
          width: size,
          height: size,
          ...style,
          WebkitMask: mask,
          mask,
          backgroundColor: "light-dark(#000, #fff)",
        }}
      />
    );
  }
  const image = (
    <img
      src={mark.src}
      alt={label ?? ""}
      aria-hidden={hidden}
      width={size}
      height={size}
      draggable={false}
      className={className}
      data-mark={mark.id}
      style={{
        display: "inline-block",
        flexShrink: 0,
        objectFit: "contain",
        verticalAlign: "middle",
        width: size,
        height: size,
        ...style,
      }}
    />
  );
  if (mark.render === "color") return image;
  return <LogoPlate plate={mark.render === "plate-dark" ? "dark" : "light"}>{image}</LogoPlate>;
}
