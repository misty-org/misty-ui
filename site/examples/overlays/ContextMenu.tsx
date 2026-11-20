import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  MenuItem,
  MenuSeparator,
  Surface,
  Text,
} from "../../../src";

export const meta = {
  name: "ContextMenu",
  file: "overlays/ContextMenu.tsx",
  about: "",
  wide: false,
  order: 3,
};

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Surface tone="well" radius="lg" className="grid h-20 place-items-center">
          <Text size="meta" tone="muted">
            Right-click here
          </Text>
        </Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <MenuItem icon={FolderOpen} label="Open" />
        <MenuItem icon={Pencil} label="Rename" />
        <MenuSeparator />
        <MenuItem icon={Trash2} label="Delete" danger />
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function Example() {
  return <ContextMenuDemo />;
}
