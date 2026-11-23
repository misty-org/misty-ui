import { cx } from "class-variance-authority";
import { extendTailwindMerge } from "tailwind-merge";

const layers = [
  "agent-surface",
  "chrome",
  "workspace-overlay",
  "notification",
  "notification-raised",
  "dialog-backdrop",
  "dialog",
  "blocking-backdrop",
  "blocking",
  "blocking-popup",
  "menu",
  "menu-raised",
  "popover",
  "tooltip",
];

const typeRoles = [
  "micro",
  "caption",
  "meta",
  "control",
  "body",
  "page",
  "title",
  "display",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: { z: [{ layer: layers }] },
    theme: { text: [...typeRoles] },
  },
});

export function cn(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(inputs));
}
