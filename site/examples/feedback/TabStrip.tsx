import React from "react";
import { FileText, Globe, Hash, Plus, Radio } from "lucide-react";
import {
  AgentFace,
  Avatar,
  AvatarFallback,
  IconButton,
  spaceIcons,
  TabStrip,
  type TabStripGroup,
  type TabStripTab,
} from "../../../src";

const FilesIcon = spaceIcons.files;

export const meta = {
  name: "TabStrip",
  file: "navigation/TabStrip.tsx",
  about:
    "Close, drag to reorder, drop a tab on another to group them, press a group's chip to fold it. Open many tabs: they shrink to their icons, then scroll, and Search tabs lists them all.",
  wide: true,
  order: 13,
};

function TabStripDemo() {
  const [tabs, setTabs] = React.useState<TabStripTab[]>([
    { id: "a", label: "Weekly plan", icon: <FileText />, group: "launch" },
    { id: "b", label: "Research notes on the launch", icon: <FileText />, group: "launch" },
    { id: "c", label: "general", icon: <Hash /> },
    { id: "g", label: "Lo-fi radio", icon: <Radio /> },
    {
      id: "d",
      label: "Ana",
      icon: (
        <Avatar size="glyph" tone="pink">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      ),
    },
    { id: "e", label: "Writer", icon: <AgentFace size="glyph" mark="engine:claude" /> },
    { id: "f", label: "Files", icon: <FilesIcon /> },
  ]);
  const [groups, setGroups] = React.useState<TabStripGroup[]>([
    { id: "launch", label: "Launch", color: "blue" },
  ]);
  const [active, setActive] = React.useState("a");
  const [muted, setMuted] = React.useState(false);
  const opened = React.useRef(0);
  const openTab = () => {
    opened.current += 1;
    const id = `new-${opened.current}`;
    setTabs([...tabs, {
        id,
        label: `New page ${opened.current}`,
        icon: <Globe />,
        closeLabel: `Close New page ${opened.current}`,
      }]);
    setActive(id);
  };
  const move = (id: string, index: number, group: string | undefined) => {
    const moved = { ...tabs.find((tab) => tab.id === id)!, group };
    const rest = tabs.filter((tab) => tab.id !== id);
    rest.splice(index, 0, moved);
    setTabs(rest);
  };
  return (
    <TabStrip
      label="Open tabs"
      tabs={tabs.map((tab) =>
        tab.id === "g" ? { ...tab, sound: { muted, onToggle: () => setMuted(!muted) } } : tab,
      )}
      groups={groups}
      active={active}
      onSelect={setActive}
      onClose={(id) => setTabs(tabs.filter((tab) => tab.id !== id))}
      after={
        <IconButton label="New tab" onClick={openTab}>
          <Plus />
        </IconButton>
      }
      onToggleGroup={(id) =>
        setGroups(
          groups.map((group) =>
            group.id === id ? { ...group, collapsed: !group.collapsed } : group,
          ),
        )
      }
      onReorder={(id, index, group) => move(id, index, group ?? undefined)}
      onDropOnTab={(id, target) => {
        const group = tabs.find((tab) => tab.id === target)?.group ?? "launch";
        const rest = tabs.filter((tab) => tab.id !== id);
        move(id, rest.findIndex((tab) => tab.id === target) + 1, group);
      }}
      onDropOnGroup={(id, group) => {
        const rest = tabs.filter((tab) => tab.id !== id);
        const end = rest.map((tab) => tab.group).lastIndexOf(group);
        move(id, end + 1, group);
      }}
    />
  );
}

export default function Example() {
  return <TabStripDemo />;
}
