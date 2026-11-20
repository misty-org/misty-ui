import React from "react";
import { GitBranch, GitCompareArrows } from "lucide-react";
import { Button, SidePanel, SidePanelHeader, SidePanelLead, Surface, Text } from "../../../src";

export const meta = {
  name: "SidePanel · SidePanelHeader · SidePanelLead",
  file: "layout/SidePanel.tsx",
  about: "Drag its leading edge; the header's button widens it.",
  wide: true,
  order: 14,
};

function SidePanelDemo() {
  const [width, setWidth] = React.useState(320);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Surface tone="page" className="flex h-80 overflow-hidden rounded-lg">
      <div className="min-w-0 flex-1 p-4">
        <Text size="body" tone="muted">
          The chat column
        </Text>
      </div>
      <SidePanel
        label="Changes"
        name="Changes"
        icon={GitCompareArrows}
        width={width}
        onResize={setWidth}
        expanded={expanded}
        onToggleExpanded={() => setExpanded(!expanded)}
        onClose={() => undefined}
      >
        <SidePanelHeader>
          <SidePanelLead>
            <Button variant="quiet" icon={GitBranch}>
              main
            </Button>
          </SidePanelLead>
        </SidePanelHeader>
        <div className="p-3">
          <Text size="meta" tone="muted">
            3 files changed
          </Text>
        </div>
      </SidePanel>
    </Surface>
  );
}

export default function Example() {
  return <SidePanelDemo />;
}
