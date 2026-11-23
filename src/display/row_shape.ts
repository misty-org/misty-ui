/**
 * The one shape of a list row in Misty, shared by NavRow, ListRow, TreeRow and menu rows: 36px
 * tall, 8px corners (`rounded-md`), 9px in from each side and 9px between its parts. A feature
 * never sizes, rounds or pads a row of its own; it takes this, so no two lists differ.
 */
export const rowShape = "flex h-8 min-w-0 items-center gap-2 rounded-md px-2";

/** The same row when its text may wrap to a second line: at least 36px, with 4.5px above and below. */
export const rowShapeWrap = "flex min-h-8 min-w-0 items-center gap-2 rounded-md px-2 py-1";

/** A row with a second, muted line under its label (ListRow's `description`): at least 54px. */
export const rowShapeTwoLine = "flex min-h-12 min-w-0 items-center gap-2 rounded-md px-2 py-1.5";
