import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../class_names";

/**
 * The chevron on anything that opens a menu or popover: one glyph, one size, muted. It turns over
 * while its trigger is open (the trigger carries `data-state="open"`), so every dropdown moves the
 * same way. Only its stroke turns, around the glyph's middle, while its box stays put, so WebKit
 * never snaps a turning box and the controls beside it hold still as the menu opens. Only
 * MenuTrigger and Select's field draw it; a feature never does.
 */
export function MenuChevron({ className }: { className?: string }) {
  return (
    <ChevronDown
      aria-hidden
      className={cn("misty-menu-chevron size-3.5 shrink-0 text-cream-muted", className)}
    />
  );
}

/**
 * The chevron on anything that shows or hides what is under it (a heading's group, a question's
 * answer, more of a list, a tree's folder): it points right while closed and down while open, as
 * Finder's do. Without `open` it follows its trigger's `data-state`, as a Collapsible's does. A
 * menu's chevron is MenuChevron instead.
 */
export function FoldChevron({ open, className }: { open?: boolean; className?: string }) {
  return (
    <ChevronRight
      aria-hidden
      className={cn(
        "shrink-0 transition-transform duration-120 ease-[ease] motion-reduce:transition-none",
        open === undefined ? "[[data-state=open]>&]:rotate-90" : open && "rotate-90",
        className,
      )}
    />
  );
}
