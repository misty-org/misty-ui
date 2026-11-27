import { useState } from "react";
import { User, Users } from "lucide-react";
import { PlaceSwitch, Surface } from "../../../src";

export const meta = {
  name: "PlaceSwitch",
  file: "navigation/PlaceSwitch.tsx",
  about: "",
  wide: false,
  order: 17,
};

type Place = "personal" | "spaces";

export default function PlaceSwitchExample() {
  const [place, setPlace] = useState<Place>("spaces");
  return (
    <Surface tone="chrome" className="w-fit p-3">
      <PlaceSwitch<Place>
        label="Place"
        value={place}
        onChange={setPlace}
        options={[
          {
            value: "personal",
            label: "Personal",
            icon: <User aria-hidden="true" />,
            waiting: true,
          },
          {
            value: "spaces",
            label: "Shared Spaces",
            icon: <Users aria-hidden="true" />,
          },
        ]}
      />
    </Surface>
  );
}
