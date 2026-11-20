import { Pencil, Trash2 } from "lucide-react";
import { IconButton, Separator, ToolbarDivider } from "../../../src";

export const meta = {
  name: "Separator · ToolbarDivider",
  file: "layout/Separator.tsx",
  about: "",
  wide: false,
  order: 8,
};

export default function Example() {
  return (
    <div className="grid gap-3">
      <Separator />
      <div className="flex items-center">
        <IconButton label="Edit">
          <Pencil />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Delete">
          <Trash2 />
        </IconButton>
      </div>
    </div>
  );
}
