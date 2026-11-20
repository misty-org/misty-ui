import React from "react";
import { Folder, Home, MessageSquare, Search, Settings, UserPlus } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuCheckItem,
  MenuItem,
  NavGroupHeading,
  NavList,
  NavRow,
  NavRowLabel,
  NavTitleButton,
  Surface,
} from "../../../src";

export const meta = {
  name: "NavRow · NavTitleButton · NavRowLabel · NavList · NavGroupHeading",
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <NavTitleButton
            aria-label="Moku, switch Space"
            mark={
              <Avatar size="xs" shape="tile">
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            }
            name="Moku"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <MenuCheckItem checked label="Moku" />
          <MenuItem icon={<UserPlus />} label="Invite people" />
        </DropdownMenuContent>
      </DropdownMenu>
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
