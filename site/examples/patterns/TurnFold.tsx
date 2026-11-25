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
  TurnTasks,
} from "../../../src";

export const meta = {
  name: "TurnFold · TurnPictures · ToolList · ToolRow · ToolPath · ToolLines · ToolBody · ToolNote · TurnTasks · TurnStatus · TurnChanges",
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

const screen = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#1c1c1c"/><rect x="10" y="10" width="40" height="80" fill="#262626"/><rect x="60" y="20" width="${fill}" height="8" fill="#3a3a3a"/></svg>`,
  )}`;

function TimelineDemo() {
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [rowOpen, setRowOpen] = React.useState(false);
  return (
    <div className="grid gap-2">
      <TurnFold
        summary="Made 1 edit and ran 2 commands, 1 failed"
        pictures={[
          { src: screen("60"), label: "Captured the window" },
          { src: screen("90"), label: "Captured the window" },
        ]}
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
      <ToolRow
        name="Edited"
        target={<ToolPath path="src/shared/ui/layout/side_panel.css" />}
        meta={<ToolLines added={23} />}
        open={false}
        onToggle={() => {}}
      />
      <TurnTasks
        label="Tasks"
        tasks={[
          { id: "1", title: "Find why the side card has a shadow", state: "done" },
          { id: "2", title: "Remove it from the shared styles", state: "working" },
          { id: "3", title: "Update the snapshot", state: "pending" },
        ]}
      />
      <TurnStatus
        phrase="Running npm test"
        elapsed="1m 12s"
        open={statusOpen}
        onToggle={() => setStatusOpen(!statusOpen)}
      />
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
