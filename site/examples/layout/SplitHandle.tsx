import { Panel, PanelGroup } from "react-resizable-panels";
import { SplitHandle, Text } from "../../../src";

export const meta = {
  name: "SplitHandle",
  file: "layout/SplitHandle.tsx",
  about: "Drag the seam between the panes.",
  wide: true,
  order: 13,
};

export default function Example() {
  return (
    <div className="h-32 overflow-hidden rounded-lg border border-charcoal-border">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50}>
          <div className="p-3">
            <Text size="meta" tone="muted">
              Left pane
            </Text>
          </div>
        </Panel>
        <SplitHandle direction="horizontal" label="Resize panes" />
        <Panel defaultSize={50}>
          <div className="p-3">
            <Text size="meta" tone="muted">
              Right pane
            </Text>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
