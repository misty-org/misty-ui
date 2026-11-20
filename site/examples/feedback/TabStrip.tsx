import React from "react";
import { FileText, Globe, Terminal } from "lucide-react";
import { TabStrip } from "../../../src";

export const meta = {
  name: "TabStrip",
  file: "navigation/TabStrip.tsx",
  about: "Close, drag to reorder, narrow the window to see them shrink.",
  wide: true,
  order: 13,
};

function TabStripDemo() {
  const [tabs, setTabs] = React.useState([
    { id: "a", label: "Weekly plan", icon: <FileText /> },
    { id: "b", label: "Research notes on the launch", icon: <FileText /> },
    { id: "c", label: "Terminal", icon: <Terminal /> },
    { id: "d", label: "example.com", icon: <Globe /> },
  ]);
  const [active, setActive] = React.useState("a");
  return (
    <TabStrip
      label="Open tabs"
      tabs={tabs}
      active={active}
      onSelect={setActive}
      onClose={(id) => setTabs(tabs.filter((tab) => tab.id !== id))}
      onReorder={(id, index) => {
        const moved = tabs.find((tab) => tab.id === id)!;
        const rest = tabs.filter((tab) => tab.id !== id);
        rest.splice(index, 0, moved);
        setTabs(rest);
      }}
    />
  );
}

export default function Example() {
  return <TabStripDemo />;
}
