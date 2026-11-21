import { Volume2 } from "lucide-react";
import { Avatar, AvatarFallback, NavList, NavRow, NavRowLabel, Surface, VoicePerson } from "../../../src";

export const meta = {
  name: "VoicePerson",
  file: "navigation/VoicePerson.tsx",
  about: "",
  wide: false,
  order: 15,
};

const face = (initials: string) => (
  <Avatar size="xs">
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);

export default function VoicePersonExample() {
  return (
    <Surface tone="sidebar" className="w-64 p-2">
      <NavList>
        <NavRow current>
          <Volume2 aria-hidden="true" />
          <NavRowLabel bright className="flex-1">
            General
          </NavRowLabel>
        </NavRow>
        <VoicePerson avatar={face("AN")} name="Ana" speaking />
        <VoicePerson avatar={face("BE")} name="Ben" />
        <VoicePerson avatar={face("CY")} name="Cy" muted />
      </NavList>
    </Surface>
  );
}
