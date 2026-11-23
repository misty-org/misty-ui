import * as React from "react";

import { cn } from "../class_names";

/**
 * A bordered surface for a tile in the collection grid. Rows that belong together (a settings
 * section, an invitation's people) are a RowGroup instead, and panes are flat, never cards.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = "default", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-6 overflow-hidden rounded-xl border border-charcoal-border",
        "bg-charcoal-card py-6 text-body text-cream shadow-none data-[size=sm]:gap-4 data-[size=sm]:py-4",
        "has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card };

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "sm";
};
