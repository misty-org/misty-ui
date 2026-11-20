import { Pencil, Trash2 } from "lucide-react";
import { MenuItem, RowActions, Text } from "../../../src";

export const meta = {
  name: "RowActions",
  file: "overlays/RowActions.tsx",
  about: "Hover the row for its ⋯, or right-click it.",
  wide: false,
  order: 4,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className="group/row flex h-8 items-center gap-2 rounded-md px-2 hover:bg-[var(--color-row-hover)]">
      <Text size="control" className="min-w-0 flex-1">
        Weekly plan
      </Text>
      <RowActions label="Note actions">
        <MenuItem icon={Pencil} label="Rename" />
        <MenuItem icon={Trash2} label="Delete" danger />
      </RowActions>
    </div>
  );
}
