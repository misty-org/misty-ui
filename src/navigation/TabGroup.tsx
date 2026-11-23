import type { ReactNode } from "react";

/** Chrome's tab group colors, in Chrome's order. */
export const tabGroupColors = [
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
  "orange",
] as const;
export type TabGroupColor = (typeof tabGroupColors)[number];

const colorNames: Record<TabGroupColor, string> = {
  grey: "Grey",
  blue: "Blue",
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  pink: "Pink",
  purple: "Purple",
  cyan: "Cyan",
  orange: "Orange",
};

/** A tab group color's name, for a menu of colors to pick. */
export function tabGroupColorName(color: TabGroupColor): string {
  return colorNames[color];
}

/** Whether a saved value is one of the tab group colors, for reading a group back from storage. */
export function isTabGroupColor(value: unknown): value is TabGroupColor {
  return tabGroupColors.includes(value as TabGroupColor);
}

/** A tab group color's token, for the chip and line `TabStrip` draws in it. */
export const tabGroupTone = (color: TabGroupColor) => `var(--tone-group-${color})`;

/** One group of tabs in a `TabStrip`, drawn as Chrome draws it. */
export interface TabStripGroup {
  id: string;
  /** The group's name on its chip; an unnamed group's chip is a dot of its color. */
  label: string;
  color: TabGroupColor;
  /** Only the chip shows; its tabs fold away until it is pressed again. */
  collapsed?: boolean;
  /** The group's actions as menu rows, on a right-click of its chip. */
  menu?: ReactNode;
}

/**
 * One tab group color as a small round mark in its 18px glyph box, before the color's name in a
 * menu of colors to pick for a group. `label` is its accessible name, usually the color's name.
 */
export function TabGroupDot({ color, label }: { color: TabGroupColor; label?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="inline-flex size-4 shrink-0 items-center justify-center"
    >
      <span
        className="inline-block size-2.5 rounded-full"
        style={{ backgroundColor: tabGroupTone(color) }}
      />
    </span>
  );
}
