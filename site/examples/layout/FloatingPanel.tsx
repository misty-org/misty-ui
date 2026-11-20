import { FloatingPanel, Surface, Text } from "../../../src";

export const meta = {
  name: "FloatingPanel",
  file: "layout/FloatingPanel.tsx",
  about: "For full-color scenes only; Misty's own panes are flat.",
  wide: true,
  order: 16,
};

export default function Example() {
  return (
    <Surface tone="stage" radius="lg" className="relative h-56 overflow-hidden">
      <FloatingPanel title="Layers" anchor="top-right" onClose={() => undefined} width="sm">
        <Text size="meta" tone="muted">
          Floats over the scene, blurred behind.
        </Text>
      </FloatingPanel>
    </Surface>
  );
}
