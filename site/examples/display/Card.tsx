import { Card, Text } from "../../../src";

export const meta = { name: "Card", file: "display/Card.tsx", about: "", wide: false, order: 5 };

export default function Example() {
  return (
    <Card className="px-6">
      <Text size="control" weight="semibold">
        Invitation
      </Text>
      <Text size="meta" tone="muted">
        Ada invited you to Research.
      </Text>
    </Card>
  );
}
