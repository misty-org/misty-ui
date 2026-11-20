import { PaneFrame, Text } from "../../../src";

export const meta = {
  name: "PaneFrame",
  file: "layout/PaneFrame.tsx",
  about: "The window's tab panes; its margins are 0 today, so it shows as a plain box.",
  wide: false,
  order: 18,
};

export default function Example() {
  return (
    <div className="h-24">
      <PaneFrame className="h-full">
        <div className="p-3">
          <Text size="meta" tone="muted">
            Pane content
          </Text>
        </div>
      </PaneFrame>
    </div>
  );
}
