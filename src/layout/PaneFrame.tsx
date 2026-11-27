import type { HTMLAttributes, Ref } from "react";
import { cn } from "../class_names";
import "./pane_frame.css";

const paneFrameClass = cn(
  "misty-pane-frame relative isolate overflow-clip",
  "[--pane-chrome:var(--misty-window-chrome,var(--misty-theme-workspace))]",
  "pt-[var(--pane-seam-top)] pr-[var(--pane-seam-right)]",
  "pb-[var(--pane-seam-bottom)] pl-[var(--pane-seam-left)]",
);

export interface PaneFrameProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * A pane set into the window's chrome, for the window's tab panels: the one inset panel the work
 * sits on. It keeps a margin of chrome around what it holds, `--pane-seam-top/right/bottom/left`
 * wide (the shell's geometry writes them), rounds the corners into the chrome (`--pane-corner-*`)
 * and draws the panel's hairline edge just inside that margin (`--pane-edge`, a color), all above
 * whatever is inside (`--layer-pane-corners`, `--layer-pane-seams`), so native pages and toolbars
 * stay within the curve. The pane itself
 * stays transparent, since a native page may show through it: only the margin and the corners
 * are painted, in `--misty-window-chrome`. A hidden pane that keeps its layout (`data-tab-kept`)
 * draws neither, and every animation inside it pauses until it shows again, so a spinner in a
 * hidden tab never keeps the window redrawing.
 */
export function PaneFrame({ className, ref, ...props }: PaneFrameProps) {
  return (
    <div ref={ref} data-slot="pane-frame" className={cn(paneFrameClass, className)} {...props} />
  );
}
