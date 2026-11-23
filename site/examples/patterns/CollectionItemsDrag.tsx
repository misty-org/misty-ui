import { useState, type MouseEvent, type ReactNode } from "react";
import { FileText, Folder, Image } from "lucide-react";
import {
  CollectionItems,
  CollectionViewToggle,
  TagDots,
  notify,
  type CollectionItem,
} from "../../../src";

export const meta = {
  name: "CollectionItems (drag)",
  file: "patterns/collection/collection_drag.ts",
  about: "Files that move by dragging: drop on a folder or the background, ⌥ to copy. Tags sit after the name.",
  wide: true,
  order: 4,
};

type Entry = {
  id: string;
  title: string;
  icon: ReactNode;
  folder?: boolean;
  tags?: { name: string; color: number }[];
};

const files: Entry[] = [
  { id: "Plans", title: "Plans", icon: <Folder />, folder: true },
  { id: "Archive", title: "Archive", icon: <Folder />, folder: true },
  { id: "Budget.md", title: "Budget.md", icon: <FileText />, tags: [{ name: "Work", color: 6 }] },
  { id: "Moodboard.png", title: "Moodboard.png", icon: <Image />, tags: [{ name: "Home", color: 4 }, { name: "Later", color: 5 }] },
];

export default function Example() {
  const [view, setView] = useState<"list" | "grid" | "columns">("list");
  const [picked, setPicked] = useState<string[]>([]);
  const select = (event: MouseEvent, id: string) =>
    setPicked((current) =>
      event.metaKey ? (current.includes(id) ? current.filter((one) => one !== id) : [...current, id]) : [id],
    );
  const items: CollectionItem[] = files.map((file) => ({
    id: file.id,
    title: file.title,
    icon: file.icon,
    category: file.folder ? "Folder" : "File",
    updated: "Today",
    selectable: true,
    dropTarget: file.folder === true,
    marks: file.tags ? <TagDots tags={file.tags} /> : undefined,
    onOpen: () => undefined,
  }));
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-end">
        <CollectionViewToggle
          value={view === "grid" ? "grid" : "list"}
          onChange={setView}
          columns={{ active: view === "columns", onSelect: () => setView("columns") }}
        />
      </div>
      <CollectionItems
        items={items}
        view={view === "grid" ? "grid" : "list"}
        gridLayout="compact"
        selectedIds={picked}
        onSelect={select}
        drag={{
          onDrop: (target, ids, copy) =>
            notify({ message: `${copy ? "Copied" : "Moved"} ${ids.join(", ")} to ${target ?? "this folder"}` }),
          canDrop: (target) => files.some((file) => file.id === target && file.folder),
        }}
      />
    </div>
  );
}
