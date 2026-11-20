import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../classNames";
import { Pressable } from "../controls/Pressable";
import { rowShape } from "../display/rowShape";
import { CollapsibleContent } from "./Collapsible";

/**
 * `section`: a question or heading in page text with room around it, such as a frequently asked
 * question or a release's notes, split from its neighbours by a DisclosureList's hairlines.
 * `row`: a 32px row in a list of links, such as a group in a docs sidebar, washing on hover.
 */
export type DisclosureKind = "section" | "row";

export type DisclosureProps = {
  /** What the heading says; the whole heading row is the button that opens it. */
  title: React.ReactNode;
  /** Defaults to section. */
  kind?: DisclosureKind;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** What it shows while open. */
  children: React.ReactNode;
  /** Layout only, such as a margin. */
  className?: string;
};

/**
 * A heading that opens to more under it: a page's questions and answers, a release's notes, a
 * group of links in a docs sidebar. The whole heading is the button, with a chevron at its end
 * that turns over while open. Put several sections in a DisclosureList to split them by
 * hairlines. A "show more" under a list is DisclosureButton; a fold with a trigger of its own is
 * Collapsible.
 *
 * ```tsx
 * <DisclosureList>
 *   <Disclosure title="Can I self-host?">Yes, with every feature.</Disclosure>
 * </DisclosureList>
 * ```
 */
function Disclosure({
  title,
  kind = "section",
  open,
  defaultOpen,
  onOpenChange,
  children,
  className,
}: DisclosureProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="disclosure"
      data-kind={kind}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn("group/disclosure min-w-0", className)}
    >
      <CollapsiblePrimitive.Trigger asChild>
        <Pressable
          wash={kind === "row" ? "row" : "text"}
          className={cn(
            "w-full",
            kind === "row"
              ? cn(rowShape, "text-control text-cream-muted aria-expanded:text-cream")
              : "flex items-center gap-4 py-4 text-page font-medium text-cream-bright",
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          <ChevronDown
            aria-hidden="true"
            className="shrink-0 text-cream-muted transition-transform group-data-[state=open]/disclosure:rotate-180"
          />
        </Pressable>
      </CollapsiblePrimitive.Trigger>
      <CollapsibleContent>
        <div className={kind === "row" ? "pb-2" : "pb-6 text-page text-cream-muted"}>
          {children}
        </div>
      </CollapsibleContent>
    </CollapsiblePrimitive.Root>
  );
}

/** Disclosure sections one under another, split by hairlines. */
function DisclosureList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="disclosure-list"
      className={cn("flex flex-col divide-y divide-charcoal-border", className)}
      {...props}
    />
  );
}

export { Disclosure, DisclosureList };
