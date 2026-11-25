import React from "react";
import { Folder, Home, MessageSquare, Search, Settings, UserPlus } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  MenuTrigger,
  MenuCheckItem,
  MenuItem,
  NavBranch,
  NavGroupHeading,
  NavList,
  NavRow,
  NavRowLabel,
  Surface,
} from "../../../src";

export const meta = {
  name: "NavRow · NavRowLabel · NavList · NavBranch · NavGroupHeading",
  file: "navigation/NavRow.tsx",
  about: "",
  wide: false,
  order: 14,
};

function NavDemo() {
  const [current, setCurrent] = React.useState("settings");
  const [open, setOpen] = React.useState(true);
  const places = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <Surface tone="sidebar" radius="lg" className="grid w-64 gap-2 p-2">
      <DropdownMenu>
        <MenuTrigger
          heading
          label="Moku, switch Space"
          value="Moku"
          mark={
            <Avatar size="xs" shape="tile">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          }
        />
        <DropdownMenuContent side="bottom" align="start">
          <MenuCheckItem checked label="Moku" />
          <MenuItem icon={<UserPlus />} label="Invite people" />
        </DropdownMenuContent>
      </DropdownMenu>
      <NavList>
        {places.map(({ id, label, icon: Icon }) => (
          <React.Fragment key={id}>
            <NavRow current={current === id} onClick={() => setCurrent(id)}>
              <Icon />
              <NavRowLabel bright={current === id}>{label}</NavRowLabel>
            </NavRow>
            {id === "settings" && current === "settings" ? (
              <NavBranch>
                {["General", "Appearance", "Shortcuts"].map((section) => (
                  <NavRow key={section} nested>
                    <NavRowLabel>{section}</NavRowLabel>
                  </NavRow>
                ))}
              </NavBranch>
            ) : null}
          </React.Fragment>
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
