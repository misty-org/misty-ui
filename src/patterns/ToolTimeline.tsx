// Layout adapted from OpenChamber (MIT, Copyright (c) 2025 Bohdan Triapitsyn).
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Pressable } from "../controls/Pressable";
import { cn } from "../class_names";
import "./tool_timeline.css";

/**
 * How an agent's turn shows its work: one fold for the whole turn (TurnFold), then its steps in the
 * order they ran. A run of steps is one table (ToolList): a block with a hairline edge on the
 * frame's color, one row per step (ToolRow) split by hairlines, what it did in a fixed column and
 * what it acted on beside it. Rows carry no icon. A row that has more to show opens a ToolBody
 * under it, inside the table. What the agent wrote between steps (ToolNote) sits between tables,
 * so the turn reads as work, then what it said, then more work.
 *
 * ```tsx
 * <TurnFold summary="Edited session.ts, ran 2 commands" meta="1m 48s" open={open} onToggle={toggle} />
 * <ToolList label="Steps">
 *   <li><ToolRow name="Edited" target={<ToolPath path="src/auth/session.ts" />} /></li>
 *   <li><ToolRow name="Ran" target="npm test" meta="12s" open={o} onToggle={t} controls="out" /></li>
 * </ToolList>
 * <ToolNote>The test clock didn't reach the window. Fixing the comparison.</ToolNote>
 * ```
 */

/**
 * The turn's one line: what it is doing while it runs (with a moving highlight), what it did once
 * it ends, named by its weightiest work ("Edited 2 files, ran 3 commands"), with how long it took
 * at its end. It opens to the turn's steps; `more` says how many earlier steps a live turn keeps
 * folded above the latest ones.
 */
export function TurnFold(props: {
  summary: ReactNode;
  live?: boolean;
  open: boolean;
  onToggle(): void;
  /** The id of what it opens. */
  controls?: string;
  /** Earlier steps a live turn hides; pressing the line shows them all. */
  more?: number;
  /** At its end, such as how long the turn worked. */
  meta?: ReactNode;
}) {
  return (
    <Pressable
      className="misty-turn-fold"
      data-open={props.open || undefined}
      aria-expanded={props.open}
      aria-controls={props.controls}
      onClick={props.onToggle}
    >
      <span
        className={cn("misty-turn-fold-label", props.live && "misty-turn-fold-live")}
        aria-live="polite"
      >
        {props.summary}
      </span>
      <span className="misty-turn-fold-end">
        {props.more ? <span>+{props.more} more</span> : null}
        {props.meta ? <span>{props.meta}</span> : null}
        <ChevronRight aria-hidden="true" className="misty-turn-fold-chevron" />
      </span>
    </Pressable>
  );
}

/**
 * A run of steps as one table: a block with a hairline edge on the frame's color, its rows split
 * by hairlines. Each child is an `li` holding a ToolRow and, when open, its ToolBody. A note the
 * agent wrote between steps ends the table; the steps after it start a new one.
 */
export function ToolList(props: { label: string; children: ReactNode; id?: string }) {
  return (
    <ol id={props.id} className="misty-tool-list" aria-label={props.label}>
      {props.children}
    </ol>
  );
}

/**
 * One step on one 36px line: what it did (muted, in the table's fixed column), what it acted on
 * (full color, fading at the edge), and its end (a duration, a count, line changes). Rows carry no
 * icon. A row that opens shows a chevron at its end on hover and while open. A running step's verb
 * moves with a highlight, a failed one is red, one waiting on the person amber. Outside a ToolList
 * it stands alone as a bare line, such as the turn's thinking.
 */
export function ToolRow(props: {
  name: string;
  target?: ReactNode;
  meta?: ReactNode;
  state?: "running" | "done" | "failed" | "waiting";
  /** Given with onToggle, the row opens its body. */
  open?: boolean;
  onToggle?(): void;
  /** The id of the body it opens. */
  controls?: string;
}) {
  const content = (
    <>
      <span className="misty-tool-row-name">{props.name}</span>
      <span className="misty-tool-row-target">{props.target}</span>
      {props.state === "failed" ? <span className="sr-only">, failed</span> : null}
      {props.state === "waiting" ? <span className="sr-only">, waiting for you</span> : null}
      <span className="misty-tool-row-meta">
        {props.meta}
        {props.onToggle ? (
          <ChevronRight aria-hidden="true" className="misty-tool-row-chevron" />
        ) : null}
      </span>
    </>
  );
  const shared = {
    className: "misty-tool-row",
    "data-state": props.state ?? "done",
    "data-open": props.open || undefined,
  };
  return props.onToggle ? (
    <Pressable
      {...shared}
      data-expandable=""
      aria-expanded={Boolean(props.open)}
      aria-controls={props.controls}
      onClick={props.onToggle}
    >
      {content}
    </Pressable>
  ) : (
    <div {...shared}>{content}</div>
  );
}

/**
 * A path as a row shows it: the folder muted, the file's name in full color. In a ToolList only
 * the name shows, so the table's column reads as a list of files.
 */
export function ToolPath({ path }: { path: string }) {
  const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  if (cut < 0 || cut === path.length - 1) return <>{path}</>;
  return (
    <>
      <span className="misty-tool-row-dim">{path.slice(0, cut + 1)}</span>
      {path.slice(cut + 1)}
    </>
  );
}

/** Lines a step added and removed, in their own colors, each with its sign. */
export function ToolLines(props: { added?: number; removed?: number }) {
  if (!props.added && !props.removed) return null;
  return (
    <span className="misty-tool-lines">
      {props.added ? <span data-tone="added">+{props.added}</span> : null}
      {props.removed ? <span data-tone="removed">−{props.removed}</span> : null}
    </span>
  );
}

/**
 * What an opened row shows, under it inside the table, set off by a hairline. Code inside keeps
 * its own monospace; prose is the row's size.
 */
export function ToolBody(props: { children: ReactNode }) {
  return <div className="misty-tool-body">{props.children}</div>;
}

/** What the agent wrote between steps: quiet prose between two tables. */
export function ToolNote({ children }: { children: ReactNode }) {
  return <div className="misty-tool-note">{children}</div>;
}

/**
 * The one line under a live turn that says what it is doing now ("Running npm test", "Waiting for
 * you", "Retrying, attempt 2 of 5"), with a moving highlight, and how long the turn has worked. It
 * keeps its height, so the turn never jumps as it changes. Rows above it only record what happened;
 * nothing else in the turn spins. `waiting` turns the phrase amber and stills it.
 */
export function TurnStatus(props: {
  phrase: string;
  /** How long the turn has worked, such as "1m 12s". */
  elapsed?: string;
  /** More facts after the time, such as the tokens so far. */
  extra?: ReactNode;
  waiting?: boolean;
}) {
  return (
    <div className="misty-turn-status" role="status" aria-live="polite">
      <span
        className={cn("misty-turn-status-phrase", !props.waiting && "misty-turn-fold-live")}
        data-waiting={props.waiting || undefined}
      >
        {props.phrase}
      </span>
      {props.elapsed ? <span className="misty-turn-status-fact">{props.elapsed}</span> : null}
      {props.extra ? <span className="misty-turn-status-fact">{props.extra}</span> : null}
    </div>
  );
}

/** One file a turn changed, for TurnChanges. */
export type TurnChange = {
  path: string;
  added?: number;
  removed?: number;
  /** Opens the file or its diff. */
  onOpen?(): void;
};

/**
 * What a finished turn changed, closing it: "2 files changed" with one action at its end (Review
 * changes), then the files as a table like the turn's steps, each with its full path and the lines
 * it added and removed. Shows nothing when the turn changed no files.
 */
export function TurnChanges(props: { files: TurnChange[]; action?: ReactNode }) {
  if (!props.files.length) return null;
  const count = props.files.length;
  return (
    <section className="misty-turn-changes" aria-label="Changed files">
      <div className="misty-turn-changes-head">
        <span>{count === 1 ? "1 file changed" : `${count} files changed`}</span>
        {props.action ? <span className="misty-turn-changes-action">{props.action}</span> : null}
      </div>
      <ol className="misty-tool-list" aria-label="Changed files">
        {props.files.map((file) => {
          const content = (
            <>
              <span className="misty-tool-row-target">
                <ToolPath path={file.path} />
              </span>
              <span className="misty-tool-row-meta">
                <ToolLines added={file.added} removed={file.removed} />
              </span>
            </>
          );
          return (
            <li key={file.path}>
              {file.onOpen ? (
                <Pressable
                  className="misty-tool-row"
                  data-file=""
                  data-expandable=""
                  onClick={file.onOpen}
                >
                  {content}
                </Pressable>
              ) : (
                <div className="misty-tool-row" data-file="">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
