import * as React from "react";
import { cn } from "../class_names";
import { OverflowFadeText } from "../layout/OverflowFadeText";

export type PropertyListItem = {
  /** Stable key; defaults to the label. */
  id?: string;
  /** The key, in sentence case: "Model", "Folder", "Started". */
  label: string;
  /**
   * The value. Text fades at its end and shows in full in a tooltip when cut; a node (a mark, a
   * link, a short control) is laid out as given.
   */
  value: React.ReactNode;
  /**
   * For a node value with text in it, such as a link: the node then fades like text and this is
   * its tooltip. Leave it out for marks and controls.
   */
  full?: string;
};

export type PropertyListProps = {
  items: ReadonlyArray<PropertyListItem>;
  /**
   * `side` (default): the key on the left, the value on the right of a 36px row. `stacked`: the
   * value under its key, for narrow panes or long values such as paths. `info`: Finder's and Kura's
   * Get Info, the key right-aligned in a narrow muted column and the value beside it in the meta
   * role, wrapping onto more lines (a long path shows whole). `grouped`: 36px rows on one
   * RowGroup's fill, the key in the text color and the value muted at the row's end, for facts
   * that stand as their own group (a store item's facts, an inspector's details).
   */
  layout?: "side" | "stacked" | "info" | "grouped";
  /** What the list describes, for screen readers, such as "Run details". */
  label?: string;
  /** Layout only: margins or placement. */
  className?: string;
};

/**
 * Key and value pairs about one thing: a run's model and folder, a file's size and date. Keys are
 * muted, values are the text, and neither wraps: long values fade at their end.
 *
 * ```tsx
 * <PropertyList label="Run details" items={[
 *   { label: "Model", value: run.model },
 *   { label: "Folder", value: run.folder },
 *   { label: "State", value: <StateMark kind="done" /> },
 * ]} />
 * ```
 */
export function PropertyList({ items, layout = "side", label, className }: PropertyListProps) {
  return (
    <dl
      aria-label={label}
      data-slot="property-list"
      data-layout={layout}
      className={cn(
        "m-0 grid min-w-0",
        layout === "info" ? "gap-1.5 text-meta" : "text-control",
        layout === "stacked" && "gap-2",
        layout === "grouped" && "grid-cols-[minmax(0,1fr)] gap-0.5 rounded-xl bg-row-hover p-1",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.id ?? item.label}
          className={cn(
            "min-w-0",
            layout === "side"
              ? "flex h-8 items-center gap-4"
              : layout === "grouped"
                ? "flex h-8 items-center gap-4 rounded-lg pr-2 pl-3"
              : layout === "info"
                ? "grid grid-cols-[--spacing(18)_minmax(0,1fr)] items-baseline gap-3"
                : "grid gap-0.5",
          )}
        >
          <dt
            className={cn(
              "m-0 min-w-0",
              layout === "grouped" ? "text-cream" : "text-cream-muted",
              layout === "side" || layout === "grouped" ? "max-w-[50%] shrink-0" : "text-meta",
              layout === "info" && "text-right",
            )}
          >
            {layout === "info" ? item.label : <OverflowFadeText full>{item.label}</OverflowFadeText>}
          </dt>
          <dd
            className={cn(
              "m-0 flex min-w-0 items-center",
              layout === "grouped" ? "text-cream-muted" : "text-cream",
              (layout === "side" || layout === "grouped") && "flex-1 justify-end text-right",
              layout === "info" && "block [overflow-wrap:anywhere]",
            )}
          >
            {layout === "info" && (typeof item.value === "string" || typeof item.value === "number") ? (
              item.value
            ) : typeof item.value === "string" || typeof item.value === "number" ? (
              <OverflowFadeText full>{item.value}</OverflowFadeText>
            ) : item.full ? (
              <OverflowFadeText full={item.full}>{item.value}</OverflowFadeText>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
