import { ScrollArea, Text } from "../../../src";

export const meta = { name: "ScrollArea", file: "layout/ScrollArea.tsx", about: "", wide: false, order: 11 };

export default function Example() {
  return (
    <ScrollArea className="h-32 rounded-lg border border-charcoal-border">
      <div className="grid gap-2 p-3">
        {Array.from({ length: 12 }, (_, index) => (
          <Text key={index} size="control">
            Row {index + 1}
          </Text>
        ))}
      </div>
    </ScrollArea>
  );
}
