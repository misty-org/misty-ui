import { FileText, Pencil, Trash2 } from "lucide-react";
import { Badge, ListRow, ListRowSkeleton, MenuItem } from "../../../src";

export const meta = {
  name: "ListRow · ListRowSkeleton",
  file: "display/ListRow.tsx",
  about: "States at the end; hover a row for its ⋯.",
  wide: true,
  order: 2,
};

const row = "flex flex-wrap items-center gap-3";

const hour = 60 * 60 * 1000;

export default function Example() {
  return (
    <div className="grid max-w-xl">
      <ListRow
        label="Plan for the week"
        state={{ kind: "time", at: Date.now() - 2 * hour }}
        menu={<MenuItem icon={Pencil} label="Rename" />}
        onOpen={() => undefined}
      />
      <ListRow label="Fix the flaky test" state={{ kind: "working" }} onOpen={() => undefined} />
      <ListRow label="Which branch should I use?" state={{ kind: "waiting" }} onOpen={() => undefined} />
      <ListRow label="New reply from Ada" state={{ kind: "unread" }} onOpen={() => undefined} />
      <ListRow label="Selected row" selected onOpen={() => undefined} />
      <ListRow
        label="Anthropologist"
        description="Expert in cultural systems, rituals and kinship"
        badge={<Badge>Academic</Badge>}
        onOpen={() => undefined}
        menu={<MenuItem icon={Trash2} label="Remove" danger />}
      />
      <ListRow
        label="report.pdf"
        leading={FileText}
        leadingTone="red"
        state={{ kind: "time", at: Date.now() - 30 * hour }}
        onOpen={() => undefined}
      />
      <ListRowSkeleton label="Chats" />
    </div>
  );
}
