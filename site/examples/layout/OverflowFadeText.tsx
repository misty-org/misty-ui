import React from "react";
import { OverflowFadeText } from "../../../src";

export const meta = {
  name: "OverflowFadeText",
  file: "layout/OverflowFadeText.tsx",
  about: "Narrow the box: the end fades, no ellipsis.",
  wide: false,
  order: 7,
};

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
      <OverflowFadeText full>
        A very long name for a chat about planning the whole quarter's launch schedule
      </OverflowFadeText>
    </ResizableBox>
  );
}
