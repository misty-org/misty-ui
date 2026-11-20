import {
  AddAppTile,
  AgentTile,
  AppTile,
  Avatar,
  AvatarFallback,
} from "../../../src";

export const meta = {
  name: "AppTile · AddAppTile · AgentTile",
  file: "patterns/home/AppTile.tsx",
  about: "",
  wide: false,
  order: 7,
};

const face = (initials: string, tone: "violet" | "teal") => (
  <Avatar size="xl" tone={tone} className="size-14">
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);

export default function Example() {
  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <AppTile app="docs" label="Docs" />
        <AppTile app="calendar" label="Calendar" badge={2} />
        <AppTile app="code" label="Code" />
        <AddAppTile />
      </div>
      <div className="flex gap-3">
        <AgentTile
          face={face("J", "violet")}
          label="Juno"
          line="Writing the launch plan"
          state="working"
        />
        <AgentTile
          face={face("P", "teal")}
          label="Pixel"
          line="Needs you"
          state="waiting"
        />
        <AgentTile face={face("S", "violet")} label="Scout" line="Ready" />
        <AddAppTile label="New agent" />
      </div>
    </div>
  );
}
