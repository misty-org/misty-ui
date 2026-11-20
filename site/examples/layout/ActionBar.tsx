import React from "react";
import { Download, Plus, Share2, Star, Trash2 } from "lucide-react";
import { ActionBar } from "../../../src";

export const meta = {
  name: "ActionBar",
  file: "layout/ActionBar.tsx",
  about: "Drag the box's corner narrower: labels turn into icons, then fold into ⋯.",
  wide: true,
  order: 0,
};

const actions = [
  { id: "new", icon: Plus, label: "New", priority: 5, variant: "primary" as const },
  { id: "share", icon: Share2, label: "Share", priority: 4 },
  { id: "download", icon: Download, label: "Download", priority: 3 },
  { id: "star", icon: Star, label: "Favorite", priority: 2 },
  { id: "delete", icon: Trash2, label: "Delete", priority: 1, variant: "danger" as const },
];

function ResizableBox(props: { children: React.ReactNode; height?: string }) {
  return (
    <div
      className="min-w-48 resize-x overflow-hidden rounded-lg border border-dashed border-charcoal-border p-1"
      style={{ width: "100%", height: props.height }}
    >
      {props.children}
    </div>
  );
}

export default function Example() {
  return (
    <ResizableBox>
      <ActionBar label="Note actions" items={actions} />
    </ResizableBox>
  );
}
