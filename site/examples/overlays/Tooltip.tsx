import { Plus } from "lucide-react";
import { Button, Tooltip } from "../../../src";

export const meta = {
  name: "Tooltip",
  file: "overlays/Tooltip.tsx",
  about: "Hover the button.",
  wide: false,
  order: 8,
};

export default function Example() {
  return (
    <Tooltip content="New chat" shortcut="⌘N">
      <Button icon={Plus}>Hover me</Button>
    </Tooltip>
  );
}
