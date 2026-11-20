import { Pencil, Trash2 } from "lucide-react";
import { IconButton, RowTools, Text } from "../../../src";

export const meta = {
  name: "RowTools",
  file: "controls/RowTools.tsx",
  about: "A row's own buttons, shown on hover.",
  wide: false,
  order: 9,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className="group/row flex h-8 items-center gap-2 rounded-md px-2 hover:bg-[var(--color-row-hover)]">
      <Text size="control" className="min-w-0 flex-1">
        Hover this row
      </Text>
      <RowTools reveal="hover">
        <IconButton label="Rename">
          <Pencil />
        </IconButton>
        <IconButton label="Remove">
          <Trash2 />
        </IconButton>
      </RowTools>
    </div>
  );
}
