// Layout adapted from OpenChamber (MIT, Copyright (c) 2025 Bohdan Triapitsyn).
import { ChevronRight, CircleCheck, CircleDashed, CircleMinus, CircleX } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Pressable } from "../controls/Pressable";
import { cn } from "../class_names";
import { OverflowFadeText } from "../layout/OverflowFadeText";
import { Spinner } from "../feedback/Spinner";
import { StateMark } from "../display/StateMark";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "../overlays/Dialog";
import "./tool_timeline.css";

/**
 * How an agent's turn shows its work, in the order it happened: what the agent wrote, in full,
 * then each run of steps after it as one table (ToolList), always open: a block with a hairline
 * edge on the frame's color, one row per step (ToolRow) split by hairlines, what it did in a
 * column as wide as the table's longest verb and what it acted on beside it, so every action reads on its own line. Rows carry
 * no icon. A row that has more to show opens a ToolBody under it, inside the table. The pictures
 * a run took follow its table (TurnPictures). Near the live turn's end, its task list
 * (TurnTasks), then its one status line (TurnStatus). Once the turn ends nothing in it moves.
 *
 * ```tsx
 * <ToolList label="Steps">
 *   <li><ToolRow name="Edited" target={<ToolPath path="src/auth/session.ts" />} /></li>
 *   <li><ToolRow name="Ran" target="npm test" meta="12s" open={o} onToggle={t} controls="out" /></li>
 * </ToolList>
 * <ToolNote>The test clock didn't reach the window. Fixing the comparison.</ToolNote>
 * ```
 */

/**
 * A quiet line that folds steps away under it, in the muted text: what they did ("Earlier
 * steps"), with the chevron right after it and anything in `meta` between. The line is as wide as
 * its words and brightens under the pointer; it opens to the steps as a `ToolList`. Not for a
 * turn's runs of steps, which stay open as tables so every action reads on its own line. `more`
 * says how many steps it keeps folded.
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
  /** Pictures the run's steps took (screenshots), as thumbnails after the line. */
  pictures?: TurnPicture[];
}) {
  const line = (
    <Pressable
      className="misty-turn-fold"
      data-open={props.open || undefined}
      aria-expanded={props.open}
      aria-controls={props.controls}
      onClick={props.onToggle}
    >
      <OverflowFadeText
        className={cn("misty-turn-fold-label", props.live && "misty-turn-fold-live")}
        aria-live="polite"
      >
        {props.summary}
      </OverflowFadeText>
      <span className="misty-turn-fold-end">
        {props.more ? <span>+{props.more} more</span> : null}
        {props.meta ? <span>{props.meta}</span> : null}
        <ChevronRight aria-hidden="true" className="misty-turn-fold-chevron" />
      </span>
    </Pressable>
  );
  return props.pictures?.length ? (
    <div className="misty-turn-line">
      {line}
      <TurnPictures pictures={props.pictures} />
    </div>
  ) : (
    line
  );
}

/** A picture a step took, for a turn line's thumbnails: where it is and what it shows. */
export type TurnPicture = { src: string; label: string };

/**
 * The pictures a run of steps took (screenshots, captured windows), as small thumbnails after its
 * table, each with a hairline edge and the control's corners; pressing one opens it whole in a
 * viewer. `TurnFold` and a bare `ToolRow` draw these from their `pictures`.
 */
export function TurnPictures(props: { pictures: TurnPicture[] }) {
  const [shown, setShown] = useState<number>();
  const picture = shown === undefined ? undefined : props.pictures[shown];
  return (
    <span className="misty-turn-pictures">
      {props.pictures.map((item, index) => (
        <Pressable
          key={item.src}
          className="misty-turn-picture"
          aria-label={`Open ${item.label}`}
          onClick={() => setShown(index)}
        >
          <img src={item.src} alt="" loading="lazy" />
        </Pressable>
      ))}
      <Dialog open={picture !== undefined} onOpenChange={(open) => (open ? null : setShown(undefined))}>
        <DialogContent size="media">
          <DialogHeader>
            <DialogTitle>{picture?.label}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {picture ? (
              <img className="misty-turn-picture-full" src={picture.src} alt={picture.label} />
            ) : null}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </span>
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
 * One step on one 36px line: what it did (muted, in a column as wide as the table's longest
 * verb), what it acted on (full color, fading at the edge), and its end (a duration, a count,
 * line changes). Rows carry no icon. A row that opens shows a chevron at its end on hover and while open. A running step's verb
 * moves with a highlight, a failed one is red, one waiting on the person amber. Outside a ToolList
 * it stands alone as a bare line as wide as its words, with its chevron right after them, such as
 * the turn's thinking or a run of one step between two notes ("Edited workers.rs +23").
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
  /** Pictures the step took, as thumbnails after a bare row (never inside a ToolList). */
  pictures?: TurnPicture[];
}) {
  const content = (
    <>
      <span className="misty-tool-row-name">{props.name}</span>
      <OverflowFadeText className="misty-tool-row-target">{props.target}</OverflowFadeText>
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
  const row = props.onToggle ? (
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
  return props.pictures?.length ? (
    <div className="misty-turn-line">
      {row}
      <TurnPictures pictures={props.pictures} />
    </div>
  ) : (
    row
  );
}

/**
 * A path as a row shows it: only the file's name, so a step reads "Edited workers.rs" and the
 * table's column reads as a list of files; the folder shows, muted, in a turn's changed files.
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
 * nothing else in the turn spins. `waiting` turns the phrase amber and stills it. It starts with
 * the turn's state mark (the muted spinner while it works, the amber dot while it waits on the
 * person). With `onToggle` the line opens what is running now (its live output), with the
 * chevron after the time.
 */
export function TurnStatus(props: {
  phrase: string;
  /** How long the turn has worked, such as "1m 12s". */
  elapsed?: string;
  /** More facts after the time, such as the tokens so far. */
  extra?: ReactNode;
  waiting?: boolean;
  /** Given with onToggle, the line opens what is running now. */
  open?: boolean;
  onToggle?(): void;
  /** The id of what it opens. */
  controls?: string;
}) {
  const content = (
    <>
      <StateMark
        kind={props.waiting ? "waiting" : "working"}
        label={props.waiting ? "Waiting for you" : "Working"}
      />
      <OverflowFadeText
        className={cn("misty-turn-status-phrase", !props.waiting && "misty-turn-fold-live")}
        data-waiting={props.waiting || undefined}
      >
        {props.phrase}
      </OverflowFadeText>
      {props.elapsed ? <span className="misty-turn-status-fact">{props.elapsed}</span> : null}
      {props.extra ? <span className="misty-turn-status-fact">{props.extra}</span> : null}
      {props.onToggle ? (
        <ChevronRight aria-hidden="true" className="misty-turn-fold-chevron" />
      ) : null}
    </>
  );
  return (
    <div className="misty-turn-status" role="status" aria-live="polite">
      {props.onToggle ? (
        <Pressable
          className="misty-turn-status-line"
          data-open={props.open || undefined}
          aria-expanded={Boolean(props.open)}
          aria-controls={props.controls}
          onClick={props.onToggle}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
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
              <OverflowFadeText className="misty-tool-row-target">
                <ToolPath path={file.path} />
              </OverflowFadeText>
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

/** Where one task of a turn's list is. */
export type TurnTaskState = "pending" | "working" | "waiting" | "done" | "failed" | "skipped";

/** One task of a `TurnTasks` list. */
export type TurnTask = {
  id: string;
  title: ReactNode;
  state: TurnTaskState;
  /** A muted line under the title, such as why it is blocked or what it found. */
  note?: ReactNode;
  /** How far in it sits, for a task a helper agent took on under another (0, the default, at the start). */
  depth?: number;
};

const taskMarks: Record<TurnTaskState, ReactNode> = {
  pending: <CircleDashed aria-hidden="true" />,
  working: <Spinner label={false} />,
  waiting: <StateMark kind="waiting" />,
  done: <CircleCheck aria-hidden="true" />,
  failed: <CircleX aria-hidden="true" />,
  skipped: <CircleMinus aria-hidden="true" />,
};

const taskWords: Record<TurnTaskState, string> = {
  pending: "Not started",
  working: "In progress",
  waiting: "Waiting",
  done: "Done",
  failed: "Failed",
  skipped: "Skipped",
};

/**
 * The one task list every agent keeps while it works (an engine's todos and Misty's checklist
 * alike), as one card with a hairline edge near the end of the turn, just above its `TurnStatus`:
 * each task on its own line after its mark, a dashed ring before it starts, the one loader while
 * it is worked on (in the text color, the rest muted), the amber dot while it waits on the person,
 * a check once done, a cross when it failed. A task may carry a muted `note` under it and sit in a
 * step (`depth`) under the task that handed it on. The titles wrap rather than fade. `head` is one
 * muted line over the tasks (a lesson's goal and how far it got) and `foot` what closes the card
 * (a summary, the one button that goes on). A Tutor lesson's objectives use the same card. Not for
 * a turn's steps, which are `ToolRow`s.
 *
 * ```tsx
 * <TurnTasks label="Tasks" tasks={[{ id: "1", title: "Find the bug", state: "working" }]} />
 * ```
 */
export function TurnTasks(props: {
  label: string;
  tasks: TurnTask[];
  head?: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <div className="misty-turn-tasks">
      {props.head ? <div className="misty-turn-tasks-head">{props.head}</div> : null}
      <ol className="misty-turn-tasks-list" aria-label={props.label}>
      {props.tasks.map((task) => (
        <li
          key={task.id}
          className="misty-turn-task"
          data-state={task.state}
          style={task.depth ? { paddingInlineStart: `calc(var(--spacing) * ${task.depth * 6})` } : undefined}
        >
          <span className="misty-turn-task-mark">{taskMarks[task.state]}</span>
          <span className="sr-only">{taskWords[task.state]}</span>
          <span className="misty-turn-task-text">
            <span className="misty-turn-task-title">{task.title}</span>
            {task.note ? <span className="misty-turn-task-note">{task.note}</span> : null}
          </span>
        </li>
      ))}
      </ol>
      {props.foot ? <div className="misty-turn-tasks-foot">{props.foot}</div> : null}
    </div>
  );
}
