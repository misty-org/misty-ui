import { Compass, FolderOpen, Globe2, Plus } from "lucide-react";
import { Avatar, AvatarFallback, SpaceRail, SpaceRailItem, Surface } from "../../../src";

export const meta = {
  name: "SpaceRail",
  file: "navigation/SpaceRail.tsx",
  about: "",
  wide: false,
  order: 16,
};

const tile = (initials: string) => (
  <Avatar shape="tile" edge>
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);

export default function SpaceRailExample() {
  return (
    <Surface tone="sidebar" className="h-96 w-fit">
      <SpaceRail
        label="Spaces"
        start={
          <>
            <SpaceRailItem label="Personal" count={3} onSelect={() => {}}>
              <Avatar shape="tile">
                <AvatarFallback>MI</AvatarFallback>
              </Avatar>
            </SpaceRailItem>
            <SpaceRailItem label="Files" onSelect={() => {}}>
              <FolderOpen aria-hidden="true" />
            </SpaceRailItem>
            <SpaceRailItem label="Browser" onSelect={() => {}}>
              <Globe2 aria-hidden="true" />
            </SpaceRailItem>
            <SpaceRailItem label="Explore" onSelect={() => {}}>
              <Compass aria-hidden="true" />
            </SpaceRailItem>
          </>
        }
      >
        <SpaceRailItem label="Harbor" selected count={2} waiting onSelect={() => {}}>
          {tile("HA")}
        </SpaceRailItem>
        <SpaceRailItem label="Launch crew" onSelect={() => {}}>
          {tile("LC")}
        </SpaceRailItem>
        <SpaceRailItem label="New Space" onSelect={() => {}}>
          <Plus aria-hidden="true" />
        </SpaceRailItem>
      </SpaceRail>
    </Surface>
  );
}
