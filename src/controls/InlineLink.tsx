import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../classNames";
import { Pressable } from "./Pressable";

export type InlineLinkProps = React.ComponentPropsWithoutRef<"button"> & {
  /**
   * Styles its one child instead, such as a router Link or an `<a>`, for a link that goes to
   * another page rather than running something here.
   */
  asChild?: boolean;
};

const inlineLinkClass = "underline underline-offset-2 hover:text-cream-bright";

/**
 * A link inside a line of text, such as the terms in a page's small print: underlined, in the
 * text's own color, brightening on hover. It is a button; the caller opens the page. With
 * `asChild` it styles a real link instead.
 *
 * ```tsx
 * By continuing you agree to our <InlineLink onClick={openTerms}>Terms</InlineLink>
 * <InlineLink asChild><Link to="/register">Create an account</Link></InlineLink>
 * ```
 */
const InlineLink = React.forwardRef<HTMLButtonElement, InlineLinkProps>(
  ({ className, asChild = false, ...props }, ref) =>
    asChild ? (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        data-slot="inline-link"
        className={cn("cursor-pointer outline-none", inlineLinkClass, className)}
        {...props}
      />
    ) : (
      <Pressable
        ref={ref}
        data-slot="inline-link"
        className={cn(inlineLinkClass, className)}
        {...props}
      />
    ),
);
InlineLink.displayName = "InlineLink";

export { InlineLink };
