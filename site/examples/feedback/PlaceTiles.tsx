import { PlaceTile, PlaceTiles, spaceIcons, Surface } from "../../../src";

export const meta = {
  name: "PlaceTiles",
  file: "navigation/PlaceTiles.tsx",
  about: "",
  wide: false,
  order: 18,
};

export default function PlaceTilesExample() {
  const Files = spaceIcons.files;
  const Apps = spaceIcons.apps;
  const Browser = spaceIcons.browser;
  const Explore = spaceIcons.explore;
  return (
    <Surface tone="chrome" className="w-64 p-2.5">
      <PlaceTiles label="Places">
        <PlaceTile label="Files" selected>
          <Files aria-hidden="true" />
        </PlaceTile>
        <PlaceTile label="Apps">
          <Apps aria-hidden="true" />
        </PlaceTile>
        <PlaceTile label="Browser">
          <Browser aria-hidden="true" />
        </PlaceTile>
        <PlaceTile label="Explore">
          <Explore aria-hidden="true" />
        </PlaceTile>
      </PlaceTiles>
    </Surface>
  );
}
