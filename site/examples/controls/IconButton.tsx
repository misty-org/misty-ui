import { Calendar, Plus, Search, Settings, Trash2, X } from "lucide-react";
import { IconButton } from "../../../src";

export const meta = {
  name: "IconButton",
  file: "controls/IconButton.tsx",
  about: "Hover for its tooltip.",
  wide: false,
  order: 1,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <IconButton label="Search" shortcut="⌘F">
        <Search />
      </IconButton>
      <IconButton label="Settings" variant="secondary">
        <Settings />
      </IconButton>
      <IconButton label="Delete" variant="danger">
        <Trash2 />
      </IconButton>
      <IconButton label="New" variant="primary">
        <Plus />
      </IconButton>
      <IconButton label="Close" size="sm">
        <X />
      </IconButton>
      <IconButton label="Notifications" count={3}>
        <Calendar />
      </IconButton>
    </div>
  );
}
