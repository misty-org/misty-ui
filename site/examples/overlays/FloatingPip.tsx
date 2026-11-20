import React from "react";
import { FloatingPip, Surface } from "../../../src";

export const meta = {
  name: "FloatingPip",
  file: "overlays/FloatingPip.tsx",
  about: "Drag it to another corner.",
  wide: true,
  order: 18,
};

function FloatingPipDemo() {
  const [corner, setCorner] = React.useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">(
    "bottom-right",
  );
  return (
    <Surface tone="well" radius="lg" className="relative h-56 overflow-hidden">
      <FloatingPip
        label="Agent browser"
        openLabel="Open the browser"
        picture={<Surface tone="media" className="size-full" />}
        caption="example.com"
        corner={corner}
        onCornerChange={setCorner}
        onOpen={() => undefined}
      />
    </Surface>
  );
}

export default function Example() {
  return <FloatingPipDemo />;
}
