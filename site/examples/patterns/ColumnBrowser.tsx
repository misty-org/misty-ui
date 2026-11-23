import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { File, FileText, Folder } from "lucide-react";
import {
  ColumnBrowser,
  MenuItem,
  PropertyList,
  TagDots,
  Text,
  type ColumnBrowserColumn,
  type ColumnBrowserRow,
} from "../../../src";

export const meta = {
  name: "ColumnBrowser",
  file: "patterns/ColumnBrowser.tsx",
  about: "Finder's column view: pick a folder and its items open in the next column.",
  wide: true,
  order: 24,
};

const tree: Record<string, ColumnBrowserRow[]> = {
  home: [
    { id: "Documents", label: "Documents", icon: <Folder />, folder: true },
    { id: "Downloads", label: "Downloads", icon: <Folder />, folder: true },
    { id: ".zshrc", label: ".zshrc", icon: <File />, folder: false, dim: true },
  ],
  Documents: [
    { id: "Documents/Plans", label: "Plans", icon: <Folder />, folder: true },
    {
      id: "Documents/Budget.md",
      label: "Budget.md",
      icon: <FileText />,
      folder: false,
      marks: <TagDots tags={[{ name: "Work", color: 6 }]} />,
    },
  ],
  Downloads: [],
  "Documents/Plans": [{ id: "Documents/Plans/Launch.md", label: "Launch.md", icon: <FileText />, folder: false }],
};

export default function Example() {
  const [path, setPath] = useState<string[]>(["Documents"]);
  const columns: ColumnBrowserColumn[] = [{ id: "home", rows: tree.home, selected: path.slice(0, 1) }];
  path.forEach((id, index) => {
    if (tree[id]) columns.push({ id, rows: tree[id], selected: path.slice(index + 1, index + 2) });
  });
  const select = (column: number, id: string, _event: MouseEvent | KeyboardEvent) =>
    setPath([...path.slice(0, column), id]);
  const picked = path[path.length - 1];
  const file = picked && !tree[picked] ? picked : undefined;
  return (
    <div className="h-72">
      <ColumnBrowser
        label="Columns"
        columns={columns}
        onSelect={select}
        onOpen={() => undefined}
        menu={() => <MenuItem label="Get info" />}
        drag={{ onDrop: () => undefined, canDrop: (target) => !!tree[target] }}
        preview={
          file ? (
            <div className="grid gap-3">
              <Text weight="medium">{file.split("/").pop()}</Text>
              <PropertyList items={[{ label: "Kind", value: "Markdown" }]} />
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
