import { Pressable, Text } from "../../../src";

export const meta = {
  name: "Pressable",
  file: "controls/Pressable.tsx",
  about: "Each wash, under the pointer.",
  wide: false,
  order: 8,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["row", "control", "text", "card", "strong", "tint", "panel"] as const).map((wash) => (
        <Pressable key={wash} wash={wash} className="rounded-md px-3 py-2 text-left">
          <Text size="control">wash="{wash}"</Text>
        </Pressable>
      ))}
      <Pressable wash="row" selected className="rounded-md px-3 py-2 text-left">
        <Text size="control">selected</Text>
      </Pressable>
    </div>
  );
}
