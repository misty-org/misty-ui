import { cn } from "../class_names";
import { Spinner } from "./Spinner";

/**
 * A first load whose shape isn't known until the data arrives: one spinner in the middle of its
 * pane, shown only once the wait passes 300ms, so a quick load shows nothing at all.
 *
 * Which one to use is one question: can the content be drawn before the data arrives? When it can
 * (rows, cards, settings rows, shelves, a tree) it is a skeleton shaped like it (`SkeletonList`,
 * `ListRowSkeleton`, `CollectionSkeleton`, `ShelfSkeleton`). When the layout depends on the data
 * (a chat's messages, a thread, a document or file preview, a diff, an item's details, a pane
 * where unrelated things load at once) it is this.
 *
 * One loader per pane: never a spinner inside a skeleton or beside another. A part of a loaded
 * page that still waits takes `inline`, the same spinner sized to that part. It stands in for data
 * only: a tool getting ready is `SetupState`, and a failed load gives way to `ErrorState`.
 */
function PaneLoading({
  label,
  inline = false,
  className,
}: {
  /** What is loading, for screen readers ("Loading messages"). It is never shown. */
  label: string;
  /**
   * Sits in the flow instead of filling the pane: a section, a list under a loaded heading, a
   * dialog's body. It takes its own room above and below; don't wrap it in a sized box.
   */
  inline?: boolean;
  /** Layout only. */
  className?: string;
}) {
  return (
    <div
      data-slot="pane-loading"
      role="status"
      aria-label={label}
      aria-busy="true"
      className={cn(
        "misty-appear-late grid min-w-0 place-items-center text-cream-muted",
        inline ? "w-full py-12" : "size-full min-h-0 p-6",
        className,
      )}
    >
      <Spinner label={false} size={inline ? "default" : "lg"} />
    </div>
  );
}

export { PaneLoading };
