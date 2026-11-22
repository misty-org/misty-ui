import {
  forwardRef,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpDown, Columns2, Columns3, LayoutGrid, List } from "lucide-react";
import { IconButton } from "../../controls/IconButton";
import { SearchField } from "../../controls/SearchField";
import { ActionBar, type ActionBarItem, type IconSource } from "../../layout/ActionBar";
import { PageHeader } from "../../layout/PageHeader";
import { ToolbarDivider } from "../../layout/Separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../overlays/DropdownMenu";
import { MenuRadioGroup, MenuRadioItem } from "../../overlays/MenuItem";
import { cn } from "../../classNames";
import {
  CollectionColumnChooser,
  CollectionColumnsContext,
  CollectionHeadingSlotContext,
} from "./CollectionColumns";

type CollectionHeadingProps = {
  /**
   * The page's name, or a node that stands for it, such as a Space switcher menu. Left out, the
   * band is only the page's controls at its end, with no hairline (see PageHeader).
   */
  title?: ReactNode;
  /** The page's actions. They give way like any ActionBar once the title has faded. */
  actions?: ReadonlyArray<ActionBarItem>;
  /** Accessible name of the actions toolbar. Default "Page actions". */
  actionsLabel?: string;
  /** Always shown after the actions and never folds, such as the collection's search field. */
  end?: ReactNode;
};

/**
 * A collection page's top band: a PageHeader, as tall as every other page's bar and closed by the
 * same hairline. Inside a CollectionPage it draws in the band above the page's scroller, so it
 * spans the pane like every other page's bar and a scrollbar never narrows it. The title fades
 * first, then the actions give way; it never wraps. The title may be a node, such as a Space
 * switcher, with the same bar items beside it. Without a title it is only the page's controls at
 * its end, with no hairline, for a page the sidebar already names.
 *
 * ```tsx
 * <CollectionHeading title="Library" end={<CollectionSearch … />}
 *   actions={[{ id: "upload", icon: Upload, label: "Upload", priority: 2, onSelect: upload }]} />
 * ```
 */
export function CollectionHeading({ title, actions, actionsLabel, end }: CollectionHeadingProps) {
  const page = useContext(CollectionHeadingSlotContext);
  const header = (
    <PageHeader title={title} actions={actions} actionsLabel={actionsLabel} end={end} />
  );
  if (!page) return header;
  // In a page, wait the one commit until its band has mounted rather than mount here and move.
  return page.slot ? createPortal(header, page.slot) : null;
}

export const CollectionSearch = forwardRef<HTMLInputElement, ComponentProps<typeof SearchField>>(
  ({ containerClassName, ...props }, ref) => (
    <SearchField ref={ref} containerClassName={cn("w-56", containerClassName)} {...props} />
  ),
);
CollectionSearch.displayName = "CollectionSearch";

/**
 * A collection's control row: its utilities (filter menu, column chooser, sort, refresh) and
 * actions (view toggle) at the end. It holds no section tabs: a collection's groups are stacked
 * shelves or headed groups on the page, and a page's sections are rows in its rail or sidebar,
 * never a row of chips. It is one ActionBar, so it never wraps.
 */
export function CollectionControls({
  actions,
  filterControl,
  utilities,
}: {
  /** Controls at the far end, after a divider, such as CollectionViewToggle. */
  actions?: ReactNode;
  /** The collection's filter menu, such as `useCollectionRefinement().control`. */
  filterControl?: ReactNode;
  /** More utilities beside the filter menu and column chooser. */
  utilities?: ReactNode;
}) {
  const columnContext = useContext(CollectionColumnsContext);
  const hasUtilities = Boolean(filterControl || utilities || columnContext?.schema);
  if (!hasUtilities && !actions) return null;
  const end = (
    <>
      {hasUtilities && (
        <div className="flex items-center gap-1">
          {filterControl}
          <CollectionColumnChooser />
          {utilities}
        </div>
      )}
      {hasUtilities && actions && <ToolbarDivider />}
      {actions}
    </>
  );
  return (
    <div className="min-w-0 shrink-0">
      <ActionBar label="Collection controls" items={[]} end={end} />
    </div>
  );
}

/**
 * Grid or list, as two bare icon buttons, the open one pressed: no box around them. A bar puts a
 * ToolbarDivider between them and its other controls. A collection that can also be browsed in
 * columns (Files, as Finder's column view) passes `columns`: a third bare icon, pressed while
 * active, and then neither grid nor list is. The board is another page rather than a way to draw
 * this one, so it is a separate button beside them.
 */
export function CollectionViewToggle({
  value,
  onChange,
  onBoardView,
  columns,
  disabled = false,
}: {
  value: "list" | "grid";
  onChange: (value: "list" | "grid") => void;
  onBoardView?: () => void;
  /**
   * Column view (ColumnBrowser), kept by the caller beside its grid or list choice: `active` while
   * it shows, `onSelect` to switch to it. Picking grid or list calls `onChange` as before.
   */
  columns?: { active: boolean; onSelect(): void };
  disabled?: boolean;
}) {
  const views = [
    { value: "grid", label: "Grid view", icon: LayoutGrid },
    { value: "list", label: "List view", icon: List },
  ] as const;
  const inColumns = columns?.active === true;
  return (
    <div role="group" aria-label="View layout" className="flex items-center gap-1">
      {views.map(({ value: view, label, icon: Icon }) => (
        <IconButton
          key={view}
          label={label}
          aria-pressed={!inColumns && value === view}
          disabled={disabled}
          onClick={() => onChange(view)}
        >
          <Icon />
        </IconButton>
      ))}
      {columns && (
        <IconButton
          label="Column view"
          aria-pressed={inColumns}
          disabled={disabled}
          onClick={() => columns.onSelect()}
        >
          <Columns2 />
        </IconButton>
      )}
      {onBoardView && (
        <IconButton label="Board view" disabled={disabled} onClick={onBoardView}>
          <Columns3 />
        </IconButton>
      )}
    </div>
  );
}

type CollectionSortOption<T extends string> = {
  value: T;
  label: string;
  icon: IconSource;
};

/**
 * The order of a collection, as one sort icon whose menu checks the order in use. Its tooltip
 * names that order, so the bar never spells it out.
 */
export function CollectionSortMenu<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly CollectionSortOption<T>[];
  onChange: (value: T) => void;
}) {
  const current = options.find((option) => option.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={current ? `Sort: ${current.label}` : "Sort"}>
          <ArrowUpDown />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-misty-layer-portal>
        <MenuRadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
          {options.map((option) => (
            <MenuRadioItem
              key={option.value}
              value={option.value}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </MenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
