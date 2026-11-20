import { FileCode, FileText, Folder } from "lucide-react";
import { TreeRow } from "../../../src";

export const meta = { name: "TreeRow", file: "display/TreeRow.tsx", about: "", wide: false, order: 3 };

export default function Example() {
  return (
    <div className="grid">
      <TreeRow label="src" depth={0} chevron expanded icon={<Folder />} onOpen={() => undefined} />
      <TreeRow
        label="App.tsx"
        depth={1}
        icon={<FileCode />}
        tone="modified"
        detail="M"
        onOpen={() => undefined}
      />
      <TreeRow
        label="new-file.ts"
        depth={1}
        icon={<FileCode />}
        tone="added"
        detail="A"
        onOpen={() => undefined}
      />
      <TreeRow
        label="old.css"
        depth={1}
        icon={<FileText />}
        tone="removed"
        detail="D"
        onOpen={() => undefined}
      />
      <TreeRow label="selected.md" depth={1} icon={<FileText />} selected onOpen={() => undefined} />
    </div>
  );
}
