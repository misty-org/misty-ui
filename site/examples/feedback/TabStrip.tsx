import React from "react";
import { FileText, Globe, Terminal } from "lucide-react";
import { TabStrip, type TabStripGroup, type TabStripTab } from "../../../src";

export const meta = {
  name: "TabStrip",
  file: "navigation/TabStrip.tsx",
  about:
    "Close, drag to reorder, drop a tab on another to group them, press a group's chip to fold it.",
  wide: true,
  order: 13,
};

function TabStripDemo() {
  const [tabs, setTabs] = React.useState<TabStripTab[]>([
    { id: "a", label: "Weekly plan", icon: <FileText />, group: "launch" },
    { id: "b", label: "Research notes on the launch", icon: <FileText />, group: "launch" },
    { id: "c", label: "Terminal", icon: <Terminal /> },
    { id: "d", label: "example.com", icon: <Globe /> },
  ]);
  const [groups, setGroups] = React.useState<TabStripGroup[]>([
    { id: "launch", label: "Launch", color: "blue" },
  ]);
  const [active, setActive] = React.useState("a");
  const move = (id: string, index: number, group: string | undefined) => {
    const moved = { ...tabs.find((tab) => tab.id === id)!, group };
    const rest = tabs.filter((tab) => tab.id !== id);
    rest.splice(index, 0, moved);
    setTabs(rest);
  };
  return (
    <TabStrip
      label="Open tabs"
      tabs={tabs}
      groups={groups}
      active={active}
      onSelect={setActive}
      onClose={(id) => setTabs(tabs.filter((tab) => tab.id !== id))}
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
