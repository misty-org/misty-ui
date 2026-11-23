import { Check, Cloud, CloudOff, X } from "lucide-react";
import { cn } from "../class_names";
import { Spinner } from "../feedback/Spinner";
import { Tooltip } from "../overlays/Tooltip";

/**
 * Where a file in a synced drive (a Space's drive) is: only on the server (`online-only`), on its
 * way down or up, or kept on this computer alone (`not-synced`). A file that is simply downloaded
 * and in step shows no mark. Sync needs no color, so these are all muted.
 */
export type DriveSyncState = "online-only" | "downloading" | "uploading" | "not-synced";

/**
 * The states an item can show with a mark: an agent's run, something new to read, a connection
 * that is up (`online`), or a drive file's sync state.
 */
export type StateMarkKind =
  | "working"
  | "waiting"
  | "unread"
  | "done"
  | "failed"
  | "online"
  | DriveSyncState;

export type StateMarkProps = {
  kind: StateMarkKind;
  /**
   * The mark's tooltip and accessible name, such as "Failed: the key was refused". Defaults to
   * the state's own words ("Working", "Waiting for you", "Unread", "Done", "Failed", "Online only"…).
   */
  label?: string;
  /** Layout only: margins or placement. */
  className?: string;
};

const defaultLabel: Record<StateMarkKind, string> = {
  working: "Working",
  waiting: "Waiting for you",
  unread: "Unread",
  done: "Done",
  failed: "Failed",
  online: "Connected",
  "online-only": "Online only",
  downloading: "Downloading",
  uploading: "Uploading",
  "not-synced": "Not synced",
};

/**
 * The one mark for an item's state, the same wherever it shows: a muted spinner while an agent
 * works, an amber dot while it waits on the person, a neutral dot for unread, a green check when
 * done, a red cross when it failed, and a green dot while a connection is up. A file in a synced
 * drive has muted kinds of its own: a cloud while it is only on the server, the spinner while it
 * downloads or uploads, and a crossed-out cloud while it stays on this computer alone. Each names
 * itself in Misty's tooltip. It sits in an 18px box, so marks line up in a column of rows.
 *
 * The drive kinds name themselves "Online only", "Downloading", "Uploading" and "Not synced". A
 * file that is downloaded and in step shows no mark, and a conflicting copy is an ordinary file with
 * no color of its own. Don't use the drive kinds for anything but a file's sync, and don't use
 * `online` (a connection that is up) for a file.
 *
 * `<StateMark kind="failed" label="Failed: out of credits" />`
 */
export function StateMark({ kind, label, className }: StateMarkProps) {
  const name = label || defaultLabel[kind];
  return (
    <Tooltip content={name}>
      <span
        role="img"
        aria-label={name}
        data-slot="state-mark"
        data-state={kind}
        className={cn("grid size-4 shrink-0 place-items-center", markTone[kind], className)}
      >
        {kind === "working" || kind === "downloading" || kind === "uploading" ? (
          <Spinner size="sm" label={false} />
        ) : null}
        {kind === "waiting" || kind === "unread" || kind === "online" ? (
          <span aria-hidden="true" className={cn("size-2 rounded-full", dotTone[kind])} />
        ) : null}
        {kind === "done" ? <Check aria-hidden="true" className="size-4" /> : null}
        {kind === "failed" ? <X aria-hidden="true" className="size-4" /> : null}
        {kind === "online-only" ? <Cloud aria-hidden="true" /> : null}
        {kind === "not-synced" ? <CloudOff aria-hidden="true" /> : null}
      </span>
    </Tooltip>
  );
}

const markTone: Record<StateMarkKind, string> = {
  working: "text-cream-muted",
  waiting: "",
  unread: "",
  done: "text-state-done",
  failed: "text-state-failed",
  online: "",
  "online-only": "text-cream-muted",
  downloading: "text-cream-muted",
  uploading: "text-cream-muted",
  "not-synced": "text-cream-muted",
};

const dotTone = {
  waiting: "bg-state-waiting",
  unread: "bg-cream",
  online: "bg-state-done",
} as const;
