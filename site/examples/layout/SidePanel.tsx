import React from "react";
import { GitBranch, GitCompareArrows } from "lucide-react";
import { Button, FramedPage, SidePanel, SidePanelHeader, SidePanelLead, Text } from "../../../src";

export const meta = {
  name: "SidePanel · SidePanelHeader · SidePanelLead",
  file: "layout/SidePanel.tsx",
  about: "A FramedPage's end column: drag its seam; the header's button widens it over the chat.",
  wide: true,
  order: 14,
};

function SidePanelDemo() {
  const [open, setOpen] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="h-80">
      <FramedPage
        workMinWidth={240}
        end={
          open
            ? {
                id: "changes",
                label: "Resize the changes",
                width: 320,
                minWidth: 240,
                expanded,
                content: (
                  <SidePanel
                    label="Changes"
                    name="Changes"
                    icon={GitCompareArrows}
                    expanded={expanded}
                    onToggleExpanded={() => setExpanded(!expanded)}
                    onClose={() => setOpen(false)}
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
                ),
              }
            : null
        }
      >
        <div className="flex flex-col items-start gap-3 p-4">
          <Text size="body" tone="muted">
            The chat column
          </Text>
          {open ? null : <Button onClick={() => setOpen(true)}>Show changes</Button>}
        </div>
      </FramedPage>
    </div>
  );
}

export default function Example() {
  return <SidePanelDemo />;
}
