import React from "react";
import { BookOpen, FileText, Globe, Search, Terminal, Users } from "lucide-react";
import { CustomizableBar, IconButton, type BarLayout, type CollectionItem } from "../../../src";

export const meta = {
  name: "CustomizableBar",
  file: "patterns/CustomizableBar.tsx",
  about: "Drag the items; right-click the bar to hide one.",
  wide: false,
  order: 15,
};

const items: CollectionItem[] = [
  {
    id: "1",
    title: "Weekly plan",
    icon: <FileText />,
    category: "Notes",
    updated: "2h ago",
    creator: "Ada",
    onOpen: () => undefined,
  },
  {
    id: "2",
    title: "Launch research",
    icon: <BookOpen />,
    category: "Lab",
    updated: "Yesterday",
    creator: "Grace",
    onOpen: () => undefined,
  },
  {
    id: "3",
    title: "Q4 roadmap with a very long title that has to fade",
    icon: <FileText />,
    category: "Notes",
    updated: "3d ago",
    creator: "Linus",
    onOpen: () => undefined,
  },
];

function CustomizableBarDemo() {
  const [layout, setLayout] = React.useState<BarLayout>({
    order: ["search", "terminal", "browser", "people"],
    hidden: [],
  });
  const bar = {
    search: {
      label: "Search",
      node: (
        <IconButton label="Search">
          <Search />
        </IconButton>
      ),
    },
    terminal: {
      label: "Terminal",
      node: (
        <IconButton label="Terminal">
          <Terminal />
        </IconButton>
      ),
    },
    browser: {
      label: "Browser",
      node: (
        <IconButton label="Browser">
          <Globe />
        </IconButton>
      ),
    },
    people: {
      label: "People",
      node: (
        <IconButton label="People">
          <Users />
        </IconButton>
      ),
    },
  };
  return (
    <CustomizableBar
      label="Right rail"
      axis="x"
      items={bar}
      layout={layout}
      onChange={setLayout}
      onReset={() => setLayout({ order: Object.keys(bar), hidden: [] })}
      className="gap-1"
    />
  );
}

export default function Example() {
  return <CustomizableBarDemo />;
}
