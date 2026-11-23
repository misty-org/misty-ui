import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "../class_names";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    /**
     * The stronger hairline, for a line that joins things rather than parting them (a mind
     * map's branches) or one shown under the pointer (a pane's resize seam).
     */
    strong?: boolean;
  }
>(({ className, orientation = "horizontal", decorative = true, strong, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0",
      strong ? "bg-charcoal-border-strong" : "bg-charcoal-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

/**
 * The space between two groups of controls in a bar, such as the call buttons and the rest of a
 * chat's header, or the view toggle and the sort and filter buttons. It draws no line: groups sit
 * side by side, a step apart, never each in a box of its own.
 */
function ToolbarDivider({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("w-2 shrink-0", className)} />;
}

export { Separator, ToolbarDivider };
