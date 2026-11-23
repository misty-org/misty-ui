import * as React from "react";

import { cn } from "../class_names";
import { FoldChevron } from "../overlays/MenuChevron";
import { Button, type ButtonProps } from "./Button";

export type DisclosureButtonProps = Omit<ButtonProps, "variant" | "icon" | "iconEnd"> & {
  /** Whether what it shows is open: the chevron turns down. */
  open: boolean;
};

/**
 * Shows or hides more of a list under it, such as More engines: a quiet, muted button at the
 * start of its row with a FoldChevron that turns down as it opens. The caller mounts what it shows.
 *
 * ```tsx
 * <DisclosureButton open={more} onClick={() => setMore((open) => !open)}>
 *   {more ? "Fewer engines" : "More engines"}
 * </DisclosureButton>
 * ```
 */
const DisclosureButton = React.forwardRef<HTMLButtonElement, DisclosureButtonProps>(
  ({ open, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="quiet"
      aria-expanded={open}
      className={cn("justify-self-start text-cream-muted", className)}
      {...props}
    >
      <FoldChevron open={open} />
      {children}
    </Button>
  ),
);
DisclosureButton.displayName = "DisclosureButton";

export { DisclosureButton };
