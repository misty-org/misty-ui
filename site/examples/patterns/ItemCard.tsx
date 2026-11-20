import { FileText } from "lucide-react";
import { ItemCard, Surface } from "../../../src";

export const meta = {
  name: "ItemCard",
  file: "patterns/home/ItemCard.tsx",
  about: "",
  wide: false,
  order: 4,
};

export default function Example() {
  return (
    <div className="w-56">
      <ItemCard
        label="Note: Weekly plan"
        cover={<Surface tone="board" className="size-full" />}
        glyph={<FileText />}
        title="Weekly plan"
        meta="Edited 2h ago"
        footer="Ada"
        onClick={() => undefined}
      />
    </div>
  );
}
