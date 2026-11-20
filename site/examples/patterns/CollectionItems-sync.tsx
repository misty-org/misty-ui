import { FileSpreadsheet, FileText, Image } from "lucide-react";
import { CollectionItems, MenuItem, type CollectionItem } from "../../../src";

export const meta = {
  name: "CollectionItems (sync)",
  file: "patterns/collection/CollectionCards.tsx",
  about: "Files in a Space's drive: each card wears its sync state bare in its corner.",
  wide: true,
  order: 3,
};

const menu = <MenuItem label="Keep downloaded" />;

const items: CollectionItem[] = [
  {
    id: "1",
    title: "Launch plan.md",
    icon: <FileText />,
    tone: "blue",
    category: "Document",
    updated: "2h ago",
    sync: "online-only",
    menu,
    onOpen: () => undefined,
  },
  {
    id: "2",
    title: "Moodboard.png",
    icon: <Image />,
    tone: "violet",
    category: "Image",
    updated: "Just now",
    sync: "downloading",
    menu,
    onOpen: () => undefined,
  },
  {
    id: "3",
    title: "Budget.xlsx",
    icon: <FileSpreadsheet />,
    tone: "green",
    category: "Sheet",
    updated: "Just now",
    sync: "uploading",
    onOpen: () => undefined,
  },
  {
    id: "4",
    title: "Draft.md",
    icon: <FileText />,
    tone: "blue",
    category: "Document",
    updated: "Yesterday",
    sync: "not-synced",
    menu,
    onOpen: () => undefined,
  },
];

export default function Example() {
  return <CollectionItems items={items} view="grid" gridLayout="compact" />;
}
