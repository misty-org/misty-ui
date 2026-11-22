import React from "react";
import { ArrowDownAZ, BookOpen, Clock, FileText, Plus } from "lucide-react";
import {
  CollectionFilterMenu,
  CollectionControls,
  CollectionHeading,
  CollectionItems,
  CollectionPage,
  CollectionSearch,
  CollectionSortMenu,
  CollectionViewToggle,
  type CollectionItem,
} from "../../../src";

export const meta = {
  name: "CollectionPage · CollectionHeading · CollectionSearch · CollectionControls · CollectionFilterMenu · CollectionSortMenu · CollectionViewToggle · CollectionItems",
  file: "patterns/collection/*",
  about: "A whole collection page; narrow the box to watch the bar give way.",
  wide: true,
  order: 1,
};

/** A box to narrow by its corner, for pieces that give way as they shrink. */
function ResizableBox(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`min-w-48 resize-x overflow-hidden rounded-lg border border-dashed border-charcoal-border ${props.className ?? ""}`}
    >
      {props.children}
    </div>
  );
}

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

function CollectionDemo() {
  const [view, setView] = React.useState<"list" | "grid">("list");
  const [sort, setSort] = React.useState("recent");
  const [kind, setKind] = React.useState("any");
  const [query, setQuery] = React.useState("");
  return (
    <ResizableBox className="h-120">
      <CollectionPage>
        <CollectionHeading
          title="Library"
          actions={[{ id: "new", icon: Plus, label: "New note", priority: 1, variant: "primary" }]}
        />
        <div className="grid gap-3 p-4">
          <CollectionSearch
            aria-label="Find in the library"
            placeholder="Find in the library"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
          <CollectionControls
            filterControl={
              <CollectionFilterMenu
                label="Filter"
                active={kind !== "any"}
                onReset={() => setKind("any")}
                groups={[
                  {
                    label: "Made by",
                    value: kind,
                    defaultValue: "any",
                    onChange: setKind,
                    options: [
                      { value: "any", label: "Anyone" },
                      { value: "me", label: "Me" },
                      { value: "agents", label: "Agents" },
                    ],
                  },
                ]}
              />
            }
            actions={
              <>
                <CollectionSortMenu
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: "recent", label: "Most recent", icon: Clock },
                    { value: "name", label: "Name", icon: ArrowDownAZ },
                  ]}
                />
                <CollectionViewToggle value={view} onChange={setView} />
              </>
            }
          />
          <CollectionItems items={items} view={view} creatorLabel="Created by" listIcons />
        </div>
      </CollectionPage>
    </ResizableBox>
  );
}

export default function Example() {
  return <CollectionDemo />;
}
