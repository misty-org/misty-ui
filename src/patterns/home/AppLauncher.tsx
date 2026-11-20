import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { cn } from "../../classNames";
import { FilterChip } from "../../controls/FilterChip";
import { Text } from "../../display/Text";
import { SidewaysScroll } from "../../layout/SidewaysScroll";
import { Dialog, DialogContent, DialogTitle } from "../../overlays/Dialog";
import { homeAppsClass } from "./AppTile";

/**
 * The apps of a Space in one launcher over the window, as macOS's Applications in Spotlight: a
 * large search on top, a row of filter chips for kinds of app, then every app as an AppTile in a
 * grid that scrolls, however many a Space adds. Typing narrows the tiles and Enter opens the first
 * (`onSubmit`); Escape or a click outside closes it. The caller filters; the launcher lays it out.
 */
export function AppLauncher(props: {
  open: boolean;
  onOpenChange(open: boolean): void;
  query: string;
  onQueryChange(query: string): void;
  /** Enter in the search: open the first app that matches. */
  onSubmit?(): void;
  /** The kinds of app to narrow to, the first being all of them. */
  filters?: { value: string; label: string }[];
  filter?: string;
  onFilterChange?(value: string): void;
  /** The tiles: AppTiles, then an AddAppTile for someone who may add apps. */
  children: ReactNode;
  /** Nothing matches the search or the filter. */
  empty?: boolean;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        size="xl"
        layout="scroll"
        placement="top"
        hideClose
        className="gap-0 p-0"
      >
        <DialogTitle className="sr-only">Apps</DialogTitle>
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-charcoal-border px-5">
          <Text bare tone="muted" className="inline-flex">
            <Search aria-hidden="true" />
          </Text>
          <input
            autoFocus
            type="text"
            aria-label="Search apps"
            placeholder="Apps"
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.nativeEvent.isComposing)
                return;
              event.preventDefault();
              props.onSubmit?.();
            }}
            className="min-w-0 flex-1 bg-transparent text-title text-cream-bright outline-none placeholder:text-cream-muted"
          />
        </div>
        {props.filters?.length ? (
          <SidewaysScroll className="shrink-0 px-5 pt-3">
            <div
              className="flex w-max items-center gap-1.5"
              role="group"
              aria-label="Kinds of app"
            >
              {props.filters.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  pressed={props.filter === option.value}
                  onPressedChange={() => props.onFilterChange?.(option.value)}
                />
              ))}
            </div>
          </SidewaysScroll>
        ) : null}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-5",
            "@container",
          )}
        >
          {props.empty ? (
            <Text
              as="p"
              size="control"
              tone="muted"
              className="px-1 py-10 text-center"
            >
              No apps match
            </Text>
          ) : (
            <div className={homeAppsClass}>{props.children}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
