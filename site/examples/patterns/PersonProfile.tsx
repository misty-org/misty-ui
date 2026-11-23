import {
  Avatar,
  AvatarFallback,
  PersonProfile,
  PersonProfileSection,
  PresenceFace,
  Text,
} from "../../../src";

export const meta = {
  name: "PersonProfile · PersonProfileSection",
  file: "patterns/channel/PersonProfile.tsx",
  about: "",
  order: 15,
};

export default function Example() {
  return (
    <div className="h-96 w-72 overflow-hidden rounded-lg border border-charcoal-border">
      <PersonProfile
        label="Profile"
        face={
          <PresenceFace presence="online" face="xl">
            <Avatar size="xl" tone="blue">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
          </PresenceFace>
        }
        name="justnatureusa"
        line="Shipping the drive tonight"
      >
        <PersonProfileSection title="Friends since">
          <Text size="control">November 2, 2026</Text>
        </PersonProfileSection>
      </PersonProfile>
    </div>
  );
}
