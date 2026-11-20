import React from "react";
import { Button, Surface, Text, WorkspaceOverlay } from "../../../src";

export const meta = {
  name: "WorkspaceOverlay",
  file: "overlays/WorkspaceOverlay.tsx",
  about: "",
  wide: false,
  order: 13,
};

function WorkspaceOverlayDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open workspace overlay</Button>
      <WorkspaceOverlay open={open} ariaLabel="Settings" onClose={() => setOpen(false)}>
        <Surface tone="page" radius="xl" edge="hairline" className="grid w-96 gap-3 p-6">
          <Text size="title" weight="semibold">
            Settings
          </Text>
          <Text size="meta" tone="muted">
            Press Escape or click outside to close.
          </Text>
        </Surface>
      </WorkspaceOverlay>
    </>
  );
}

export default function Example() {
  return <WorkspaceOverlayDemo />;
}
