// Layout adapted from OpenChamber (MIT, Copyright (c) 2025 Bohdan Triapitsyn).
import { Maximize2, Minimize2, X, type LucideIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { FramedBar } from "./FramedBar";
import { Separator } from "./Separator";
import { HeaderSlot, InPanel } from "./side_panel_context";
import "./side_panel.css";

/**
 * What a FramedPage's end column holds when it docks a side panel beside the work, such as a
 * chat's files, changes, terminal or browser: a 54px header on a FramedBar's geometry, so it lines
 * up with the work's header, then the open view. It draws no frame, width or seam of its own: the
 * page's end column gives it its place, its width and the seam the person drags. Pass it as the
 * column's `content` (its header is part of it, so the column takes no `header`), and pass the
 * column `expanded` while it covers the work; here `expanded` and `onToggleExpanded` only draw the
 * Widen and Restore width button. Escape inside it closes it. The narrow glance card is SideCard.
 *
 * The header row belongs to what is open: a view renders its controls in `SidePanelHeader` and
 * they take the row's start (a branch picker, an address, terminal tabs). With nothing there the
 * row shows `name`. Widen and close always sit at its end.
 *
 * ```tsx
 * <FramedPage end={{ id: "changes", label: "Resize the changes", width: 440, expanded,
 *   content: (
 *     <SidePanel label="Changes" name="Changes" icon={GitCompareArrows} expanded={expanded}
 *       onToggleExpanded={toggle} onClose={close}>
 *       <SidePanelHeader><BranchPicker /></SidePanelHeader>
 *       <ChangesList />
 *     </SidePanel>
 *   ) }}>
 *   <Chat />
 * </FramedPage>
 * ```
 */
export function SidePanel(props: {
  /** Its accessible name. */
  label: string;
  /** What shows at the header's start when the open view puts nothing there. */
  name?: string;
  icon?: LucideIcon;
  /** Whether its column covers the work; only the header's button reads it. */
  expanded?: boolean;
  onToggleExpanded?(): void;
  onClose(): void;
  children: ReactNode;
  /** Layout only. */
  className?: string;
  [key: `data-${string}`]: string | undefined;
}) {
  const {
    label,
    name,
    icon: Icon,
    expanded = false,
    onToggleExpanded,
    onClose,
    children,
    className,
    ...data
  } = props;
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  return (
    <aside
      {...data}
      aria-label={label}
      data-slot="side-panel"
      data-expanded={expanded || undefined}
      className={cn("misty-side-panel", className)}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        if (!event.currentTarget.contains(event.target as Node)) return;
        if ((event.target as HTMLElement).closest("input, textarea, [contenteditable], .xterm"))
          return;
        onClose();
      }}
    >
      <FramedBar
        className="misty-side-panel-head"
        start={
          <>
            {name ? (
              <span className="misty-side-panel-name">
                {Icon ? <Icon aria-hidden="true" /> : null}
                <span>{name}</span>
              </span>
            ) : null}
            <div ref={setSlot} className="misty-side-panel-slot" />
          </>
        }
      >
        <div className="flex items-center gap-0.5">
          {onToggleExpanded ? (
            <IconButton
              label={expanded ? "Restore width" : "Widen"}
              tooltipSide="bottom"
              aria-pressed={expanded}
              onClick={onToggleExpanded}
            >
              {expanded ? <Minimize2 /> : <Maximize2 />}
            </IconButton>
          ) : null}
          <IconButton label="Close" tooltipSide="bottom" onClick={onClose}>
            <X />
          </IconButton>
        </div>
      </FramedBar>
      <Separator />
      <div className="misty-side-panel-body misty-scrollbar-rounded">
        <InPanel.Provider value>
          <HeaderSlot.Provider value={slot}>{children}</HeaderSlot.Provider>
        </InPanel.Provider>
      </div>
    </aside>
  );
}

/**
 * The open view's own controls, drawn in its SidePanel's header row instead of a first row of its
 * own. Outside a SidePanel it renders in place.
 */
export function SidePanelHeader({
  children,
  bar = false,
}: {
  children: ReactNode;
  /** Outside a side panel (the Code page's sidebar), stand as a bar of its own at the top of the
   * view rather than in line with what follows. */
  bar?: boolean;
}) {
  const slot = useContext(HeaderSlot);
  const inPanel = useContext(InPanel);
  if (!inPanel)
    return bar ? (
      <div className="flex h-10 flex-none items-center px-2">{children}</div>
    ) : (
      <>{children}</>
    );
  return slot ? createPortal(children, slot) : null;
}

/**
 * The control a side panel's header opens with, such as the files tab's folder picker or the
 * changes tab's branch picker. The header starts it where the rows below start their wash, and its
 * text sits where their icons and names start, so the picked name lines up with the list under it.
 */
export function SidePanelLead({ children }: { children: ReactNode }) {
  return (
    <div data-side-panel-lead="" className="flex min-w-0 flex-[0_1_auto]">
      {children}
    </div>
  );
}

/** How long the pointer may stray from a peeking card before it tucks away again. */
const TUCK_DELAY = 300;

/**
 * A narrow glance column, as wide as a phone's sidebar. Docked, it is a side column on the frame's
 * color parted by a seam; `floating`, it is the one card left over the work: at the column's top
 * right corner (clear of its scrollbar), only as tall as what it holds, scrolling past the window,
 * taking none of the column's width. A floating card's parent is the positioned column it floats in.
 *
 * A floating card can be `tucked`: slid off the column's right edge, it peeks back while the
 * pointer rests on that edge beside where it sits, and slides away again once the pointer leaves.
 */
export function SideCard(props: {
  label: string;
  /** A control at its top corner, such as what it shows. */
  corner?: ReactNode;
  children: ReactNode;
  className?: string;
  floating?: boolean;
  /** Floating only: off the column's edge, back while the pointer rests on it. */
  tucked?: boolean;
}) {
  const tucked = Boolean(props.floating && props.tucked);
  const [peek, setPeek] = useState(false);
  const [wasTucked, setWasTucked] = useState(tucked);
  if (wasTucked !== tucked) {
    setWasTucked(tucked);
    setPeek(false);
  }
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const away = tucked && !peek;
  return (
    <aside
      aria-label={props.label}
      data-slot="side-card"
      data-floating={props.floating || undefined}
      data-tucked={tucked || undefined}
      data-away={away || undefined}
      className={cn("misty-side-card", props.className)}
      onPointerEnter={
        tucked
          ? () => {
              clearTimeout(timer.current);
              setPeek(true);
            }
          : undefined
      }
      onPointerLeave={
        tucked
          ? () => {
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setPeek(false), TUCK_DELAY);
            }
          : undefined
      }
    >
      {tucked ? <div aria-hidden="true" className="misty-side-card-edge" /> : null}
      {props.corner ? (
        <div className="misty-side-card-corner" inert={away || undefined}>
          {props.corner}
        </div>
      ) : null}
      <div className="misty-side-card-body" inert={away || undefined}>
        {props.children}
      </div>
    </aside>
  );
}
