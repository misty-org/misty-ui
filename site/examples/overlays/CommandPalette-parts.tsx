import React from "react";
import {
  Command,
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteList,
  CommandPaletteMatch,
  CommandPaletteTab,
  Surface,
} from "../../../src";

export const meta = {
  name: "CommandPalette parts",
  file: "overlays/CommandPalette.tsx",
  about: "",
  wide: false,
  order: 15,
};

function CommandPaletteDemo() {
  const [tab, setTab] = React.useState("all");
  return (
    <Surface tone="card" edge="hairline" radius="xl" className="grid gap-2 overflow-hidden p-2">
      <Command>
        <CommandPaletteInput placeholder="Search chats, docs and commands" />
        <div className="flex gap-1">
          {["all", "chats", "docs"].map((id) => (
            <CommandPaletteTab key={id} aria-selected={tab === id} onClick={() => setTab(id)}>
              {id[0].toUpperCase() + id.slice(1)}
            </CommandPaletteTab>
          ))}
        </div>
        <CommandPaletteList>
          <CommandPaletteItem value="plan">
            <span>
              Weekly <CommandPaletteMatch>plan</CommandPaletteMatch>
            </span>
          </CommandPaletteItem>
          <CommandPaletteItem value="planner">
            <span>
              <CommandPaletteMatch>Plan</CommandPaletteMatch>ner
            </span>
          </CommandPaletteItem>
        </CommandPaletteList>
      </Command>
    </Surface>
  );
}

export default function Example() {
  return <CommandPaletteDemo />;
}
