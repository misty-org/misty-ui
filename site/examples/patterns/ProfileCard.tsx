import { CircleUserRound, LogOut, Pencil } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSubmenu,
  MenuTrigger,
  PresenceDot,
  PresenceFace,
  ProfileCardBanner,
  ProfileCardGroup,
  ProfileCardHeader,
  ProfileCardName,
  ProfileCardStatus,
} from "../../../src";

export const meta = {
  name: "ProfileCardBanner · ProfileCardHeader · ProfileCardStatus · ProfileCardName · ProfileCardGroup",
  file: "patterns/people/ProfileCard.tsx",
  about: "",
  order: 17,
};

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MenuTrigger label="Profile" />
      </DropdownMenuTrigger>
      <DropdownMenuContent kind="card">
        <ProfileCardBanner onChange={() => undefined} />
        <ProfileCardHeader
          face={
            <PresenceFace presence="online" face="xl">
              <Avatar size="xl" tone="pink">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </PresenceFace>
          }
          status={<ProfileCardStatus emoji="🎧" text="Deep in the release" onSelect={() => undefined} />}
        />
        <ProfileCardName name="ana" line="Misty Cloud" />
        <ProfileCardGroup>
          <MenuItem icon={<Pencil />} label="Edit profile" />
          <MenuSubmenu icon={<PresenceDot presence="online" />} label="Online">
            <MenuRadioGroup value="online" onValueChange={() => undefined}>
              <MenuRadioItem value="online" label="Online" />
              <MenuRadioItem value="dnd" label="Do not disturb" />
              <MenuRadioItem value="invisible" label="Invisible" />
            </MenuRadioGroup>
          </MenuSubmenu>
        </ProfileCardGroup>
        <ProfileCardGroup>
          <MenuItem icon={<CircleUserRound />} label="Account settings" />
          <MenuItem icon={<LogOut />} label="Sign out…" />
        </ProfileCardGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
