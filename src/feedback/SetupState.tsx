import { useEffect, useState } from "react";
import { cn } from "../class_names";
import { Button } from "../controls/Button";
import { Text } from "../display/Text";
import { ErrorState } from "./StateView";

export type SetupStateProps = {
  /** What is getting ready, as it reads after "Setting up the": "video editor", "terminal". */
  tool: string;
  /**
   * `tool` is a name of its own, such as an app's ("CyberChef"), so it reads without "the":
   * "Setting up CyberChef", "CyberChef couldn't start".
   */
  named?: boolean;
  /**
   * The line in place of "Setting up the …", for a setup that is better named by what it does:
   * "Joining the drawing", "Checking Claude Code", "Connecting to the database".
   */
  label?: string;
  /** Why the tool couldn't start: shows the failed state in place of the setup line. */
  error?: string | Error | null;
  /** Starts the setup over, offered when it failed or has stalled. */
  onRetry?(): void;
  /**
   * After this long still setting up, it says so and offers Try again, so a setup that never
   * finishes never leaves the person waiting on a line forever. `false` for a setup that may
   * rightly take long (a download with its own progress). Default 20 seconds.
   */
  stallAfterMs?: number | false;
  /**
   * `pane` fills and centers in the tool's own space (an editor, a terminal, a canvas);
   * `inline` sits in the flow of a section or a dialog; `row` is one line at a control's height,
   * for a setting row whose value comes from a native check.
   */
  size?: "pane" | "inline" | "row";
  className?: string;
};

const message = (error: string | Error) => (typeof error === "string" ? error : error.message);

/**
 * A tool getting itself ready, said in words: "Setting up the video editor". It is for the time a
 * tool, runtime or connection takes to start (its code and engine loading, a terminal's shell or a
 * webview starting, a live room joining, a native check), never for data, which shows a skeleton
 * shaped like the content (`Skeleton`) or, when its shape isn't known, `PaneLoading`. When the
 * setup fails it says so with Try again, and when it runs past `stallAfterMs` it says it is taking
 * a while, so it never hangs without a word.
 *
 * ```tsx
 * <ToolSuspense tool="code editor"><EditorPane … /></ToolSuspense> // a lazyTool's code arriving
 * <SetupState tool="terminal" error={startError} onRetry={restart} />
 * <SetupState tool="engine" label="Checking Claude Code" size="row" />
 * ```
 */
export function SetupState({
  tool,
  named = false,
  label,
  error,
  onRetry,
  stallAfterMs = 20_000,
  size = "pane",
  className,
}: SetupStateProps) {
  const [stalled, setStalled] = useState(false);
  const failed = Boolean(error);
  useEffect(() => {
    setStalled(false);
    if (failed || stallAfterMs === false) return;
    const timer = window.setTimeout(() => setStalled(true), stallAfterMs);
    return () => window.clearTimeout(timer);
  }, [failed, stallAfterMs, tool, label]);

  const retry = onRetry
    ? { label: "Try again", variant: "secondary" as const, onClick: onRetry }
    : undefined;
  const subject = named ? tool : `the ${tool}`;
  const opening = named ? tool : `The ${tool}`;
  const line = label ?? `Setting up ${subject}`;

  if (size === "row") {
    return (
      <span
        role={failed ? "alert" : "status"}
        aria-label={failed ? undefined : line}
        className={cn("inline-flex h-8 min-w-0 items-center gap-2", className)}
      >
        {failed || stalled ? (
          <>
            <Text size="meta" tone={failed ? "danger" : "muted"} className="min-w-0">
              {failed ? message(error!) : `${opening} is taking a while`}
            </Text>
            {retry ? (
              <Button type="button" size="sm" variant="quiet" onClick={retry.onClick}>
                {retry.label}
              </Button>
            ) : null}
          </>
        ) : (
          <Text size="meta" tone="muted" className="min-w-0">
            {line}
          </Text>
        )}
      </span>
    );
  }

  if (failed)
    return (
      <ErrorState
        inline={size === "inline"}
        title={`${opening} couldn't start`}
        line={message(error!)}
        action={retry}
      />
    );
  if (stalled)
    return (
      <ErrorState
        inline={size === "inline"}
        title={`${opening} is taking a while`}
        line={onRetry ? "It may still finish, or you can try again." : "It may still finish."}
        action={retry}
      />
    );
  return (
    <div
      data-slot="setup-state"
      role="status"
      aria-label={line}
      className={cn(
        "grid min-w-0 place-items-center",
        size === "inline" ? "w-full px-4 py-8" : "size-full min-h-0 p-6",
        className,
      )}
    >
      <Text size="body" tone="muted">
        {line}
      </Text>
    </div>
  );
}
