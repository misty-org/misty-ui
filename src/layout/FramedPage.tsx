import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../class_names";
import { Surface } from "../display/Surface";
import { createUiMemory } from "../lib/ui_memory";
import { designPx, remCss } from "../lib/ui_scale";
import { ColumnSeam } from "./ColumnSeam";
import { Separator } from "./Separator";
import "./framed_page.css";

const DEFAULT_MIN = 180;
const DEFAULT_MAX = 600;
const DEFAULT_WORK_MIN = 360;

const widthMemory = createUiMemory<number>({
  scope: "framed-page",
  normalize: (stored) =>
    typeof stored === "number" && Number.isFinite(stored) && stored > 0 ? stored : undefined,
});

/** A side column of a FramedPage: a rail, a sidebar, a side panel or a preview. */
export type FramedPageColumn = {
  /** Stable id; its width is remembered under the page's autoSaveId and this id. */
  id: string;
  content: ReactNode;
  /** The seam's accessible name, e.g. "Resize the member list". */
  label: string;
  /** Its width in design px (the 4px grid, drawn through --spacing). */
  width: number;
  /** Narrowest it can be dragged, design px. Default 180. */
  minWidth?: number;
  /** Widest it can be dragged, design px. Default 600. */
  maxWidth?: number;
  /** A FramedBar at the column's top, closed by a hairline that lines up with the work's header. */
  header?: ReactNode;
  /** End column only: it covers the work (kept mounted, hidden) until restored. */
  expanded?: boolean;
  /**
   * End column only: what it does when it can't fit beside the work. "hide" (the default) is for a
   * column there only to glance at, such as a member list; "cover" is for a view the person opened,
   * such as a thread or search results, which then covers the work as `expanded` does, so its
   * header must offer the way back (Close).
   */
  narrow?: "hide" | "cover";
  /**
   * Start column only: it never hides. On a narrow page it holds its least width and the work gives
   * way, for a column that is the page's only navigation (Settings' sections, Explore's rail).
   */
  keep?: boolean;
};

export type FramedPageProps = {
  /** Rows across the whole page, each a FramedBar, each closed by a hairline. Empty rows are left out. */
  toolbar?: ReactNode | ReadonlyArray<ReactNode>;
  /**
   * The work's own bar (a FramedBar or a component built on one, such as ChannelHeader), above the
   * work only, beside the columns' headers, closed by a hairline.
   */
  header?: ReactNode;
  /** The column at the start: the page's own sidebar or rail. */
  start?: FramedPageColumn | null;
  /** The column at the end: a side panel, a preview, a member list. */
  end?: FramedPageColumn | null;
  /** What runs along the bottom, such as a BottomBar. */
  footer?: ReactNode;
  /** Remembers the columns' widths for the device under this key. */
  autoSaveId?: string;
  /** The narrowest the work may get, design px, default 360. */
  workMinWidth?: number;
  /** The work the page is about: a chat, a list, an editor, settings rows. */
  children: ReactNode;
  /** Layout only: size and placement. */
  className?: string;
};

type Bounds = { width: number; min: number; max: number };

function columnBounds(column: FramedPageColumn): Bounds {
  const min = column.minWidth ?? DEFAULT_MIN;
  const max = Math.max(min, column.maxWidth ?? DEFAULT_MAX);
  return { width: Math.min(Math.max(column.width, min), max), min, max };
}

function FramedColumn(props: {
  side: "start" | "end";
  column: FramedPageColumn;
  width: number | null;
  fill: boolean;
  hidden: boolean;
}) {
  const { column } = props;
  const style = props.fill || props.width === null ? undefined : { width: remCss(props.width) };
  return (
    <div
      data-slot="framed-page-column"
      data-side={props.side}
      data-expanded={props.fill || undefined}
      style={style}
      className={cn(
        "flex min-h-0 min-w-0 flex-col",
        props.fill ? "flex-1" : "shrink-0",
        props.hidden && "hidden",
      )}
    >
      {column.header ? (
        <>
          <div className="min-w-0 shrink-0">{column.header}</div>
          <Separator />
        </>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{column.content}</div>
    </div>
  );
}

/**
 * Every page's frame, as Kura's window: its toolbar rows across the top and its side columns (a rail
 * or sidebar at the start, a side panel or preview at the end) on the sidebar's color, so with
 * Misty's own sidebar they read as one frame; the page's work between them on the page's color,
 * under its own `header` bar. A hairline closes each toolbar row and each header, and a seam parts
 * each column from the work; dragging a seam (or its arrow keys) sizes the column, kept for the
 * device under `autoSaveId`, and a double-click puts it back. The work never gets narrower than
 * `workMinWidth`: columns give way first, then the end column hides, then the start one, unless
 * it is marked `keep`, when it holds its least width and the work gives way instead. Nothing
 * floats over the work. Popups, dialogs and the narrow glance card (`SideCard floating`) are the
 * only things above it. Not for an overlay's own bars (TopBar, BottomBar) or a docs site
 * (DocsLayout).
 *
 * ```tsx
 * <FramedPage toolbar={<FramedBar start={search}>{addButton}</FramedBar>}
 *   header={<ChannelHeader … />} autoSaveId="space-chat"
 *   start={{ id: "channels", content: <Channels />, label: "Resize the channels", width: 240 }}
 *   end={{ id: "members", content: <MemberList />, label: "Resize the member list", width: 240 }}>
 *   <Messages />
 * </FramedPage>
 * ```
 */
export function FramedPage({
  toolbar,
  header,
  start,
  end,
  footer,
  autoSaveId,
  workMinWidth = DEFAULT_WORK_MIN,
  children,
  className,
}: FramedPageProps) {
  const rows = (Array.isArray(toolbar) ? toolbar : [toolbar]).filter(
    (row) => row !== null && row !== undefined && row !== false,
  );
  const body = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState<number | null>(null);
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    const element = body.current;
    if (!element) return;
    const measure = (width: number) => {
      if (width > 0) setRoom(designPx(width));
    };
    measure(element.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry) measure(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const memoryKey = (id: string) => (autoSaveId ? `${autoSaveId}/${id}` : undefined);
  const wanted = (column: FramedPageColumn, bounds: Bounds) => {
    const key = memoryKey(column.id);
    const chosen = widths[column.id] ?? (key ? widthMemory.get(key) : undefined) ?? bounds.width;
    return Math.min(Math.max(chosen, bounds.min), bounds.max);
  };
  const resize = (id: string, width: number, save: boolean) => {
    setWidths((current) => ({ ...current, [id]: width }));
    const key = memoryKey(id);
    if (save && key) widthMemory.set(key, width);
  };

  const startBounds = start ? columnBounds(start) : null;
  const endBounds = end ? columnBounds(end) : null;
  const seam = designPx(1);
  const covers =
    end?.narrow === "cover" &&
    !end.expanded &&
    room !== null &&
    endBounds !== null &&
    (startBounds
      ? startBounds.min + endBounds.min > room - workMinWidth - 2 * seam
      : endBounds.min > room - workMinWidth - seam);
  const expanded = Boolean(end?.expanded) || covers;

  let startWidth = start && startBounds ? wanted(start, startBounds) : null;
  let endWidth = end && endBounds && !expanded ? wanted(end, endBounds) : null;
  let startShown = Boolean(start);
  let endShown = Boolean(end);

  if (room !== null) {
    if (expanded && endBounds) {
      if (startBounds && startWidth !== null) {
        const left = room - endBounds.min - seam;
        if (left >= startBounds.min) startWidth = Math.min(startWidth, left);
        else if (start?.keep) startWidth = startBounds.min;
        else startShown = false;
      }
    } else {
      if (startBounds && endBounds && startWidth !== null && endWidth !== null) {
        const left = room - workMinWidth - 2 * seam;
        if (startBounds.min + endBounds.min <= left) {
          startWidth = Math.max(startBounds.min, Math.min(startWidth, left - endBounds.min));
          endWidth = Math.max(endBounds.min, Math.min(endWidth, left - startWidth));
        } else {
          endShown = false;
        }
      }
      if (!(start && end && endShown)) {
        const left = room - workMinWidth - seam;
        if (startShown && startBounds && startWidth !== null) {
          if (left >= startBounds.min) startWidth = Math.min(startWidth, left);
          else if (start?.keep) startWidth = startBounds.min;
          else startShown = false;
        }
        if (!start && endShown && endBounds && endWidth !== null) {
          if (left < endBounds.min) endShown = false;
          else endWidth = Math.min(endWidth, left);
        }
      }
    }
  }

  const startSeam = Boolean(start && startShown && startBounds && startWidth !== null);
  const endSeam = Boolean(end && endShown && !expanded && endBounds && endWidth !== null);
  const seams = (startSeam ? 1 : 0) + (endSeam ? 1 : 0);
  const mostFor = (bounds: Bounds, other: number) => {
    if (room === null) return bounds.max;
    const reserve = expanded ? (endBounds?.min ?? 0) : workMinWidth;
    return Math.max(bounds.min, Math.min(bounds.max, room - reserve - seams * seam - other));
  };

  return (
    <Surface
      tone="sidebar"
      data-slot="framed-page"
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-col",
        dragging && "cursor-col-resize select-none",
        className,
      )}
    >
      {rows.map((row, index) => (
        <Fragment key={index}>
          <div data-slot="framed-page-toolbar" className="min-w-0 shrink-0">
            {row}
          </div>
          <Separator />
        </Fragment>
      ))}
      <div ref={body} data-slot="framed-page-body" className="flex min-h-0 min-w-0 flex-1">
        {start ? (
          <>
            <FramedColumn
              side="start"
              column={start}
              width={startWidth}
              fill={false}
              hidden={!startShown}
            />
            {startSeam && startBounds && startWidth !== null ? (
              <ColumnSeam
                side="start"
                label={start.label}
                width={startWidth}
                min={startBounds.min}
                max={mostFor(startBounds, endSeam && endWidth !== null ? endWidth : 0)}
                reset={startBounds.width}
                onResize={(width, save) => resize(start.id, width, save)}
                onDragging={setDragging}
              />
            ) : null}
          </>
        ) : null}
        <Surface
          tone="page"
          data-slot="framed-page-work"
          className={cn("flex min-h-0 min-w-0 flex-1 flex-col", expanded && "hidden")}
        >
          {header ? (
            <>
              <Surface tone="sidebar" data-slot="framed-page-header" className="min-w-0 shrink-0">
                {header}
              </Surface>
              <Separator />
            </>
          ) : null}
          {children}
        </Surface>
        {end ? (
          <>
            {endSeam && endBounds && endWidth !== null ? (
              <ColumnSeam
                side="end"
                label={end.label}
                width={endWidth}
                min={endBounds.min}
                max={mostFor(endBounds, startSeam && startWidth !== null ? startWidth : 0)}
                reset={endBounds.width}
                onResize={(width, save) => resize(end.id, width, save)}
                onDragging={setDragging}
              />
            ) : null}
            <FramedColumn
              side="end"
              column={end}
              width={endWidth}
              fill={expanded}
              hidden={!endShown}
            />
          </>
        ) : null}
      </div>
      {footer ? (
        <div data-slot="framed-page-footer" className="min-w-0 shrink-0">
          {footer}
        </div>
      ) : null}
    </Surface>
  );
}
