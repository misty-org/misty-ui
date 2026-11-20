import { BookOpen, FileText, Hash } from "lucide-react";
import { PlaceChip, type CollectionItem } from "../../../src";

export const meta = {
  name: "PlaceChip",
  file: "patterns/home/HomeSection.tsx",
  about: "",
  wide: false,
  order: 6,
};

const row = "flex flex-wrap items-center gap-3";

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

export default function Example() {
  return (
    <div className={row}>
      <PlaceChip icon={FileText} label="Notes" />
      <PlaceChip icon={BookOpen} label="Lab" pressed />
      <PlaceChip icon={Hash} label="Channels" />
    </div>
  );
}
