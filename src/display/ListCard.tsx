import * as React from "react";
import { cn } from "../class_names";

/**
 * A short list of like rows on one RowGroup's fill, with no edge and no lines between them, such
 * as the engines to set up on first run. The rows are its `li` children. `className` is for layout.
 *
 * ```tsx
 * <ListCard aria-label="Engines">{engines.map((engine) => <EngineSetupRow … />)}</ListCard>
 * ```
 */
export const ListCard = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="list-card"
      className={cn(
        "m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-0.5 overflow-hidden rounded-xl",
        "bg-row-hover p-1",
        className,
      )}
      {...props}
    />
  ),
);
ListCard.displayName = "ListCard";
