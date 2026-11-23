import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../class_names";
import { controlFrame } from "../controls/control_frame";
import { renderIcon, type IconSource } from "./ActionBar";
import { OverflowFadeText } from "./OverflowFadeText";
import { SidewaysScroll } from "./SidewaysScroll";

export type PathFieldSegment = {
  /** Stable key; defaults to the segment's position. */
  id?: string;
  icon?: IconSource;
  label: string;
  /** Opens this folder. Without it the segment is plain text, such as a list that has no folders. */
  onSelect?: () => void;
};

export type PathFieldProps = {
  /** The open folder's path, one segment per folder from the top. */
  segments: ReadonlyArray<PathFieldSegment>;
  /** Accessible name, e.g. "Path". */
  label: string;
  /** The path as text, put in the box when the person starts typing one. */
  value?: string;
  /** Goes to a typed path. Without it the path can't be typed. */
  onSubmit?: (text: string) => void;
  placeholder?: string;
  /** Starts typing when this changes to a new value, such as a Go to folder shortcut. */
  editRequest?: number;
  /**
   * A field's frame instead of the fill: a hairline around the card's color, as Kura's path bar.
   * Pair it with a `framed` SearchField beside it.
   */
  framed?: boolean;
  /** Layout only: width, flex or margins. Its height and corners are the shared field frame's. */
  className?: string;
};

const segmentClass = cn(
  "flex h-6 min-w-0 max-w-60 shrink-0 items-center gap-1.5 rounded-md px-1.5 text-meta outline-none",
  "[&_svg]:shrink-0",
);

/**
 * A file manager's path bar, as Kura's and Explorer's: the open folder's path in a filled field,
 * each folder a quiet button that opens it with a chevron between them, the last one bright. A long
 * path scrolls sideways and keeps the open folder in view. With `onSubmit`, a click on the field's
 * empty part or a double-click turns it into a text box holding `value`: Enter goes there, Escape or
 * leaving it puts the path back. A quiet path under a composer is PathLine instead.
 *
 * ```tsx
 * <PathField label="Path" segments={folders} value="/Users/ana/Documents" onSubmit={goTo} />
 * ```
 */
export function PathField({
  segments,
  label,
  value = "",
  onSubmit,
  placeholder = "Type a path",
  editRequest,
  framed = false,
  className,
}: PathFieldProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pathKey = segments.map((segment) => segment.label).join("\n");

  React.useLayoutEffect(() => {
    const row = rowRef.current;
    if (row && !editing) row.scrollLeft = row.scrollWidth;
  }, [pathKey, editing]);

  React.useLayoutEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const begin = React.useCallback(() => {
    if (!onSubmit) return;
    setDraft(value);
    setEditing(true);
  }, [onSubmit, value]);

  const beginRef = React.useRef(begin);
  beginRef.current = begin;
  const lastRequest = React.useRef(editRequest);
  React.useEffect(() => {
    if (editRequest === undefined || editRequest === lastRequest.current) return;
    lastRequest.current = editRequest;
    beginRef.current();
  }, [editRequest]);

  const submit = () => {
    const text = draft.trim();
    setEditing(false);
    if (text && onSubmit) onSubmit(text);
  };

  return (
    <div
      data-slot="path-field"
      className={cn(
        controlFrame.md,
        "flex min-w-0 items-center border px-1 transition-colors",
        framed
          ? ["border-charcoal-border bg-charcoal-card", editing ? "border-charcoal-border-strong" : "hover:border-charcoal-border-strong"]
          : ["border-transparent bg-cream/5", editing ? "border-cream/14 bg-cream/8" : "hover:bg-cream/8"],
        className,
      )}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          aria-label={label}
          autoComplete="off"
          spellCheck={false}
          value={draft}
          placeholder={placeholder}
          data-slot="path-field-input"
          className="h-full w-full min-w-0 bg-transparent px-1.5 text-meta text-cream-bright outline-none placeholder:text-cream-muted"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            } else if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setEditing(false);
            }
          }}
        />
      ) : (
        <SidewaysScroll
          ref={rowRef}
          role="group"
          aria-label={label}
          className={cn("h-full flex-1 gap-0.5", onSubmit && "cursor-text")}
          onClick={(event) => {
            if (event.target === event.currentTarget) begin();
          }}
          onDoubleClick={begin}
        >
          {segments.map((segment, index) => {
            const last = index === segments.length - 1;
            const body = (
              <>
                {renderIcon(segment.icon)}
                <OverflowFadeText full>{segment.label}</OverflowFadeText>
              </>
            );
            return (
              <React.Fragment key={segment.id ?? index}>
                {index > 0 ? <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-cream-muted" /> : null}
                {segment.onSelect ? (
                  <button
                    type="button"
                    aria-current={last ? "location" : undefined}
                    className={cn(
                      segmentClass,
                      last ? "text-cream-bright" : "text-cream",
                      "transition-colors hover:bg-control-hover hover:text-cream-bright",
                      "focus-visible:bg-control-hover focus-visible:text-cream-bright",
                    )}
                    onClick={segment.onSelect}
                    onDoubleClick={(event) => event.stopPropagation()}
                  >
                    {body}
                  </button>
                ) : (
                  <span className={cn(segmentClass, last ? "text-cream-bright" : "text-cream")}>{body}</span>
                )}
              </React.Fragment>
            );
          })}
        </SidewaysScroll>
      )}
    </div>
  );
}
