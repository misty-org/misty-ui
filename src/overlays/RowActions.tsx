import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "./ContextMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import type { MenuWidth } from "./popup_styles";

/** The row a RowActions belongs to: the nearest element that carries Tailwind's `group/row`. */
const rowSelector = '[class~="group/row"]';

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || !!target.closest("input, textarea, select"))
  );
}

type RowActionsProps = {
  /** What the menu is for, such as "Chat actions": the ⋯ button's name and tooltip. */
  label: string;
  /**
   * The row's actions as MenuItems. The same rows open from the ⋯ and from a right-click. A
   * function is called only while a menu is open, so a long list builds no rows until one opens.
   */
  children: React.ReactNode | (() => React.ReactNode);
  width?: MenuWidth;
  /** Told when either menu opens or closes, e.g. to keep the row highlighted meanwhile. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * A row's one place for its actions: a 27px ⋯ at its right end, shown while the row is hovered,
 * holds focus, or has a menu open, and the same menu on a right-click anywhere on the row.
 * Put it last inside the row; the row is its nearest ancestor with the `group/row` class, which
 * is how ListRow and tiles are built. It stays cheap in a long list: the right-click menu is set
 * up only once the row is hovered, focused or right-clicked, and the rows (when given as a
 * function) are built only while a menu is open.
 *
 * ```tsx
 * <div className="group/row flex h-8 items-center">
 *   …
 *   <RowActions label="Chat actions">
 *     <MenuItem icon={Pencil} label="Rename" onSelect={rename} />
 *     <MenuSeparator />
 *     <MenuItem icon={Trash2} label="Delete" danger onSelect={confirmDelete} />
 *   </RowActions>
 * </div>
 * ```
 */
function RowActions({
  label,
  children,
  width,
  onOpenChange,
  className,
}: RowActionsProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [contextOpen, setContextOpen] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const pending = React.useRef<{ x: number; y: number } | null>(null);
  const rows = React.useRef<React.ReactNode>(null);

  const openAt = React.useCallback((x: number, y: number) => {
    anchorRef.current?.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      }),
    );
  }, []);

  React.useEffect(() => {
    const row = buttonRef.current?.closest<HTMLElement>(rowSelector);
    if (!row) return;
    const arm = () => setArmed(true);
    const open = (event: MouseEvent) => {
      if (
        event.target === anchorRef.current ||
        event.defaultPrevented ||
        isEditable(event.target)
      )
        return;
      event.preventDefault();
      const keyboard = event.clientX === 0 && event.clientY === 0;
      const box = row.getBoundingClientRect();
      const x = keyboard ? box.left + 8 : event.clientX;
      const y = keyboard ? box.bottom : event.clientY;
      if (anchorRef.current) openAt(x, y);
      else {
        pending.current = { x, y };
        setArmed(true);
      }
    };
    row.addEventListener("pointerenter", arm);
    row.addEventListener("focusin", arm);
    row.addEventListener("contextmenu", open);
    return () => {
      row.removeEventListener("pointerenter", arm);
      row.removeEventListener("focusin", arm);
      row.removeEventListener("contextmenu", open);
    };
  }, [openAt]);

  React.useLayoutEffect(() => {
    const point = pending.current;
    if (!armed || !point) return;
    pending.current = null;
    openAt(point.x, point.y);
  }, [armed, openAt]);

  const changeMenu = (open: boolean) => {
    setMenuOpen(open);
    onOpenChange?.(open || contextOpen);
  };
  const changeContext = (open: boolean) => {
    setContextOpen(open);
    onOpenChange?.(open || menuOpen);
  };

  if (typeof children !== "function") rows.current = children;
  else if (menuOpen || contextOpen) rows.current = children();
  const content = rows.current;

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={changeMenu}>
        <DropdownMenuTrigger asChild>
          <IconButton
            ref={buttonRef}
            label={label}
            size="sm"
            variant="quiet"
            data-slot="row-actions"
            data-context-open={contextOpen || undefined}
            className={cn(
              "opacity-0 transition-opacity focus-visible:opacity-100",
              "group-hover/row:opacity-100 group-focus-within/row:opacity-100",
              "data-[state=open]:opacity-100 data-[context-open]:opacity-100",
              className,
            )}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" width={width} aria-label={label}>
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
      {armed ? (
        <ContextMenu onOpenChange={changeContext}>
          <ContextMenuTrigger asChild>
            <span ref={anchorRef} aria-hidden className="hidden" />
          </ContextMenuTrigger>
          <ContextMenuContent width={width} aria-label={label}>
            {content}
          </ContextMenuContent>
        </ContextMenu>
      ) : null}
    </>
  );
}

export { RowActions };
export type { RowActionsProps };
