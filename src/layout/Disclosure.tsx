import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as React from "react";

import { cn } from "../class_names";
import { Pressable } from "../controls/Pressable";
import { rowShape } from "../display/row_shape";
import { FoldChevron } from "../overlays/MenuChevron";
import { CollapsibleContent } from "./Collapsible";

/**
 * `section`: a question or heading in page text with room around it, such as a frequently asked
 * question or a release's notes, one of a DisclosureList's rows on its group's fill.
 * `row`: a 36px row in a list of links, such as a group in a docs sidebar, washing on hover.
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
 * group of links in a docs sidebar. The whole heading is the button, with a FoldChevron at its
 * end that turns down while open. Put several sections in a DisclosureList, which sets them on
 * one RowGroup's fill with no lines between them. A "show more" under a list is DisclosureButton; a fold with a trigger of its own is
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
              : "flex min-h-10 items-center gap-4 rounded-lg px-3 py-2 text-control font-medium text-cream-bright",
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          <FoldChevron className="text-cream-muted" />
        </Pressable>
      </CollapsiblePrimitive.Trigger>
      <CollapsibleContent>
        <div className={kind === "row" ? "pb-2" : "px-3 pb-3 text-control text-cream-muted"}>
          {children}
        </div>
      </CollapsibleContent>
    </CollapsiblePrimitive.Root>
  );
}

/** Disclosure sections one under another on one RowGroup's fill, with no lines between them. */
function DisclosureList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="disclosure-list"
      className={cn("flex flex-col gap-0.5 rounded-xl bg-row-hover p-1", className)}
      {...props}
    />
  );
}

export { Disclosure, DisclosureList };
