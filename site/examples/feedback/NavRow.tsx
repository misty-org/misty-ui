import React from "react";
import { Folder, Home, MessageSquare, Search, Settings } from "lucide-react";
import { NavGroupHeading, NavList, NavRow, NavRowLabel, Surface } from "../../../src";

export const meta = {
  name: "NavRow · NavRowLabel · NavList · NavGroupHeading",
  file: "navigation/NavRow.tsx",
  about: "",
  wide: false,
  order: 14,
};

function NavDemo() {
  const [current, setCurrent] = React.useState("home");
  const [open, setOpen] = React.useState(true);
  const places = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "chats", label: "Direct messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <Surface tone="sidebar" radius="lg" className="grid w-64 gap-2 p-2">
      <NavList>
        {places.map(({ id, label, icon: Icon }) => (
          <NavRow key={id} current={current === id} onClick={() => setCurrent(id)}>
            <Icon />
            <NavRowLabel bright={current === id}>{label}</NavRowLabel>
          </NavRow>
        ))}
      </NavList>
      <NavGroupHeading name="Pinned" collapsible={{ open, onToggle: () => setOpen(!open) }} />
      {open ? (
        <NavList>
          <NavRow>
            <Folder />
            <NavRowLabel>Research</NavRowLabel>
          </NavRow>
        </NavList>
      ) : null}
    </Surface>
  );
}

export default function Example() {
  return <NavDemo />;
}
