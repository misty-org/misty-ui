import React from "react";
import { Pencil, Search, Terminal } from "lucide-react";
import { Text, ToolBody, ToolLines, ToolList, ToolNote, ToolPath, ToolRow, TurnFold } from "../../../src";

export const meta = {
  name: "TurnFold · ToolList · ToolRow · ToolPath · ToolLines · ToolBody · ToolNote",
  file: "patterns/ToolTimeline.tsx",
  about: "",
  wide: true,
  order: 13,
};

const catalog = [
  {
    title: "Anthropologist",
    maker: "agency-agents",
    tag: "Academic",
    description:
      "Expert in cultural systems, rituals, kinship and ethnographic method: builds societies that feel lived-in.",
  },
  {
    title: "UI Designer",
    maker: "agency-agents",
    tag: "Design",
    description: "Visual design systems, component libraries and pixel-perfect interfaces.",
  },
  {
    title: "Statistician",
    maker: "agency-agents",
    tag: "Academic",
    description: "Quantitative research methods, experimental design and statistical inference.",
  },
];

function TimelineDemo() {
  const [open, setOpen] = React.useState(true);
  const [rowOpen, setRowOpen] = React.useState(false);
  return (
    <div className="grid gap-2">
      <TurnFold summary="Edited 3 files, ran 2 commands" open={open} onToggle={() => setOpen(!open)} />
      {open ? (
        <ToolList label="Steps">
          <li>
            <ToolRow icon={Search} name="Searched" target="design tokens" meta="12 results" state="done" />
          </li>
          <li>
            <ToolRow
              icon={Pencil}
              name="Edited"
              target={<ToolPath path="src/shared/ui/layout/sidePanel.css" />}
              meta={<ToolLines added={2} removed={6} />}
              state="done"
              open={rowOpen}
              onToggle={() => setRowOpen(!rowOpen)}
            />
            {rowOpen ? (
              <ToolBody onFold={() => setRowOpen(false)}>
                <Text size="meta" tone="muted">
                  Removed the side card's shadow.
                </Text>
              </ToolBody>
            ) : null}
          </li>
          <li>
            <ToolRow icon={Terminal} name="Ran" target="npm run design:catalog" state="running" />
          </li>
          <li>
            <ToolRow icon={Terminal} name="Ran" target="npm test" state="failed" />
          </li>
          <li>
            <ToolNote>Next I'll regenerate the catalog.</ToolNote>
          </li>
        </ToolList>
      ) : null}
    </div>
  );
}

export default function Example() {
  return <TimelineDemo />;
}
