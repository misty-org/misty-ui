import { Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, SpaceDock, SpaceDockItem, Surface } from "../../../src";

export const meta = {
  name: "SpaceDock",
  file: "navigation/SpaceDock.tsx",
  about: "",
  wide: false,
  order: 16,
};

const tile = (initials: string) => (
  <Avatar shape="tile" edge>
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);

export default function SpaceDockExample() {
  return (
    <Surface tone="chrome" className="w-64 px-2.5">
      <SpaceDock label="Spaces">
        <SpaceDockItem label="Harbor" selected>
          {tile("HA")}
        </SpaceDockItem>
        <SpaceDockItem label="Kiln" count={3}>
          {tile("KI")}
        </SpaceDockItem>
        <SpaceDockItem label="Northwind">{tile("NO")}</SpaceDockItem>
        <SpaceDockItem label="Lumen">{tile("LU")}</SpaceDockItem>
        <SpaceDockItem label="Orchard" state="waiting">
          {tile("OR")}
        </SpaceDockItem>
        <SpaceDockItem label="All Spaces" count={12}>
          <Ellipsis aria-hidden="true" />
        </SpaceDockItem>
      </SpaceDock>
    </Surface>
  );
}
