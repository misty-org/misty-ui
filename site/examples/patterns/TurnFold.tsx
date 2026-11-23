import React from "react";
import {
  Button,
  Text,
  ToolBody,
  ToolLines,
  ToolList,
  ToolNote,
  ToolPath,
  ToolRow,
  TurnChanges,
  TurnFold,
  TurnStatus,
} from "../../../src";

export const meta = {
  name: "TurnFold · ToolList · ToolRow · ToolPath · ToolLines · ToolBody · ToolNote · TurnStatus · TurnChanges",
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
      <TurnFold
        summary="Edited side_panel.css, ran 2 commands"
        meta="1m 48s"
        open={open}
        onToggle={() => setOpen(!open)}
      />
      {open ? (
        <>
          <ToolList label="Steps">
            <li>
              <ToolRow name="Explored" target="4 files, 2 searches" />
            </li>
            <li>
              <ToolRow
                name="Edited"
                target={<ToolPath path="src/shared/ui/layout/side_panel.css" />}
                meta={<ToolLines added={2} removed={6} />}
                open={rowOpen}
                onToggle={() => setRowOpen(!rowOpen)}
              />
              {rowOpen ? (
                <ToolBody>
                  <Text size="meta" tone="muted">
                    Removed the side card's shadow.
                  </Text>
                </ToolBody>
              ) : null}
            </li>
            <li>
              <ToolRow name="Ran" target="npm test" meta="exit 1" state="failed" />
            </li>
          </ToolList>
          <ToolNote>The snapshot still had the shadow. Updating it.</ToolNote>
          <ToolList label="Steps">
            <li>
              <ToolRow name="Ran" target="npm run design:catalog" state="running" />
            </li>
            <li>
              <ToolRow name="Wants to run" target="npm test -- --update" state="waiting" />
            </li>
          </ToolList>
        </>
      ) : null}
      <TurnStatus phrase="Running npm test" elapsed="1m 12s" />
      <TurnChanges
        files={[
          { path: "src/shared/ui/layout/side_panel.css", added: 2, removed: 6 },
          { path: "src/shared/ui/layout/sidePanel.test.tsx", added: 14 },
        ]}
        action={<Button size="sm">Review changes</Button>}
      />
    </div>
  );
}

export default function Example() {
  return <TimelineDemo />;
}
