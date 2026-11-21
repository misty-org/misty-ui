/**
 * The UI's sizes are written in design pixels on a 4px grid (a 32px row, a 280px sidebar), and
 * drawn through the spacing step (`--spacing` in styles/theme.css), so they grow with it: at the
 * 4.5px step a 32px row draws at 36. The root font size is always 100% (never scaled). Lengths kept
 * in JS go through these so they stay in step with the CSS beside them.
 */

/** The 4px the design pixels are written against. */
const DESIGN_STEP_PX = 4;

/** CSS pixels per rem: the root's font size, which is the browser's 16px. */
function rootPx(): number {
  if (typeof document === "undefined") return 16;
  const size = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return size > 0 ? size : 16;
}

/** The spacing step in rem, read from `--spacing`; 0.25 (4px) where the theme isn't loaded. */
function stepRem(): number {
  if (typeof document === "undefined") return 0.25;
  const value = getComputedStyle(document.documentElement).getPropertyValue("--spacing").trim();
  const length = Number.parseFloat(value);
  if (!Number.isFinite(length) || length <= 0) return 0.25;
  return value.endsWith("px") ? length / rootPx() : length;
}

/** A design length as CSS, in rem, for a style or a custom property. */
export function remCss(px: number): string {
  return `${(px / DESIGN_STEP_PX) * stepRem()}rem`;
}

/** How many CSS pixels one design pixel is: the spacing step over the 4px grid. */
export function uiScale(): number {
  return (stepRem() * rootPx()) / DESIGN_STEP_PX;
}

/** A design length in CSS pixels, for math beside measured boxes and pointer positions. */
export function uiPx(px: number): number {
  return px * uiScale();
}

/** A measured length in CSS pixels back in design pixels, for a size that is saved. */
export function designPx(cssPx: number): number {
  return cssPx / uiScale();
}

/** A length from a custom property ("12px" or "0.75rem"), in CSS pixels; custom properties come back as written. */
export function cssLengthPx(value: string): number {
  const length = Number.parseFloat(value);
  if (!Number.isFinite(length)) return 0;
  return value.trim().endsWith("rem") ? length * rootPx() : length;
}
