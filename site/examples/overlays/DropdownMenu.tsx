import React from "react";
import { ArrowDownAZ, Copy, Pencil, Share2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  MenuCheckItem,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  MenuTrigger,
} from "../../../src";

export const meta = {
  name: "DropdownMenu · MenuTrigger · MenuItem · MenuCheckItem · MenuRadioGroup · MenuSubmenu · MenuLabel · MenuSeparator",
  file: "overlays/DropdownMenu.tsx · MenuItem.tsx · MenuTrigger.tsx",
  about:
    "Open it: a labelled group, a disabled row with its reason, a check, a submenu of radios, a danger row.",
  wide: false,
  order: 0,
};

function MenuDemo() {
  const [hints, setHints] = React.useState(true);
  const [sort, setSort] = React.useState("recent");
  return (
    <DropdownMenu>
      <MenuTrigger label="Options" />
      <DropdownMenuContent>
        <MenuGroup>
          <MenuLabel>Chat</MenuLabel>
          <MenuItem icon={Pencil} label="Rename" shortcut="⌘R" />
          <MenuItem icon={Copy} label="Duplicate" />
          <MenuItem icon={Share2} label="Share" disabled reason="Only the owner can share" />
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckItem label="Show shortcut hints" checked={hints} onCheckedChange={setHints} />
        <MenuSubmenu icon={ArrowDownAZ} label="Sort by">
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="recent" label="Most recent" />
            <MenuRadioItem value="name" label="Name" />
            <MenuRadioItem value="created" label="Date created" />
          </MenuRadioGroup>
        </MenuSubmenu>
        <MenuSeparator />
        <MenuItem icon={Trash2} label="Delete" danger />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Example() {
  return <MenuDemo />;
}
