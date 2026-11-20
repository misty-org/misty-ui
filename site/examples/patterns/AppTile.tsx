import { AddAppTile, AppTile } from "../../../src";

export const meta = {
  name: "AppTile · AddAppTile",
  file: "patterns/home/AppTile.tsx",
  about: "",
  wide: false,
  order: 7,
};

export default function Example() {
  return (
    <div className="flex gap-3">
      <AppTile app="docs" label="Docs" />
      <AppTile app="calendar" label="Calendar" badge={2} />
      <AppTile app="code" label="Code" />
      <AddAppTile />
    </div>
  );
}
