import React from "react";
import { Folder, GitBranch } from "lucide-react";
import { PathLine } from "../../../src";

export const meta = { name: "PathLine", file: "layout/PathLine.tsx", about: "", wide: false, order: 5 };

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
      <PathLine
        label="Where this chat works"
        segments={[
          { label: "Research" },
          { label: "misty-org/misty", icon: Folder },
          { label: "design-system-gallery", icon: GitBranch },
        ]}
      />
    </ResizableBox>
  );
}
