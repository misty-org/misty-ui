import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import { cn } from "../class_names";
import { SectionHeading, type SectionHeadingAction } from "./SectionHeading";

/**
 * Related rows on one faint fill, as the profile card groups its rows: 14px corners, 4.5px in and
 * a hairline's width between rows, with no line between them and no edge around them. The fill is
 * a wash of the text color, so it reads one step up from whatever it sits on: a page, a side
 * column, a popup or a dialog. Its rows bring their own height (ListRow, PersonRow, SettingsRow,
 * MenuItem); keep one kind of row in a group. Groups go one under another in a RowGroupStack,
 * each under its label (`RowGroupSection`). Lines are for a page's frame, never between rows.
 *
 * ```tsx
 * <RowGroupStack>
 *   <RowGroupSection title="Online" count={4}>{people.map((p) => <PersonRow … />)}</RowGroupSection>
 * </RowGroupStack>
 * ```
 */
export function RowGroup({
  as: Tag = "div",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "div" | "ul"; className?: string }) {
  return (
    <Tag
      role={Tag === "ul" ? undefined : "group"}
      data-slot="row-group"
      className={cn(
        "m-0 grid min-w-0 list-none grid-cols-[minmax(0,1fr)] gap-0.5 rounded-xl bg-row-hover p-1",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The label over a RowGroup: muted meta text at medium weight, set just inside the group's edge so
 * it starts on the same line as the page's title, with an optional count and one action at its
 * end (Clear all, Add channel). It is a SectionHeading of `kind="label"`.
 */
export function RowGroupLabel(props: {
  title: string;
  count?: number;
  action?: SectionHeadingAction;
  id?: string;
}) {
  return <SectionHeading kind="label" as="h3" {...props} />;
}

/**
 * A labeled group: its RowGroupLabel (left out without `title`), an optional muted line about
 * the group under it, then the RowGroup of its rows, 6.75px below.
 */
export function RowGroupSection({
  title,
  count,
  action,
  description,
  children,
  as,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
  title?: string;
  count?: number;
  action?: SectionHeadingAction;
  /** A muted line about the whole group, only where it explains something the rows don't. */
  description?: ReactNode;
  children: ReactNode;
  as?: "div" | "ul";
  /** Layout only. */
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      data-slot="row-group-section"
      {...props}
      className={cn("grid min-w-0 gap-1.5", className)}
    >
      {title || description ? (
        <div className="grid min-w-0 gap-0.5">
          {title ? <RowGroupLabel title={title} count={count} action={action} /> : null}
          {description ? (
            <p className="m-0 px-0.5 text-meta text-cream-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      <RowGroup as={as}>{children}</RowGroup>
    </section>
  );
}

/** Groups one under another, 22.5px apart, on a page, in a side column or in a dialog. */
export function RowGroupStack({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="row-group-stack"
      className={cn("grid min-w-0 content-start gap-5", className)}
      {...props}
    />
  );
}
