import { GripVertical } from "lucide-react";
import { DragHandleButton } from "../../../src";

export const meta = {
  name: "DragHandleButton",
  file: "controls/DragHandleButton.tsx",
  about: "",
  wide: false,
  order: 6,
};

export default function Example() {
  return (
    <DragHandleButton label="Drag to move">
      <GripVertical />
    </DragHandleButton>
  );
}
