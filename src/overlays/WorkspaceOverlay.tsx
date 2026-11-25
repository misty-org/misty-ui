import type { ReactNode } from "react";
import { OutOfRow } from "../controls/RowContext";
import { useEffect } from "react";
import { createPortal } from "react-dom";
const settingsOverlayLayerClass = [
  "fixed inset-0 layer-workspace-overlay grid place-items-center bg-scrim px-6 pb-6 pt-[max(var(--spacing)*6,var(--misty-modal-inset-top,0px))]",
  "animate-in fade-in-0 duration-200",
].join(" ");
const settingsOverlayPanelClass = [
  "h-[min(--spacing(225),calc(100dvh-var(--spacing)*6-max(var(--spacing)*6,var(--misty-modal-inset-top,0px))))] w-[min(--spacing(300),calc(100dvw-var(--spacing)*24))]",
  "min-w-0 overflow-hidden rounded-xl bg-charcoal-bg",
  "misty-dialog-motion",
].join(" ");

/**
 * Shared modal shell for the full-page workspaces that are presented as overlays
 * (Settings, Account, Remotes). Handles the portal, the Escape key, and
 * dismiss-on-backdrop-click so each caller only supplies its own content.
 */
export function WorkspaceOverlay(props: {
  open: boolean;
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { onClose, open } = props;
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      data-slot="workspace-overlay"
      className={`app-pages-root ${settingsOverlayLayerClass}`}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        data-slot="workspace-overlay-panel"
        className={settingsOverlayPanelClass}
        role="dialog"
        aria-modal="true"
        aria-label={props.ariaLabel}
      >
        <OutOfRow>{props.children}</OutOfRow>
      </div>
    </div>,
    document.body,
  );
}
