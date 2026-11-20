import { InfoCorner } from "../../../src";

export const meta = {
  name: "InfoCorner",
  file: "overlays/InfoCorner.tsx",
  about: "",
  wide: false,
  order: 16,
};

export default function Example() {
  return (
    <InfoCorner
      label="About Explore"
      title="Explore"
      body="Agents and apps you can add to this Space."
      action={{ label: "Take the tour", onSelect: () => undefined }}
    />
  );
}
