import { BookOpen, FileText } from "lucide-react";
import { Button, HomeSection, HomeSectionHead, OverviewDot, Text, type CollectionItem } from "../../../src";

export const meta = {
  name: "HomeSection · HomeSectionHead · OverviewDot",
  file: "patterns/home/HomeSection.tsx",
  about: "",
  wide: true,
  order: 5,
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

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <HomeSection
        title="Running"
        count={2}
        attention
        panel
        action={<Button variant="quiet">See all</Button>}
      >
        <div className="grid gap-2">
          {["working", "waiting", "failed"].map((status) => (
            <div key={status} className="flex items-center gap-2">
              <OverviewDot status={status} />
              <Text size="control">{status}</Text>
            </div>
          ))}
        </div>
      </HomeSection>
      <div className="grid content-start gap-2">
        <HomeSectionHead title="Plain head" count={4} />
        <Text size="meta" tone="muted">
          A head without its section.
        </Text>
      </div>
    </div>
  );
}
