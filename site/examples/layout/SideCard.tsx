import { SideCard, Surface, Text } from "../../../src";

export const meta = { name: "SideCard", file: "layout/SidePanel.tsx", about: "", wide: true, order: 15 };

export default function Example() {
  return (
    <Surface tone="page" className="relative flex h-48 rounded-lg">
      <div className="min-w-0 flex-1 p-4">
        <Text size="body" tone="muted">
          The column a floating card sits over
        </Text>
      </div>
      <SideCard label="Session" floating>
        <div className="grid gap-1 p-3">
          <Text size="control" weight="semibold">
            Session
          </Text>
          <Text size="meta" tone="muted">
            Sonnet 5.5 · 12 minutes
          </Text>
        </div>
      </SideCard>
    </Surface>
  );
}
