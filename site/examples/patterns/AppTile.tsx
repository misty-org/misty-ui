import {
  AddAppTile,
  AgentTile,
  AppLogoImage,
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
        <AppTile mark={<AppLogoImage name="Excalidraw" size="launcher" />} label="Excalidraw" />
        <AppTile mark={<AppLogoImage name="Penpot" size="launcher" />} label="Penpot" badge={2} />
        <AppTile mark={<AppLogoImage name="Kdenlive" size="launcher" />} label="Kdenlive" />
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
