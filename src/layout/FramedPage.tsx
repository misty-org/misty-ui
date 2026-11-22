import { Fragment, type ReactNode } from "react";
import { cn } from "../classNames";
import { Surface } from "../display/Surface";
import { Separator } from "./Separator";
import { SplitHandle, SplitPane, SplitPanes } from "./SplitHandle";

/** A side column of a FramedPage: a rail, a sidebar, a side panel or a preview. */
export type FramedPageColumn = {
  /** Stable id, kept with the column's width when the page remembers its layout. */
  id: string;
  content: ReactNode;
  /** The seam's accessible name, e.g. "Resize the sidebar". */
  label: string;
  /** Its width as a share of the page, in percent. */
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
};

export type FramedPageProps = {
  /**
   * The toolbar rows across the top, on the frame's color, each closed by a hairline: a tab row, a
   * navigation row, a row of tools. Empty rows are left out.
   */
  toolbar?: ReactNode | ReadonlyArray<ReactNode>;
  /** The column at the start: the page's own sidebar or rail. */
  start?: FramedPageColumn | null;
  /** The column at the end: a side panel, a preview. */
  end?: FramedPageColumn | null;
  /** What runs along the bottom, such as a BottomBar. */
  footer?: ReactNode;
  /** Keeps the columns' widths for the device under this key. */
  autoSaveId?: string;
  /** The work the page is about: a chat, a list, an editor, settings rows. */
  children: ReactNode;
  /** Layout only: size and placement. */
  className?: string;
};

/**
 * Every page's frame, as Kura's window: its toolbar rows across the top and its side columns (a rail
 * or sidebar at the start, a side panel or preview at the end) on the sidebar's color, so with Misty's
 * own sidebar they read as one frame; the page's work between them on the page's color. A hairline
 * closes each toolbar row and a seam parts each column from the work; dragging a seam resizes the
 * column. Nothing floats over the work. Popups, dialogs and the narrow glance card (`SideCard
 * floating`) are the only things above it.
 *
 * ```tsx
 * <FramedPage toolbar={[navRow, toolRow]} autoSaveId="files"
 *   start={{ id: "places", content: <Sidebar />, label: "Resize the sidebar", defaultSize: 20 }}
 *   end={{ id: "preview", content: <Preview />, label: "Resize the preview", defaultSize: 28 }}>
 *   <FileList />
 * </FramedPage>
 * ```
 */
export function FramedPage({ toolbar, start, end, footer, autoSaveId, children, className }: FramedPageProps) {
  const rows = (Array.isArray(toolbar) ? toolbar : [toolbar]).filter(
    (row) => row !== null && row !== undefined && row !== false,
  );
  return (
    <Surface
      tone="sidebar"
      data-slot="framed-page"
      className={cn("flex size-full min-h-0 min-w-0 flex-col", className)}
    >
      {rows.map((row, index) => (
        <Fragment key={index}>
          <div className="min-w-0 shrink-0">{row}</div>
          <Separator />
        </Fragment>
      ))}
      <SplitPanes direction="horizontal" autoSaveId={autoSaveId} className="min-h-0 flex-1">
        {start ? (
          <>
            <SplitPane
              id={start.id}
              order={1}
              defaultSize={start.defaultSize}
              minSize={start.minSize}
              maxSize={start.maxSize}
            >
              <div className="size-full min-h-0 min-w-0">{start.content}</div>
            </SplitPane>
            <SplitHandle direction="horizontal" seam label={start.label} />
          </>
        ) : null}
        <SplitPane id="framed-page-work" order={2} minSize={30}>
          <Surface tone="page" className="flex size-full min-h-0 min-w-0 flex-col">
            {children}
          </Surface>
        </SplitPane>
        {end ? (
          <>
            <SplitHandle direction="horizontal" seam label={end.label} />
            <SplitPane
              id={end.id}
              order={3}
              defaultSize={end.defaultSize}
              minSize={end.minSize}
              maxSize={end.maxSize}
            >
              <div className="size-full min-h-0 min-w-0">{end.content}</div>
            </SplitPane>
          </>
        ) : null}
      </SplitPanes>
      {footer}
    </Surface>
  );
}
