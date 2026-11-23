import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { FileText, Folder } from "lucide-react";
import {
  CollectionItems,
  CollectionViewToggle,
  MenuItem,
  notify,
  type CollectionItem,
} from "../../../src";

export const meta = {
  name: "CollectionItems (long)",
  file: "patterns/collection/CollectionItems.tsx",
  about:
    "Five thousand files, drawn only where they're in view. The arrow keys move through the order shown, and the picked one is brought into view.",
  wide: true,
  order: 5,
};

const names = Array.from({ length: 5000 }, (_, index) => ({
  id: `file-${index}`,
  title: index % 9 === 0 ? `Folder ${index}` : `Notes from week ${index}.md`,
  folder: index % 9 === 0,
}));

export default function Example() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<{ key: string; descending: boolean } | null>(
    null,
  );
  const shown = useRef<{ ids: string[]; perRow: number }>({
    ids: [],
    perRow: 1,
  });
  const ordered = useMemo(() => {
    if (sort?.key !== "name") return names;
    const sorted = [...names].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true }),
    );
    return sort.descending ? sorted.reverse() : sorted;
  }, [sort]);
  const items: CollectionItem[] = useMemo(
    () =>
      ordered.map((entry) => ({
        id: entry.id,
        title: entry.title,
        icon: entry.folder ? <Folder /> : <FileText />,
        category: entry.folder ? "Folder" : "File",
        updated: "Today",
        selectable: true,
        onOpen: () => notify({ message: `Opened ${entry.title}` }),
        menu: () => (
          <MenuItem
            label="Rename"
            onSelect={() => notify({ message: `Rename ${entry.title}` })}
          />
        ),
      })),
    [ordered],
  );
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const { ids, perRow } = shown.current;
    const step =
      event.key === "ArrowDown"
        ? perRow
        : event.key === "ArrowUp"
          ? -perRow
          : event.key === "ArrowRight"
            ? 1
            : event.key === "ArrowLeft"
              ? -1
              : 0;
    if (!step || !ids.length) return;
    event.preventDefault();
    const at = picked ? ids.indexOf(picked) : -1;
    setPicked(ids[Math.min(ids.length - 1, Math.max(0, at + step))]);
  };
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-end">
        <CollectionViewToggle
          value={view}
          onChange={(next) => setView(next === "grid" ? "grid" : "list")}
        />
      </div>
      <div tabIndex={0} onKeyDown={move} className="h-96 overflow-y-auto">
        <CollectionItems
          items={items}
          view={view}
          gridLayout="icons"
          listIcons="inline"
          ordered
          sort={sort}
          onSortChange={setSort}
          selectedIds={picked ? [picked] : []}
          onSelect={(_, id) => setPicked(id)}
          onShownOrder={(ids, perRow) => {
            shown.current = { ids, perRow };
          }}
          reveal={picked}
        />
      </div>
    </div>
  );
}
