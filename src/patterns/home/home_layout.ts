import { cn } from "../../class_names";
import { rowShapeTwoLine } from "../../display/row_shape";

/**
 * The home itself: its blocks down one column. It adds no room above the first block: the page's
 * scroller already keeps it as far from the top as from the sides.
 */
export const spaceHomeClass = "@container grid gap-7";

/** The wrap the items' grid measures when the home shows items instead of its overview. */
export const homeItemsWrapClass = "@container";

/** A block: its heading, then whatever it holds, the holder taking the rest of the height. */
export const homeSectionClass =
  "grid min-w-0 grid-rows-[auto_1fr] content-start gap-2.5";

/** A block set in a panel: room inside its edge, its heading a little tighter at the top. */
export const homePanelClass = "px-4 pt-2.5 pb-3";

/**
 * A block that starts a new part of the page: a hairline above it, the home's gap before the line
 * and a shorter step after it, so the heading sits with what it heads.
 */
export const homeDividedClass = "border-t border-charcoal-border pt-4";

/** The Space's pages: two, three, then six across. */
export const homePlacesClass =
  "grid grid-cols-2 gap-3 @min-[32.5rem]:grid-cols-3 @min-[50rem]:grid-cols-6";

/**
 * Blocks in pairs on a wide home, flat on the page like the rest of it: a hairline above each row
 * and one between the two blocks of a pair, so the overview reads as one sheet ruled into places
 * rather than a stack of cards. An odd block out takes the whole row instead of leaving a hole
 * beside it.
 */
export const homePairClass =
  "grid grid-cols-1 items-stretch gap-y-7 @min-[50rem]:grid-cols-2 " +
  "[&>*]:border-t [&>*]:border-charcoal-border [&>*]:pt-4 " +
  "@min-[50rem]:[&>:nth-child(odd):not(:last-child)]:border-r " +
  "@min-[50rem]:[&>:nth-child(odd):not(:last-child)]:pr-6 " +
  "@min-[50rem]:[&>:nth-child(even)]:pl-6 " +
  "@min-[50rem]:[&>:last-child:nth-child(odd)]:col-span-full";

/** Items (and agents): one, two, three, then four across. */
export const homeItemsClass =
  "grid grid-cols-1 gap-3 @min-[32.5rem]:grid-cols-2 @min-[50rem]:grid-cols-3 @min-[75rem]:grid-cols-4";

/**
 * The agents' cards on the home, in the items' columns: the home's columns replace the cards' own
 * grid (AgentsNow's `agents-now`).
 */
export const homeAgentsClass =
  "[&>.agents-now]:grid-cols-1 @min-[32.5rem]:[&>.agents-now]:grid-cols-2 " +
  "@min-[50rem]:[&>.agents-now]:grid-cols-3 @min-[75rem]:[&>.agents-now]:grid-cols-4";

/** A row of PlaceChips: they sit side by side and wrap, sized to their names. */
export const homeChipsClass = "flex flex-wrap gap-2";

/** A page tile's frame: one slim row, its icon on a quiet square, then its name. */
export const homePlaceClass =
  "flex h-12 min-w-0 items-center gap-2.5 px-3 text-left text-meta transition-colors duration-120";

/** A row on a panel: its mark, its title over one quiet line, then what belongs at its end. */
export const overviewRowClass = cn(rowShapeTwoLine, "w-full");
