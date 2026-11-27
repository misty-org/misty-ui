import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FooterControls, OutOfRow } from "../controls/RowContext";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../class_names";
import { IconButton } from "../controls/IconButton";
import { PageDimmedContext } from "./page_dimmed";

function cleanupPointerEvents() {
  if (typeof document === "undefined") return;
  const modalOpen =
    document.querySelector("[data-slot='dialog-content'][data-state='open']") ||
    document.querySelector("[data-slot='alert-dialog-content'][data-state='open']");
  if (!modalOpen) {
    if (document.body.style.pointerEvents === "none") {
      document.body.style.pointerEvents = "";
    }
    if (document.documentElement.style.pointerEvents === "none") {
      document.documentElement.style.pointerEvents = "";
    }
    for (const cls of Array.from(document.body.classList)) {
      if (cls.startsWith("block-interactivity-")) {
        document.body.classList.remove(cls);
      }
    }
    if (document.body.hasAttribute("data-scroll-locked")) {
      document.body.removeAttribute("data-scroll-locked");
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", cleanupPointerEvents, { capture: true, passive: true });
}

const Dialog = ({
  open,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) => {
  React.useEffect(() => {
    if (!open) {
      cleanupPointerEvents();
      const t1 = window.setTimeout(cleanupPointerEvents, 50);
      const t2 = window.setTimeout(cleanupPointerEvents, 200);
      const t3 = window.setTimeout(cleanupPointerEvents, 350);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }
  }, [open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        cleanupPointerEvents();
        window.setTimeout(cleanupPointerEvents, 50);
        window.setTimeout(cleanupPointerEvents, 200);
        window.setTimeout(cleanupPointerEvents, 350);
      }
    },
    [onOpenChange],
  );

  return <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props} />;
};

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "fixed inset-0 layer-dialog-backdrop bg-scrim duration-160",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:pointer-events-none",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * How wide a dialog is: sm 384 (a confirm, a rename), md 512 (default, most forms), lg 672
 * (a picker, a list), xl 896 (a layout chooser, help), and `media`, a large viewer that takes
 * the window less a margin, for images, documents and previews.
 */
export type DialogSize = "sm" | "md" | "lg" | "xl" | "media";

/**
 * `flow` (default): the whole dialog scrolls when it is taller than the window. `scroll`: the
 * header and footer stay put and only the DialogBody between them scrolls. `media` always uses
 * `scroll`, with the body filling the height.
 */
export type DialogLayout = "flow" | "scroll";

const dialogSizeClass: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  media:
    "h-[calc(100dvh-var(--spacing)*8-var(--misty-modal-inset-top,0px))] max-h-[calc(100dvh-var(--spacing)*8-var(--misty-modal-inset-top,0px))] w-[calc(100%-var(--spacing)*8)] max-w-7xl",
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    container?: HTMLElement | null;
    /** sm 384, md 512 (default), lg 672, xl 896, or `media` for a large viewer. */
    size?: DialogSize;
    /** `scroll` keeps the header and footer fixed and scrolls the DialogBody. */
    layout?: DialogLayout;
    /** `top` sits the panel in the upper part of the window, for search-style dialogs. */
    placement?: "center" | "top";
    /** Leaves the page undimmed, for panels that open over one control. */
    backdrop?: boolean;
    /** Omits the corner close button, for dialogs that only their own buttons may dismiss. */
    hideClose?: boolean;
    /**
     * `card` (the default) is a dialog of its own: a form or a question, set in from its edges.
     * `page` makes the dialog one sheet in the page's color for content that is a page (a viewer,
     * a file browser, a collection): no inset, a DialogHeader as a 54px bar with a hairline under
     * it and the close button in it, and the DialogBody edge to edge under it. `media` is always
     * `page`.
     */
    tone?: "card" | "page";
  }
>(
  (
    {
      tone,
      className,
      children,
      container,
      size = "md",
      layout = "flow",
      placement = "center",
      backdrop = true,
      hideClose,
      onPointerDownOutside,
      onInteractOutside,
      onFocusOutside,
      ...props
    },
    ref,
  ) => {
    const scrolls = layout === "scroll" || size === "media";
    const sheet = (tone ?? (size === "media" ? "page" : "card")) === "page";
    const dimmed = React.useContext(PageDimmedContext);
    const fromTour = (event: Event) =>
      event.target instanceof Element && event.target.closest('[data-slot="tour"]') !== null;
    React.useEffect(() => {
      return () => {
        cleanupPointerEvents();
        window.setTimeout(cleanupPointerEvents, 50);
        window.setTimeout(cleanupPointerEvents, 200);
        window.setTimeout(cleanupPointerEvents, 350);
      };
    }, []);

    return (
      <DialogPortal container={container}>
        {backdrop && !dimmed ? (
          <DialogOverlay className={container ? "absolute inset-0" : undefined} />
        ) : null}
        <div
          data-slot="dialog-positioner"
          className={cn(
            container ? "absolute" : "fixed",
            "inset-0 layer-dialog pointer-events-none flex justify-center",
            placement === "top" ? "items-start" : "items-center",
            !container && placement !== "top" && "pt-[var(--misty-modal-inset-top,0px)]",
            placement === "top" &&
              backdrop &&
              (container ? "pt-[12vh]" : "pt-[max(12vh,var(--misty-modal-inset-top,0px))]"),
            !backdrop && "justify-start",
          )}
        >
          <DialogPrimitive.Content
            ref={ref}
            data-slot="dialog-content"
            data-size={size}
            data-layout={scrolls ? "scroll" : "flow"}
            data-sheet={sheet ? "" : undefined}
            className={cn(
              "group/dialog pointer-events-auto relative",
              scrolls
                ? "flex flex-col overflow-hidden"
                : "grid grid-cols-[minmax(0,1fr)] overflow-y-auto",
              "max-h-[calc(100dvh-var(--spacing)*16-var(--misty-modal-inset-top,0px))] w-[calc(100%-var(--spacing)*8)]",
              "misty-scrollbar-rounded rounded-xl",
              sheet
                ? "gap-0 bg-charcoal-bg [--dialog-inset:0px]"
                : "gap-4 bg-charcoal-card p-(--dialog-inset) [--dialog-inset:--spacing(6)]",
              dialogSizeClass[size],
              "text-body text-cream misty-dialog-motion",
              "data-[state=closed]:pointer-events-none",
              className,
            )}
            {...props}
            onPointerDownOutside={(event) => {
              if (fromTour(event)) event.preventDefault();
              onPointerDownOutside?.(event);
            }}
            onInteractOutside={(event) => {
              if (fromTour(event)) event.preventDefault();
              onInteractOutside?.(event);
            }}
            onFocusOutside={(event) => {
              if (fromTour(event)) event.preventDefault();
              onFocusOutside?.(event);
            }}
          >
            <PageDimmedContext.Provider value={dimmed || backdrop}>
              <OutOfRow>{children}</OutOfRow>
            </PageDimmedContext.Provider>
            {hideClose ? null : (
              <DialogPrimitive.Close asChild>
                <IconButton
                  label="Close"
                  variant="quiet"
                  data-slot="dialog-close"
                  className={cn(
                    "absolute",
                    sheet ? "right-3 top-2" : "right-4 top-4",
                  )}
                >
                  <X />
                </IconButton>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-header"
    className={cn(
      "flex shrink-0 flex-col gap-1.5 pr-8 text-left",
      "group-data-[sheet]/dialog:h-(--ui-header) group-data-[sheet]/dialog:flex-row",
      "group-data-[sheet]/dialog:items-center group-data-[sheet]/dialog:pl-3 group-data-[sheet]/dialog:pr-14",
      "group-data-[sheet]/dialog:border-b group-data-[sheet]/dialog:border-charcoal-border",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

/**
 * The dialog's content between its header and footer. With `layout="scroll"` (and always at
 * `size="media"`) it takes the height that's left and scrolls on its own, edge to edge, while the
 * header and footer stay put. In a `page` sheet it has no inset: the page it holds sits flush under
 * the header's hairline. In the default flow it is a plain block.
 *
 * ```tsx
 * <DialogContent size="lg" layout="scroll">
 *   <DialogHeader><DialogTitle>Keyboard shortcuts</DialogTitle></DialogHeader>
 *   <DialogBody>{rows}</DialogBody>
 *   <DialogFooter><Button size="lg">Done</Button></DialogFooter>
 * </DialogContent>
 * ```
 */
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-body"
    className={cn(
      "min-h-0 min-w-0",
      "group-data-[layout=scroll]/dialog:-mx-(--dialog-inset) group-data-[layout=scroll]/dialog:flex-1",
      "group-data-[layout=scroll]/dialog:overflow-y-auto group-data-[layout=scroll]/dialog:px-(--dialog-inset)",
      className,
    )}
    {...props}
  />
);
DialogBody.displayName = "DialogBody";

/**
 * The dialog's buttons, right-aligned: a quiet Cancel, then its one primary action. Every button in
 * it is the footer's one size (40.5px), whatever size it asks for.
 */
const DialogFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "flex shrink-0 items-center justify-end gap-2",
      "group-data-[sheet]/dialog:border-t group-data-[sheet]/dialog:border-charcoal-border",
      "group-data-[sheet]/dialog:px-3 group-data-[sheet]/dialog:py-2",
      className,
    )}
    {...props}
  >
    <FooterControls>{children}</FooterControls>
  </div>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-title font-semibold text-cream-bright", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-body text-cream-muted", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};
