import { Kbd, Text } from "../../../src";

export const meta = { name: "Kbd", file: "display/Kbd.tsx", about: "", wide: false, order: 13 };

export default function Example() {
  return (
    <Text size="meta" tone="muted">
      Press <Kbd>⌘K</Kbd> to search, <Kbd strong>⇧⌘P</Kbd> for commands.
    </Text>
  );
}
